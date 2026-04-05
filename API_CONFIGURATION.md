# SkyVoyage API Configuration

## Backend Integration Setup

This document outlines the API configuration for integrating SkyVoyage with external backend services.

## API Endpoints

### Flight Data
```
GET /api/flights
- Fetches flight data based on search criteria
- Returns enhanced flight objects with full details
- Supports filtering by price, stops, airlines, departure time
- Includes real-time pricing and availability

POST /api/flights/search
- Advanced flight search with specific parameters
- Supports complex routing and multi-city searches
- Returns sorted and filtered results

GET /api/airlines
- Returns airline information with logos and details
- Caches frequently accessed airline data

POST /api/bookings
- Creates new booking records
- Validates passenger information
- Generates PNR and confirmation details

GET /api/bookings/{pnr}
- Retrieves booking details by PNR
- Returns complete booking information
- Supports booking modifications and cancellations
```

### Data Schema

#### Flight Object
```json
{
  "id": "FL1234",
  "airline_name": "Indigo",
  "airline_code": "6E",
  "airline_logo": "https://logo.clearbit.com/indigo.com",
  "flight_number": "6E-203",
  "departure_airport": "DEL",
  "arrival_airport": "BOM",
  "departure_time": "2024-04-01T10:00:00Z",
  "arrival_time": "2024-04-01T12:30:00Z",
  "duration": "2h 30m",
  "stops": 0,
  "layovers": [],
  "price": 5000,
  "currency": "INR",
  "cabin_class": "Economy",
  "baggage_info": "20kg",
  "amenities": ["WiFi", "Meal", "USB Charging"],
  "status": "scheduled",
  "aircraft": "Boeing 737"
}
```

#### Booking Object
```json
{
  "pnr": "ABC123",
  "flight_id": "FL1234",
  "passenger_name": "John Doe",
  "passenger_email": "john@example.com",
  "passenger_phone": "+1234567890",
  "booking_date": "2024-04-01T08:00:00Z",
  "status": "confirmed",
  "seat_number": "12A",
  "total_amount": 5000
}
```

## Integration Notes

### Authentication
- JWT-based authentication system
- User registration and login endpoints
- Session management with secure tokens
- Role-based access control

### Database Integration
- MongoDB collections: flights, bookings, users, airlines
- Indexed for optimal query performance
- Real-time synchronization with backend systems

### External APIs
- AviationStack integration for real flight data
- Payment gateway integration for bookings
- Email service for booking confirmations
- SMS service for booking notifications

---

**Configuration Version**: 1.0  
**Last Updated**: April 1, 2026
