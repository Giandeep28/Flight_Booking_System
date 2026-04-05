# SkyVoyage Frontend

## Overview
Modern Vue.js 3 frontend for the SkyVoyage flight booking system.

## Architecture
- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite 5
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Styling**: Modern CSS with responsive design

## Features

### Flight Search
- Advanced search form with validation
- Real-time filtering and sorting
- Interactive flight cards
- Mobile-responsive design

### Booking System
- Seat selection interface
- Booking confirmation flow
- Booking history management
- PNR tracking

### User Interface
- Modern, clean design
- Smooth animations and transitions
- Toast notifications
- Loading states
- Error handling

## Components

### Core Components
- `FlightCard` - Individual flight information display
- `FlightSearch` - Search form and filters
- `FlightsView` - Flight results grid
- `BookingForm` - Booking confirmation form
- `UserProfile` - User profile management

## Getting Started

### Prerequisites
- Node.js 16+
- npm 8+
- Vue.js 3+

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Configuration
Configuration is managed through environment variables and `.env` files.

## API Integration

The frontend is configured to communicate with the SkyVoyage backend API:

```javascript
// axios configuration
axios.defaults.baseURL = 'http://localhost:8000/api'
```

---

**Version**: 1.0.0  
**Last Updated**: April 1, 2026
