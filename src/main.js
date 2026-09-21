import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/useUserStore'
import vuetify from './plugins/vuetify'
import http from './api/http'
import { injectAccessToken } from './auth/auth0'
import { installAudioUnlock, installNativeAudioContext } from './util/audioContext'
import { loadRuntimeConfig } from './config/runtime'

// Must run before any Tone node is created (see the module for why). Stays at
// module scope rather than inside bootstrap() so it still runs before the
// first import of a component that pulls Tone in.
installNativeAudioContext()

async function bootstrap() {
    // Before the app is assembled, not merely before it is mounted: installing
    // the router resolves the current location straight away, and that first
    // navigation's guard consults the Auth0 config. Awaiting this any later
    // means the guard reads the build-time values and the runtime file only
    // takes effect on the second navigation - which is to say, never on the
    // one that matters.
    //
    // loadRuntimeConfig never rejects: a site that cannot read the file falls
    // back to its build-time values, which is a working app rather than a
    // blank page.
    await loadRuntimeConfig()

    const app = createApp(App)
    const pinia = createPinia()

    // Was a bare axios instance with an `auth-token` header read from
    // localStorage. Components that use `this.$http` now get the configured
    // client, which carries the API base URL and attaches a bearer token per
    // request.
    app.config.globalProperties.$http = http
    app.use(pinia)
    app.use(router)
    app.use(vuetify)

    if (window.Cypress) {
        // Expose the user store so e2e specs can drive auth state directly
        // rather than reaching into Pinia internals (pinia._s) or the removed
        // Vuex $store.
        window.userStore = useUserStore(pinia)

        // Universal Login cannot be driven from Cypress, and the SDK's
        // in-memory token cache cannot be seeded from outside. Specs fetch a
        // token from Auth0 themselves and leave it here in the spec's
        // onBeforeLoad hook, which runs before this file does. It has to be
        // applied before mount, because that is what starts session
        // restoration. Guarded by window.Cypress, so this is unreachable in a
        // real browser.
        window.injectAccessToken = injectAccessToken

        if (window.__injectedAccessToken) {
            injectAccessToken(window.__injectedAccessToken)
        }
    }

    app.mount('#app')

    // Resume the Web Audio context on the first user gesture (see the module
    // for why Tone 14 needs this).
    installAudioUnlock()

    if (window.Cypress) {
        window.app = app
        window.pinia = pinia
    }
}

bootstrap()
