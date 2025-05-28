import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { initializeData } from './utils/initData'

// Initialize sample data
initializeData()

// Create the app instance
const app = createApp(App)

// Create and use Pinia
const pinia = createPinia()
app.use(pinia)

// Use router
app.use(router)

// Mount the app
app.mount('#app')
