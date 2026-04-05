# SkyVoyage Source Code

This directory contains the complete source code for both frontend and backend applications.

## Backend Structure (Java)
```
src/main/java/com/skyvoyage/
├── SkyvoyageApplication.java     # Main application entry point
├── config/                      # Configuration classes
│   ├── MongoConfig.java          # MongoDB configuration
│   └── SecurityConfig.java       # Security configuration
├── controller/                  # REST API controllers
│   └── FlightController.java   # Flight management endpoints
├── model/                      # Data models
│   ├── Flight.java              # Flight entity
│   ├── Booking.java            # Booking entity
│   ├── Airport.java            # Airport entity
│   └── Amenity.java            # Amenity entity
├── repository/                  # Data access layer
│   ├── FlightRepository.java   # Flight data access
│   └── BookingRepository.java # Booking data access
├── service/                     # Business logic
│   ├── PricingEngine.java       # Dynamic pricing algorithms
│   └── SeatManager.java        # Seat management with locking
└── test/                        # Integration tests
    ├── FlightControllerTest.java # API endpoint tests
    └── FlightIntegrationTest.java # Full integration tests
```

## Frontend Structure (Vue.js)
```
src/
├── main.js                    # Application entry point
├── App.vue                    # Root component
├── router/
│   └── index.js              # Vue Router configuration
├── stores/
│   └── flights.js            # Pinia state management
├── components/
│   ├── FlightCard.vue        # Flight display component
│   ├── FlightSearch.vue      # Search and filter component
│   └── FlightsView.vue      # Flight results view
├── views/
│   └── FlightsView.vue      # Main flights view
├── assets/
│   └── main.css             # Application styles
└── index.html                    # HTML entry point
```

## Key Features Implemented

### Backend (Java/Spring Boot)
- ✈️ **Flight Management**: Complete CRUD operations
- 🔐 **Pricing Engine**: Dynamic pricing algorithms
- 🪑 **Seat Management**: Thread-safe seat locking
- 🔒 **Security**: JWT-based authentication
- 📊 **Database**: MongoDB integration
- 🧪 **Testing**: Comprehensive test suite

### Frontend (Vue.js/Vite)
- 🎨 **Modern UI**: Responsive design with animations
- 🔄 **State Management**: Pinia for global state
- 🛣 **Routing**: Vue Router for navigation
- 🎯 **Components**: Modular Vue components
- 📱 **Mobile Ready**: Responsive for all devices
- 🔗 **API Integration**: Axios for backend communication

## Development Guidelines

### Backend
- Follow Spring Boot conventions
- Use Lombok for boilerplate reduction
- Implement proper error handling
- Write comprehensive unit tests
- Use MongoDB repositories for data access

### Frontend
- Use Vue 3 Composition API
- Follow Vite build conventions
- Implement proper TypeScript types
- Use Pinia for state management
- Create reusable components
- Implement proper error boundaries

---

**Last Updated**: April 1, 2026  
**Status**: ✅ **COMPLETE SOURCE CODE STRUCTURE**
