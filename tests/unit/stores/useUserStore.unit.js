import { expect } from 'chai'
import { createPinia, setActivePinia } from 'pinia'
import {
    useUserStore,
    resetRestoreSessionForTests
} from '@/stores/useUserStore'

// Replaces the Login.vue and Signup.vue suites, which covered forms that no
// longer exist. What matters now is that the store models a session correctly
// and keeps nothing in localStorage.

describe('useUserStore', () => {
    let store

    beforeEach(() => {
        setActivePinia(createPinia())
        resetRestoreSessionForTests()
        store = useUserStore()
    })

    it('starts logged out', () => {
        expect(store.isLoggedIn).to.be.false
        expect(store.userScore).to.equal(0)
        expect(store.tutorialsCompleted).to.eql([])
        expect(store.userEmail).to.equal('')
    })

    it('restores a logged-out session when Auth0 is not configured', async () => {
        // The unit env sets no VUE_APP_AUTH0_* variables, so this is the
        // unconfigured path: it must resolve rather than throw, so the app
        // still serves its unauthenticated pages.
        await store.restoreSession()

        expect(store.initialised).to.be.true
        expect(store.isLoggedIn).to.be.false
    })

    it('runs session restoration only once', async () => {
        // Pinia wraps each action call in a fresh promise, so comparing the
        // returned promises proves nothing; count the underlying work instead.
        // The router guard awaits this on every navigation, so it has to be
        // the memoised call and not a fresh token exchange each time.
        let calls = 0
        const original = store._restoreSession

        store._restoreSession = function countedRestore() {
            calls += 1
            return original.call(this)
        }

        await Promise.all([store.restoreSession(), store.restoreSession()])
        await store.restoreSession()

        expect(calls).to.equal(1)
        expect(store.initialised).to.be.true
    })

    it('prefers the API profile email over the Auth0 one', () => {
        store.auth0User = { email: 'auth0@example.com' }
        expect(store.userEmail).to.equal('auth0@example.com')

        store.profile = { email: 'api@example.com', displayName: 'ap***@example.com' }
        expect(store.userEmail).to.equal('api@example.com')
        expect(store.displayName).to.equal('ap***@example.com')
    })

    it('counts completed tutorials', () => {
        store.tutorialsCompleted = [1, 2, 5]
        expect(store.tutorialsCompletedCount).to.equal(3)
    })

    it('matches tutorial ids across string and number forms', () => {
        // Route params arrive as strings; the API returns numbers.
        store.tutorialsCompleted = [1, 2, 5]

        expect(store.isTutorialComplete('2')).to.be.true
        expect(store.isTutorialComplete(2)).to.be.true
        expect(store.isTutorialComplete('3')).to.be.false
        expect(store.tutorialComplete).to.be.false
    })

    it('clears every field on reset', () => {
        store.isAuthenticated = true
        store.auth0User = { email: 'a@example.com' }
        store.profile = { email: 'a@example.com' }
        store.userScore = 250
        store.tutorialsCompleted = [1, 2]
        store.tutorialComplete = true

        store.reset()

        expect(store.isLoggedIn).to.be.false
        expect(store.auth0User).to.be.null
        expect(store.profile).to.be.null
        expect(store.userScore).to.equal(0)
        expect(store.tutorialsCompleted).to.eql([])
        expect(store.tutorialComplete).to.be.false
    })

    it('exposes no login, signup or score-update actions', () => {
        // These posted credentials and self-reported scores to endpoints that
        // no longer exist; their removal is the point of the migration.
        expect(store.login).to.be.undefined
        expect(store.signup).to.be.undefined
        expect(store.updateScore).to.be.undefined
        expect(store.updateTutorialsCompleted).to.be.undefined
    })
})
