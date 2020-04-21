import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#5FB5BD',
                background: '#FAFAFA',
                secondary: '#4F95A2',
                text: '#247C84',
                dark: '#0A191E'                
            }
        }
    }
});
