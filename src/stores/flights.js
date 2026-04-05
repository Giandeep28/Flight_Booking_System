import { defineStore } from 'pinia'

export const useFlightsStore = defineStore('flights', {
  state: () => ({
    flights: [],
    filters: {
      priceRange: [0, 10000],
      stops: '',
      airlines: []
    },
    searchForm: {
      from: '',
      to: '',
      date: '',
      passengers: 1
    }
  }),
  
  actions: {
    setFlights(flights) {
      this.flights = flights
    },
    
    updateFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    
    updateSearchForm(form) {
      this.searchForm = { ...this.searchForm, ...form }
    },
    
    addFlight(flight) {
      this.flights.push(flight)
    }
  }
})
