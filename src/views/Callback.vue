<template>
    <v-container class="my-5 text-center" id="callback">
        <div v-if="error">
            <h1 class="text-h4 text-primary" id="callback-error-title">Could not sign you in</h1>
            <p class="text-body-1 my-4" id="callback-error-message">{{ error }}</p>
            <v-btn color="primary" id="callback-retry" @click="retry">Try again</v-btn>
        </div>
        <div v-else>
            <h1 class="text-h4 text-primary" id="callback-title">Signing you in</h1>
            <v-progress-circular
                class="my-6"
                color="primary"
                indeterminate
                size="48"/>
        </div>
    </v-container>
</template>

<script>
import { useUserStore } from '@/stores/useUserStore'

/**
 * Completes the Auth0 authorization-code exchange.
 *
 * Auth0 redirects here with `?code=` and `?state=`. The code is single-use, so
 * the exchange happens exactly once and the URL is then replaced - a reload of
 * this route with a spent code would otherwise fail.
 */
export default {
    name: 'AuthCallback',
    setup() {
        return { userStore: useUserStore() }
    },
    data() {
        return { error: '' }
    },
    async created() {
        try {
            const targetPath = await this.userStore.handleRedirectCallback()
            this.$router.replace(targetPath)
        } catch (err) {
            this.error = (err && err.message) || 'Unknown error'
        }
    },
    methods: {
        retry() {
            this.error = ''
            return this.userStore.loginWithRedirect('/')
        }
    }
}
</script>
