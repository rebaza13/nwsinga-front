import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Create Pinia instance
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)

// Simple v-intersect directive for IntersectionObserver
app.directive('intersect', {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      binding.value(entries)
    })
    observer.observe(el)
  }
})

// Use plugins
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')

