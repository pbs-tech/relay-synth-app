import axios from 'axios'
import { getApiBaseUrl } from '@/auth/config'
import { getAccessToken } from '@/auth/auth0'

/**
 * The single axios instance every store talks to.
 *
 * Replaces two things at once: the `https://api.relay-synth.tech` string that
 * was repeated in each store module, and the global `auth-token` default header
 * that main.js used to set from `localStorage`. The token is now fetched per
 * request from the Auth0 client, so it is always the current one and a rotated
 * refresh token takes effect without a reload.
 */
const http = axios.create()

http.interceptors.request.use(async (config) => {
    // Resolved per request rather than at create() time: the runtime config is
    // fetched during bootstrap, which lands after this module is imported, so
    // a baseURL captured here would always be the build-time one.
    config.baseURL = getApiBaseUrl()

    const token = await getAccessToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default http
