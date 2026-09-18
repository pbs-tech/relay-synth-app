import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/useUserStore'
import vuetify from './plugins/vuetify'
import Axios from 'axios'

const token = localStorage.getItem('token')
if (token) {
    Axios.defaults.headers.common['auth-token'] = token
}

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$http = Axios
app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')

if (window.Cypress) {
    window.app = app
    window.pinia = pinia
    // Expose the user store so e2e specs can drive auth state directly rather
    // than reaching into Pinia internals (pinia._s) or the removed Vuex $store.
    window.userStore = useUserStore(pinia)
}