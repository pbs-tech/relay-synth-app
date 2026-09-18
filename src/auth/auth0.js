import { createAuth0Client } from '@auth0/auth0-spa-js'
import { assertAuth0Configured, auth0Config, isAuth0Configured } from './config'

/**
 * The Auth0 SPA client, created once and shared.
 *
 * Deliberate configuration choices:
 *
 * - `cacheLocation: 'memory'` (the SDK default, set explicitly to document it):
 *   no token is written to `localStorage`. The old implementation persisted a
 *   JWT there, where any XSS on the origin could read it.
 * - `useRefreshTokens` with the resource server's rotating refresh tokens, so a
 *   one-hour access token renews without a full redirect.
 * - `useRefreshTokensFallback: false`: never silently fall back to the hidden
 *   iframe grant, which fails under third-party cookie blocking anyway and
 *   masks the real cause when it does.
 *
 * Because the cache is in memory, a full page reload has no refresh token to
 * use and falls back to `checkSession()` - a silent iframe against the Auth0
 * session cookie. Browsers that block third-party cookies will drop the session
 * on reload unless the tenant is reached through an Auth0 custom domain on this
 * site's own parent domain. See README > Auth0 setup.
 */
let clientPromise = null

export function getAuth0Client() {
    assertAuth0Configured()

    if (!clientPromise) {
        clientPromise = createAuth0Client({
            domain: auth0Config.domain,
            clientId: auth0Config.clientId,
            authorizationParams: {
                audience: auth0Config.audience,
                redirect_uri: auth0Config.redirectUri,
                // `offline_access` is what mints the refresh token; the resource
                // server sets allow_offline_access = true to permit it.
                scope: 'openid profile email offline_access'
            },
            useRefreshTokens: true,
            useRefreshTokensFallback: false,
            cacheLocation: 'memory'
        })
    }

    return clientPromise
}

/**
 * Lets the Cypress suite supply a token obtained out of band, since an
 * in-memory cache cannot be seeded from outside the app. Only ever set from the
 * `window.Cypress` guard in main.js - never in a production bundle.
 */
let injectedAccessToken = null

export function injectAccessToken(token) {
    injectedAccessToken = token || null
}

export function hasInjectedAccessToken() {
    return injectedAccessToken !== null
}

/**
 * Current access token, or null when there is no usable session.
 *
 * Returning null rather than throwing keeps a logged-out visitor's stray
 * request from becoming an unhandled rejection: it goes out unauthenticated,
 * the API answers 401, and the response interceptor handles it in one place.
 */
export async function getAccessToken() {
    if (injectedAccessToken) {
        return injectedAccessToken
    }

    if (!isAuth0Configured()) {
        return null
    }

    const client = await getAuth0Client()

    if (!(await client.isAuthenticated())) {
        return null
    }

    try {
        return await client.getTokenSilently()
    } catch (err) {
        // login_required, consent_required, or a refresh token that has been
        // rotated out from under us. All mean: no session, sign in again.
        return null
    }
}
