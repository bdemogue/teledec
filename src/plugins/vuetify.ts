/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles'

// Composables

import { createVuetify, ThemeDefinition } from 'vuetify';

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#0E131B',
    surface: '#1B2636',
    primary: '#4755DA',
    'primary-darken-1': '#0E131B',
    secondary: '#A8A8A8',
    'secondary-darken-1': '#1B2636',
    tertiary: '#8186BD',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}


export default createVuetify({
  theme: {
    defaultTheme: 'myCustomDarkTheme',
    themes: {
      myCustomDarkTheme,
    }
  }
})
