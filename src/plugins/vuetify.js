import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    theme: {
        themes: {
            light: {
                colors: {
                    primary: '#5FB5BD',
                    background: '#FAFAFA',
                    secondary: '#4F95A2',
                    surface: '#247C84',
                    'on-surface': '#0A191E'
                }
            }
        }
    }
})
