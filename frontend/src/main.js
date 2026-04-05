import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import axios from 'axios'

// Import styles
import './assets/main.css'

const app = createApp({
  router: createRouter(),
  pinia: createPinia(),
  history: createWebHistory()
})

app.use(router)
app.use(pinia)
app.mount('#app')

// Global axios configuration
axios.defaults.baseURL = 'http://localhost:8000/api'
