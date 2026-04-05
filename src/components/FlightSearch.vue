<template>
  <div class="search-container">
    <div class="search-form">
      <div class="form-group">
        <label>From:</label>
        <input v-model="searchForm.from" type="text" placeholder="Enter city or airport">
      </div>
      <div class="form-group">
        <label>To:</label>
        <input v-model="searchForm.to" type="text" placeholder="Enter city or airport">
      </div>
      <div class="form-group">
        <label>Date:</label>
        <input v-model="searchForm.date" type="date">
      </div>
      <div class="form-group">
        <label>Passengers:</label>
        <input v-model="searchForm.passengers" type="number" min="1" value="1">
      </div>
      <button @click="searchFlights" class="search-btn">Search Flights</button>
    </div>
    
    <div class="filters">
      <div class="filter-group">
        <label>Price Range:</label>
        <input v-model="filters.priceRange" type="range" min="0" max="10000" step="100">
        <span>{{ filters.priceRange }}</span>
      </div>
      
      <div class="filter-group">
        <label>Stops:</label>
        <select v-model="filters.stops">
          <option value="">All</option>
          <option value="nonstop">Non-stop</option>
          <option value="onestop">1 Stop</option>
          <option value="twostops">2+ Stops</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Airlines:</label>
        <div v-for="airline in airlines" :key="airline.code" class="airline-checkbox">
          <input v-model="filters.airlines" :value="airline.code" type="checkbox" :id="airline.code">
          <label :for="airline.code">{{ airline.name }}</label>
        </div>
      </div>
    </div>
    
    <div class="results">
      <FlightCard 
        v-for="flight in flights" 
        :key="flight.id" 
        :flight="flight"
        @book-flight="handleBooking"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightSearch',
  data() {
    return {
      searchForm: {
        from: '',
        to: '',
        date: '',
        passengers: 1
      },
      filters: {
        priceRange: 5000,
        stops: '',
        airlines: []
      },
      flights: [],
      airlines: []
    }
  },
  methods: {
    searchFlights() {
      // Emit search event to parent
      this.$emit('search-flights', this.searchForm)
    },
    handleBooking(flight) {
      // Emit booking event to parent
      this.$emit('book-flight', flight)
    }
  }
}
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.filter-group {
  margin-bottom: 1rem;
}

.airline-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>
