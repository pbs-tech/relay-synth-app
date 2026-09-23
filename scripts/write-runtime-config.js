/**
 * Writes the runtime `config.json` that the bundle fetches at boot.
 *
 * Run after `vue-cli-service build`, so the file lands in `dist/` rather than
 * in `public/`, where it would be picked up by `npm run serve` and quietly
 * shadow a developer's `.env.local`.
 *
 * Values are read from `VUE_APP_<KEY>` or from a bare `<KEY>`. The deploy
 * workflow passes the unprefixed names from the GitHub repository variables;
 * the prefixed ones are what a local `.env.local` build carries.
 *
 * Keys absent from the environment are left out of the file rather than
 * written empty, so the bundle's own fallbacks still apply to them.
 */

const fs = require('fs')
const path = require('path')

// Must stay in step with `buildTimeConfig` in src/config/runtime.js.
const KEYS = [
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_AUDIENCE',
    'AUTH0_REDIRECT_URI',
    'AUTH0_LOGOUT_URI',
    'API_BASE_URL'
]

const target = process.argv[2] || path.join('dist', 'config.json')
const config = {}

for (const key of KEYS) {
    const value = process.env[`VUE_APP_${key}`] || process.env[key]

    if (value) {
        config[key] = value
    }
}

fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, `${JSON.stringify(config, null, 4)}\n`)

const written = Object.keys(config)
console.log(
    written.length
        ? `Wrote ${target} with ${written.join(', ')}`
        : `Wrote ${target} with no values - the bundle's defaults apply`
)
