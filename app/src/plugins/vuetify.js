import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css';
//background-color: #fbfbff;
export default createVuetify({
    theme: {
        themes: {
            light: {
              dark: false,
              colors: {
                primary: '#f0518a',
                secondary: '#ff8ca9',
                background: '#FCF9F7'
                //background: '#f0f6fc'
              }
            },
          },
    },
    components,
    directives,
})