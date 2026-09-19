import { defineStore } from 'pinia'
import http from '@/api/http'
import { getAuth0Client, hasInjectedAccessToken } from '@/auth/auth0'
import { auth0Config, isAuth0Configured } from '@/auth/config'

/**
 * True while the browser is sitting on Auth0's redirect back to us, before the
 * code has been exchanged. Matches the SDK's own check.
 */
function hasPendingRedirectCallback() {
    if (typeof window === 'undefined') {
        return false
    }

    const params = new URLSearchParams(window.location.search)

    return (
        (params.has('code') || params.has('error')) && params.has('state')
    )
}

/**
 * Session state, backed by Auth0 Universal Login.
 *
 * The hand-rolled `login`/`signup` actions that POSTed credentials to the API
 * are gone - those endpoints no longer exist. Nothing here is persisted to
 * `localStorage`: the access token lives in the Auth0 client's in-memory cache,
 * and the score and completion list are read back from `GET /user/profile`,
 * which is authoritative. The old copies in `localStorage` could drift from the
 * server indefinitely and survived a logout on a shared machine.
 */

/**
 * `restoreSession` is called from the router guard, so it can fire several
 * times before the first call settles. Memoising the in-flight promise means
 * the redirect-callback exchange and the profile fetch each happen once.
 */
let restorePromise = null

export const useUserStore = defineStore('user', {
    state: () => ({
        status: '',
        isAuthenticated: false,
        /** Auth0 profile: sub, email, nickname, picture. Null when logged out. */
        auth0User: null,
        /** Our own profile from GET /user/profile. */
        profile: null,
        userScore: 0,
        tutorialsCompleted: [],
        tutorialComplete: false,
        initialised: false
    }),

    getters: {
        isLoggedIn: (state) => state.isAuthenticated,
        authStatus: (state) => state.status,
        tutorialsCompletedCount: (state) => state.tutorialsCompleted.length,
        /**
         * Shown in the nav drawer. The API profile is preferred because the
         * Auth0 one is only present once the SDK has loaded the user.
         */
        userEmail: (state) =>
            (state.profile && state.profile.email) ||
            (state.auth0User && state.auth0User.email) ||
            '',
        displayName: (state) =>
            (state.profile && state.profile.displayName) ||
            (state.auth0User && state.auth0User.nickname) ||
            ''
    },

    actions: {
        /**
         * Brings the store in line with whatever session the Auth0 client has.
         * Idempotent, and safe to await from the router guard on every
         * navigation.
         */
        restoreSession() {
            if (!restorePromise) {
                restorePromise = this._restoreSession()
            }
            return restorePromise
        },

        async _restoreSession() {
            // An unconfigured tenant is not an error: the app still serves Home,
            // About and Play, and the nav shows a login button that explains.
            if (!isAuth0Configured() && !hasInjectedAccessToken()) {
                this.initialised = true
                return
            }

            // On /callback the authorization code has not been exchanged yet, so
            // there is no session to restore and asking for one would race the
            // exchange: this would see an unauthenticated client, fail its
            // profile fetch, and clear the session `handleRedirectCallback` had
            // just established. That action owns this route.
            if (hasPendingRedirectCallback()) {
                return
            }

            try {
                if (hasInjectedAccessToken()) {
                    this.isAuthenticated = true
                } else {
                    const client = await getAuth0Client()
                    this.isAuthenticated = await client.isAuthenticated()

                    if (this.isAuthenticated) {
                        this.auth0User = (await client.getUser()) || null
                    }
                }

                if (this.isAuthenticated) {
                    await this.fetchProfile()
                }
            } catch (err) {
                this.isAuthenticated = false
                this.auth0User = null
            } finally {
                this.initialised = true
            }
        },

        /**
         * Sends the browser to Universal Login. `appState` carries the route the
         * user was heading for so the callback can put them back there.
         */
        async loginWithRedirect(targetPath, authorizationParams = {}) {
            const client = await getAuth0Client()
            this.status = 'loading'

            return client.loginWithRedirect({
                appState: { targetPath: targetPath || '/' },
                authorizationParams
            })
        },

        /** Universal Login's signup tab, for the nav's Signup button. */
        signupWithRedirect(targetPath) {
            return this.loginWithRedirect(targetPath, { screen_hint: 'signup' })
        },

        /**
         * Completes the authorization-code exchange on /callback. Returns the
         * path to send the user to.
         */
        async handleRedirectCallback() {
            const client = await getAuth0Client()

            try {
                const result = await client.handleRedirectCallback()
                this.isAuthenticated = await client.isAuthenticated()
                this.auth0User = (await client.getUser()) || null

                if (this.isAuthenticated) {
                    await this.fetchProfile()
                }

                this.status = 'success'
                this.initialised = true
                // Later navigations must not re-run the exchange; the code in
                // the URL is single-use.
                restorePromise = Promise.resolve()

                return (result && result.appState && result.appState.targetPath) || '/'
            } catch (err) {
                this.status = 'error'
                this.reset()
                throw err
            }
        },

        /**
         * Reads the caller's profile. The server creates it on first sight, so
         * this doubles as account provisioning for a brand new Auth0 user.
         */
        async fetchProfile() {
            const { data } = await http.get('/user/profile')

            this.profile = data
            this.userScore = data.totalScore || 0
            this.tutorialsCompleted = data.tutorialsCompleted || []

            return data
        },

        /**
         * Marks a tutorial complete. Replaces the `updateScore` and
         * `updateTutorialsCompleted` pair, which sent the target email and the
         * score to award in the request body - so any logged-in user could
         * award themselves an arbitrary score, or edit another account. The
         * server now takes identity from the verified token and reads the point
         * value from the tutorial record.
         */
        async completeTutorial(tutorialNumber) {
            this.status = 'loading'

            try {
                const { data } = await http.post(
                    `/user/tutorials/${tutorialNumber}/complete`
                )

                this.userScore = data.totalScore
                this.tutorialsCompleted = data.tutorialsCompleted
                this.tutorialComplete = true
                this.status = 'success'

                return data
            } catch (err) {
                this.status = 'error'
                throw err
            }
        },

        /** Clears local state without touching Auth0. */
        reset() {
            this.status = ''
            this.isAuthenticated = false
            this.auth0User = null
            this.profile = null
            this.userScore = 0
            this.tutorialsCompleted = []
            this.tutorialComplete = false
        },

        /**
         * Ends the Auth0 session as well as the local one, so the next login
         * really does prompt rather than silently re-authenticating.
         */
        async logout() {
            this.reset()
            restorePromise = Promise.resolve()

            if (!isAuth0Configured()) {
                return
            }

            const client = await getAuth0Client()

            return client.logout({
                logoutParams: { returnTo: auth0Config.logoutUri }
            })
        },

        /**
         * Tutorial ids arrive from the route as strings; the API returns
         * numbers. Compare as numbers rather than relying on `==`.
         */
        isTutorialComplete(tutorialId) {
            const target = Number(tutorialId)

            this.tutorialComplete = this.tutorialsCompleted.some(
                (completed) => Number(completed) === target
            )

            return this.tutorialComplete
        },

        setTutorialComplete(completed) {
            this.tutorialComplete = completed
        }
    }
})

/** Test seam: lets the unit suite reset the memoised restore between cases. */
export function resetRestoreSessionForTests() {
    restorePromise = null
}
