import { createRouter, createWebHistory } from 'vue-router'
import FlightsView from '../views/FlightsView.vue'
import FlightSearch from '../components/FlightSearch.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: FlightSearch
  },
  {
    path: '/flights',
    name: 'Flights',
    component: FlightsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
