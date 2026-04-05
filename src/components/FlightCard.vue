<template>
  <div class="flight-card">
    <div class="flight-header">
      <div class="airline-info">
        <img :src="flight.airline_logo" :alt="flight.airline_name" class="airline-logo">
        <div>
          <div class="airline-name">{{ flight.airline_name }}</div>
          <div class="flight-route">{{ flight.flight_number }}</div>
        </div>
      </div>
      <div class="flight-details">
        <div class="flight-times">
          <div class="time">{{ flight.departure_time }}</div>
          <div class="duration">{{ flight.duration }}</div>
          <div class="time">{{ flight.arrival_time }}</div>
        </div>
        <div class="flight-price">
          {{ flight.currency }} {{ flight.price }}
        </div>
      </div>
    </div>
    <div class="flight-amenities">
      <div v-for="amenity in flight.amenities" :key="amenity.name" class="amenity">
        <i :class="amenity.icon"></i>
        <span>{{ amenity.name }}</span>
      </div>
    </div>
    <button class="book-btn" @click="bookFlight">
      Book Now
    </button>
  </div>
</template>

<script>
export default {
  name: 'FlightCard',
  props: {
    flight: {
      type: Object,
      required: true
    }
  },
  methods: {
    bookFlight() {
      this.$emit('book-flight', this.flight)
    }
  }
}
</script>

<style scoped>
.flight-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e5e7eb;
}

.flight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.15);
}

.airline-info {
  display:.js;
  align-items: center;
  gap: 1rem;
}

.airline-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: contain;
}

.flight-details {
  flex: 1;
}

.flight-route {
  font-weight: 600;
  color: #333;
}

.flight-times {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.time {
  font-size: 1.25rem;
  font-weight: 500;
}

.duration {
  color: #666;
}

.flight-price {
  text-align: right;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.book-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.book-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.amenity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>
