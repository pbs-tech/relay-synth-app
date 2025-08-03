import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
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

if(window.Cypress) {
    window.app = app
}