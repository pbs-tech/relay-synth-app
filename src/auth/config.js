/**
 * Auth0 and API configuration.
 *
 * vue-cli only exposes variables prefixed with `VUE_APP_` to the bundle, and
 * inlines them at build time - these are baked into a deploy rather than read
 * at runtime, so every environment needs its own build. See `.env.example`.
 */

/**
 * Base URL of the serverless API. Previously hardcoded as
 * `https://api.relay-synth.tech` in every store module.
 */
export const apiBaseUrl =
    process.env.VUE_APP_API_BASE_URL || 'https://api.relay-synth.peebles.lol'

/**
 * The `aud` claim the SPA asks Auth0 for. It must equal `auth0_api_identifier`
 * in the API's tfvars, or API Gateway's JWT authorizer rejects the token. It
 * defaults to the API base URL because prod is configured that way, but dev
 * points at a different identifier, so it stays overridable.
 */
const audience = process.env.VUE_APP_AUTH0_AUDIENCE || apiBaseUrl

/**
 * Where Auth0 sends the browser back to after Universal Login. Must be listed
 * in the Auth0 application's "Allowed Callback URLs" - see README > Auth0 setup.
 */
function defaultRedirectUri() {
    if (typeof window === 'undefined') {
        return ''
    }
    return `${window.location.origin}/callback`
}

/**
 * Where Auth0 sends the browser back to after logout. Must be listed in the
 * application's "Allowed Logout URLs"; that list only permits origins here, so
 * this deliberately has no path.
 */
function defaultLogoutUri() {
    if (typeof window === 'undefined') {
        return ''
    }
    return window.location.origin
}

export const auth0Config = {
    domain: process.env.VUE_APP_AUTH0_DOMAIN || '',
    clientId: process.env.VUE_APP_AUTH0_CLIENT_ID || '',
    audience,
    redirectUri: process.env.VUE_APP_AUTH0_REDIRECT_URI || defaultRedirectUri(),
    logoutUri: process.env.VUE_APP_AUTH0_LOGOUT_URI || defaultLogoutUri()
}

/**
 * The tenant may not exist yet. Rather than throwing at import time - which
 * would take down even the pages that need no authentication, and break the
 * unit suite - callers check this and degrade to a logged-out app.
 */
export function isAuth0Configured() {
    return Boolean(auth0Config.domain && auth0Config.clientId)
}

/** Thrown lazily, at the point login is actually attempted. */
export function assertAuth0Configured() {
    if (!isAuth0Configured()) {
        throw new Error(
            'Auth0 is not configured: set VUE_APP_AUTH0_DOMAIN and ' +
                'VUE_APP_AUTH0_CLIENT_ID. Copy .env.example to .env.local - ' +
                'see README > Configuration.'
        )
    }
}
