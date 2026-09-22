import { expect } from 'chai'
import {
    configValue,
    loadRuntimeConfig,
    resetRuntimeConfigForTests
} from '@/config/runtime'
import { getApiBaseUrl, getAuth0Config, isAuth0Configured } from '@/auth/config'

// The unit env sets no VUE_APP_* variables, so every build-time fallback here
// is empty and the values under test are the ones config.json supplies.

describe('runtime config', () => {
    let originalFetch
    let originalWarn
    let warnings
    let requests

    function respond({ status = 200, body = '{}' }) {
        global.fetch = (url, options) => {
            requests.push({ url, options })

            return Promise.resolve({
                ok: status >= 200 && status < 300,
                status,
                text: () => Promise.resolve(body)
            })
        }
    }

    beforeEach(() => {
        resetRuntimeConfigForTests()
        originalFetch = global.fetch
        originalWarn = console.warn
        warnings = []
        requests = []
        console.warn = (...args) => warnings.push(args.join(' '))
    })

    afterEach(() => {
        global.fetch = originalFetch
        console.warn = originalWarn
        resetRuntimeConfigForTests()
    })

    it('uses values from config.json', async () => {
        respond({
            body: JSON.stringify({
                AUTH0_DOMAIN: 'tenant.eu.auth0.com',
                AUTH0_CLIENT_ID: 'abc123',
                API_BASE_URL: 'https://api.example.test'
            })
        })

        await loadRuntimeConfig()

        expect(getApiBaseUrl()).to.equal('https://api.example.test')
        expect(isAuth0Configured()).to.be.true
        expect(getAuth0Config().domain).to.equal('tenant.eu.auth0.com')
    })

    it('defaults the audience to the API base URL, and lets it be overridden', async () => {
        respond({ body: JSON.stringify({ API_BASE_URL: 'https://api.example.test' }) })
        await loadRuntimeConfig()
        expect(getAuth0Config().audience).to.equal('https://api.example.test')

        resetRuntimeConfigForTests()
        respond({
            body: JSON.stringify({
                API_BASE_URL: 'https://api.example.test',
                AUTH0_AUDIENCE: 'https://dev-identifier'
            })
        })
        await loadRuntimeConfig()
        expect(getAuth0Config().audience).to.equal('https://dev-identifier')
    })

    // A deploy script that writes an unset variable produces a blank string,
    // which must not blank out a value the bundle already has.
    it('treats an empty value as absent', async () => {
        respond({ body: JSON.stringify({ API_BASE_URL: '' }) })

        await loadRuntimeConfig()

        expect(getApiBaseUrl()).to.equal('https://api.relay-synth.peebles.lol')
    })

    it('falls back quietly when there is no config.json', async () => {
        respond({ status: 404, body: 'Not Found' })

        await loadRuntimeConfig()

        expect(getApiBaseUrl()).to.equal('https://api.relay-synth.peebles.lol')
        expect(isAuth0Configured()).to.be.false
        expect(warnings).to.eql([])
    })

    // A SPA rewrite serves index.html for paths that do not exist, so an
    // absent file arrives as HTML with a 200 rather than as a 404. Same
    // situation as the 404 above, and just as unworthy of a warning.
    it('falls back quietly when the SPA rewrite returns index.html', async () => {
        respond({ body: '<!DOCTYPE html>\n<html><body></body></html>' })

        await loadRuntimeConfig()

        expect(getApiBaseUrl()).to.equal('https://api.relay-synth.peebles.lol')
        expect(warnings).to.eql([])
    })

    it('warns and falls back on a malformed config.json', async () => {
        respond({ body: '{"API_BASE_URL": ' })

        await loadRuntimeConfig()

        expect(getApiBaseUrl()).to.equal('https://api.relay-synth.peebles.lol')
        expect(warnings).to.have.lengthOf(1)
        expect(warnings[0]).to.contain('not valid JSON')
    })

    it('warns and falls back when config.json is not an object', async () => {
        respond({ body: '["nope"]' })

        await loadRuntimeConfig()

        expect(configValue('API_BASE_URL')).to.equal('')
        expect(warnings).to.have.lengthOf(1)
        expect(warnings[0]).to.contain('not a JSON object')
    })

    it('survives fetch rejecting outright', async () => {
        global.fetch = () => Promise.reject(new Error('offline'))

        await loadRuntimeConfig()

        expect(getApiBaseUrl()).to.equal('https://api.relay-synth.peebles.lol')
        expect(warnings).to.have.lengthOf(1)
    })

    // Bootstrap awaits this once, but the export is importable from anywhere;
    // a second caller must not cost a second request.
    it('fetches at most once', async () => {
        respond({ body: JSON.stringify({ API_BASE_URL: 'https://api.example.test' }) })

        await loadRuntimeConfig()
        await loadRuntimeConfig()

        expect(requests).to.have.lengthOf(1)
    })

    it('asks for the file uncached', async () => {
        respond({ body: '{}' })

        await loadRuntimeConfig()

        expect(requests[0].url).to.contain('config.json')
        expect(requests[0].options.cache).to.equal('no-store')
    })
})
