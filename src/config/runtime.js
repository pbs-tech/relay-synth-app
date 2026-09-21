/**
 * Runtime configuration.
 *
 * vue-cli inlines `VUE_APP_*` into the bundle at build time. Two things follow
 * from that, and both are what this module exists to undo: changing a value
 * means rebuilding, and dev and prod can never share a build artifact - the
 * bundle you tested is by construction not the bundle you ship.
 *
 * So the same values are read from `/config.json`, fetched once before the app
 * mounts. One bundle then serves any environment, and the file can be replaced
 * on its own wherever the host allows it.
 *
 * Build-time variables still work and are the fallback: a key that is missing
 * or empty in `config.json` falls through to its `VUE_APP_*` value, and no
 * `config.json` at all leaves behaviour exactly as it was. That is what keeps
 * `.env.local` working under `npm run serve`, which generates no file.
 */

/**
 * The build-time fallbacks, and the list of keys this app understands.
 *
 * Spelled out one property at a time on purpose: webpack's DefinePlugin
 * substitutes the literal text `process.env.VUE_APP_X`, so a computed lookup
 * like `process.env['VUE_APP_' + key]` is not substituted at all and reads an
 * object that does not exist in the browser.
 */
const buildTimeConfig = {
    AUTH0_DOMAIN: process.env.VUE_APP_AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.VUE_APP_AUTH0_CLIENT_ID,
    AUTH0_AUDIENCE: process.env.VUE_APP_AUTH0_AUDIENCE,
    AUTH0_REDIRECT_URI: process.env.VUE_APP_AUTH0_REDIRECT_URI,
    AUTH0_LOGOUT_URI: process.env.VUE_APP_AUTH0_LOGOUT_URI,
    API_BASE_URL: process.env.VUE_APP_API_BASE_URL
}

let runtimeConfig = {}
let loadAttempted = false

/** Honours `publicPath`, so a deploy under a sub-path still finds its file. */
function defaultUrl() {
    return `${process.env.BASE_URL || '/'}config.json`
}

/**
 * Fetches `/config.json`. Resolves either way: a site that cannot read its
 * runtime config still has the build-time values, and refusing to boot over a
 * missing optional file would be worse than the thing it guards against.
 */
export async function loadRuntimeConfig(url = defaultUrl()) {
    if (loadAttempted) {
        return runtimeConfig
    }
    loadAttempted = true

    let response

    try {
        // The point of the file is that it changes without the bundle
        // changing, so a cached copy defeats it.
        response = await fetch(url, {
            cache: 'no-store',
            headers: { Accept: 'application/json' }
        })
    } catch (err) {
        console.warn(`Could not fetch ${url}; using build-time config.`, err)
        return runtimeConfig
    }

    if (!response.ok) {
        // Absent is a supported state - see the module comment. Stay quiet.
        return runtimeConfig
    }

    const body = await response.text()
    let parsed

    try {
        parsed = JSON.parse(body)
    } catch (err) {
        // A SPA rewrite serves index.html for paths that do not exist, so an
        // absent config.json arrives as HTML with a 200 rather than as a 404.
        // That is the quiet case above wearing a disguise; anything else that
        // fails to parse is a real malformed file and worth saying so.
        if (!body.trimStart().startsWith('<')) {
            console.warn(`${url} is not valid JSON; using build-time config.`, err)
        }
        return runtimeConfig
    }

    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn(`${url} is not a JSON object; using build-time config.`)
        return runtimeConfig
    }

    runtimeConfig = parsed
    return runtimeConfig
}

/**
 * One configuration value: runtime first, build-time second, empty string last.
 *
 * Empty is treated as absent so that a key left blank in `config.json` - which
 * is what a deploy script writing an unset variable produces - falls through
 * rather than blanking a value that was set at build time.
 */
export function configValue(key) {
    const runtime = runtimeConfig[key]

    if (typeof runtime === 'string' && runtime !== '') {
        return runtime
    }

    return buildTimeConfig[key] || ''
}

/** Lets the unit suite exercise loading more than once per process. */
export function resetRuntimeConfigForTests() {
    runtimeConfig = {}
    loadAttempted = false
}
