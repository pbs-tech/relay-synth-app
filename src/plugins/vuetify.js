import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Colour names are carried over from the Vuetify 2 theme so that the existing
// `text-text` / `text-dark` / `bg-primary` utility classes keep resolving.
export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#5FB5BD',
                    secondary: '#4F95A2',
                    background: '#FAFAFA',
                    surface: '#FFFFFF',
                    text: '#247C84',
                    dark: '#0A191E'
                }
            }
        }
    }
})
