import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import Axios from 'axios'
import * as Tone from 'tone'
import Nexus from 'nexusui'

const token = localStorage.getItem('token')
if (token) {
    Axios.defaults.headers.common['auth-token'] = token
}

// Nexus runs its clock off a native AudioContext because it needs
// createScriptProcessor, which Tone v14's Context deliberately does not expose.
// Point Tone at Nexus's context so both libraries share one audio graph.
Tone.setContext(new Tone.Context(Nexus.context))

// Tone v14 requires the AudioContext to be resumed from a user gesture before
// any sound can be produced. Unlock it on the first interaction anywhere.
const unlockAudio = () => { Tone.start() }
window.addEventListener('pointerdown', unlockAudio, { once: true })
window.addEventListener('keydown', unlockAudio, { once: true })

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