# SkyVoyage Backend

## Overview
SkyVoyage backend provides RESTful APIs for flight search, booking, and user management.

## Architecture
- **Framework**: Spring Boot 3.1.5
- **Database**: MongoDB with Spring Data
- **Security**: Spring Security with JWT
- **Testing**: JUnit 5 with integration tests

## Features

### Flight Management
- Flight search with advanced filtering
- Dynamic pricing engine
- Seat management with locking
- Competitive pricing algorithms

### Booking System
- PNR generation
- Seat locking mechanism
- Booking confirmation
- Booking history

### User Management
- JWT-based authentication
- Session management
- Profile management

## API Endpoints

### Flight Operations
- `GET /api/flights` - Search flights
- `POST /api/flights/search` - Advanced search
- `GET /api/airports` - Get airport information
- `GET /api/airlines` - Get airline details

### Booking Operations
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{pnr}` - Get booking details
- `PUT /api/bookings/{pnr}` - Update booking
- `DELETE /api/bookings/{pnr}` - Cancel booking

## Database Schema

### Collections
- `flights` - Flight information
- `bookings` - Booking records
- `users` - User profiles
- `airports` - Airport data
- `airlines` - Airline information

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- MongoDB 4.4+

### Running the Application
```bash
cd backend
./mvnw spring-boot:run
```

### Configuration
Configuration is managed through `application.properties`:

```properties
server.port=8080
spring.data.mongodb.database=skyvoyage
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
```

### Testing
Run integration tests:
```bash
./mvnw test
```

---

**Version**: 1.0.0  
**Last Updated**: April 1, 2026
