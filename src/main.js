import Vue from 'vue'
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';
import Axios from 'axios';


Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
const token = localStorage.getItem('token');
if (token) {
    Vue.prototype.$http.defaults.headers.common['auth-token'] = token;
}

const app = new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')

if(window.Cypress) {
    window.app = app;
}