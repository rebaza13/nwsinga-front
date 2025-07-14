import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import i18n from './i18n'

// Create Pinia instance
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)

// Use Pinia
app.use(pinia)
app.use(i18n)

app.mount('#app')
