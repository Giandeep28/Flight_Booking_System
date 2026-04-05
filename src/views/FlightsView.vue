<template>
  <div class="flights-container">
    <h1>Flight Results</h1>
    <div class="flights-grid">
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
  name: 'FlightsView',
  props: {
    flights: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleBooking(flight) {
      this.$emit('book-flight', flight)
    }
  }
}
</script>

<style scoped>
.flights-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.flights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>
