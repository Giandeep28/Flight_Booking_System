# SkyVoyage Test Suite

## Overview
Comprehensive test suite for the SkyVoyage flight booking system.

## Test Categories

### Unit Tests
- **Model Tests**: Test all data models
- **Service Tests**: Test business logic
- **Repository Tests**: Test data access
- **Controller Tests**: Test API endpoints

### Integration Tests
- **API Integration**: Full end-to-end testing
- **Database Tests**: Test database connectivity
- **Performance Tests**: Load and stress testing

## Running Tests

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Test Coverage

### Backend
- **Target**: 90% code coverage
- **Focus**: Critical business logic and API endpoints

### Frontend
- **Target**: 85% code coverage
- **Focus**: User interface and component interactions

## Test Data

### Mock Data
- **Flights**: 20+ realistic flight options
- **Airports**: 50+ airports worldwide
- **Airlines**: 10+ major airlines
- **Users**: Sample user profiles

### Test Scenarios

### Flight Search
- Valid search parameters
- Invalid search parameters
- Empty results handling
- Performance testing

### Booking System
- Seat availability checking
- Concurrent booking handling
- PNR generation uniqueness
- Payment processing

### User Management
- Authentication flows
- Profile management
- Session handling
- Permission checks

## Continuous Integration

### CI/CD Pipeline
- Automated testing on every commit
- Integration test execution
- Performance benchmarking
- Security vulnerability scanning

---

**Version**: 1.0.0  
**Last Updated**: April 1, 2026
