/**
 * Auth0 and API configuration.
 *
 * The values come from `@/config/runtime`: `/config.json` when the deploy ships
 * one, the build-time `VUE_APP_*` variables otherwise. See `.env.example`.
 *
 * Everything here is a function rather than a constant because the runtime file
 * is fetched during bootstrap, which resolves after this module is imported.
 * A constant would capture the build-time value and never see the fetched one.
 */

import { configValue } from '@/config/runtime'

/**
 * Base URL of the serverless API. Previously hardcoded as
 * `https://api.relay-synth.tech` in every store module.
 */
export function getApiBaseUrl() {
    return configValue('API_BASE_URL') || 'https://api.relay-synth.peebles.lol'
}

/**
 * The `aud` claim the SPA asks Auth0 for. It must equal `auth0_api_identifier`
 * in the API's tfvars, or API Gateway's JWT authorizer rejects the token. It
 * defaults to the API base URL because prod is configured that way, but dev
 * points at a different identifier, so it stays overridable.
 */
function getAudience() {
    return configValue('AUTH0_AUDIENCE') || getApiBaseUrl()
}

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

export function getAuth0Config() {
    return {
        domain: configValue('AUTH0_DOMAIN'),
        clientId: configValue('AUTH0_CLIENT_ID'),
        audience: getAudience(),
        redirectUri: configValue('AUTH0_REDIRECT_URI') || defaultRedirectUri(),
        logoutUri: configValue('AUTH0_LOGOUT_URI') || defaultLogoutUri()
    }
}

/**
 * The tenant may not exist yet. Rather than throwing at import time - which
 * would take down even the pages that need no authentication, and break the
 * unit suite - callers check this and degrade to a logged-out app.
 */
export function isAuth0Configured() {
    const { domain, clientId } = getAuth0Config()

    return Boolean(domain && clientId)
}

/** Thrown lazily, at the point login is actually attempted. */
export function assertAuth0Configured() {
    if (!isAuth0Configured()) {
        throw new Error(
            'Auth0 is not configured: set AUTH0_DOMAIN and AUTH0_CLIENT_ID in ' +
                'the deployed config.json, or VUE_APP_AUTH0_DOMAIN and ' +
                'VUE_APP_AUTH0_CLIENT_ID in .env.local for local development - ' +
                'see README > Configuration.'
        )
    }
}
