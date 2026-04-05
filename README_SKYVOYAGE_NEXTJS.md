# SkyVoyage Next.js - Enterprise Flight Booking Platform

A modern, high-performance flight booking system built with Next.js 14, featuring a microservices architecture with live data integration and AI-powered assistance.

## 🚀 Architecture Overview

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Context API
- **UI Components**: Modular, reusable components
- **Performance**: Debouncing, lazy loading, dynamic imports

### Backend Services
- **API Gateway**: Node.js/Express (Port 3001)
  - Authentication & Authorization
  - Request routing & rate limiting
  - JWT token management
  
- **Flight Data API**: Python/FastAPI (Port 8000)
  - Live flight data integration (Amadeus/Kiwi)
  - NLP-powered chatbot
  - Real-time search & filtering
  
- **Booking Engine**: Java/Spring Boot (Port 8080)
  - Multithreaded seat locking
  - Concurrent booking processing
  - PDF e-ticket generation
  - MongoDB persistence

## 🛠️ Tech Stack

### Frontend Dependencies
```json
{
  "next": "14.2.5",
  "react": "^18.3.1",
  "tailwindcss": "^3.3.5",
  "lucide-react": "^0.263.1",
  "axios": "^1.6.0",
  "react-hook-form": "^7.47.0",
  "framer-motion": "^10.16.4",
  "react-hot-toast": "^2.4.1"
}
```

### Backend Dependencies
- **Node.js**: Express, JWT, bcrypt, MongoDB, Redis
- **Python**: FastAPI, Pydantic, asyncio, aiohttp
- **Java**: Spring Boot, MongoDB, iTextPDF, JUnit

## 📁 Project Structure

```
skyvoyage-nextjs/
├── app/
│   ├── layout.js              # Root layout with AuthContext
│   ├── page.js               # Home page with Hero carousel
│   ├── results/page.js        # Flight results with filtering
│   ├── booking/page.js        # Multi-step booking process
│   └── dashboard/page.js     # User dashboard
├── components/
│   ├── Header.js             # Navigation with MegaMenu
│   ├── AirportAutocomplete.js # Debounced airport search
│   └── SeatMap.js           # Interactive seat selection
├── lib/
│   └── api.js              # Centralized API client
├── context/
│   └── AuthContext.js       # Global authentication state
├── tests/
│   └── booking.spec.js      # Playwright E2E tests
└── app/globals.css          # Custom styling with design tokens

skyvoyage-gateway/           # Node.js API Gateway
├── server.js                # Main server with auth & routing
└── package.json

backend/
├── app_enhanced.py          # Enhanced FastAPI with live data
└── requirements.txt

java-booking-engine/         # Java multithreaded booking engine
├── src/main/java/com/skyvoyage/booking/
│   ├── BookingEngineApplication.java
│   └── service/ConcurrentSeatLockService.java
└── pom.xml
```

## 🎨 Design System

### Color Palette
- **Primary**: #C5A059 (Gold)
- **Primary Dark**: #A48446
- **Dark**: #000814
- **Text**: #F8FAFC
- **Text Muted**: #94A3B8

### Key Features
- Glassmorphism effects
- Premium gold/dark theme
- Responsive design
- Smooth animations
- Interactive components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Java 17+
- MongoDB 6.0+
- Redis (optional, for caching)

### Installation

1. **Frontend Setup**
```bash
cd skyvoyage-nextjs
npm install
npm run dev
# Visit http://localhost:3000
```

2. **API Gateway Setup**
```bash
cd skyvoyage-gateway
npm install
npm run dev
# Runs on http://localhost:3001
```

3. **Backend API Setup**
```bash
cd backend
pip install -r requirements.txt
python app_enhanced.py
# Runs on http://localhost:8000
```

4. **Java Booking Engine Setup**
```bash
cd java-booking-engine
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001
```

**API Gateway (.env)**
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key
FLIGHT_SERVICE_URL=http://localhost:8000
JAVA_BOOKING_URL=http://localhost:8080
```

**Backend (.env)**
```env
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-secret
KIWI_API_KEY=your-kiwi-api-key
MONGODB_URL=mongodb://localhost:27017/skyvoyage
```

## 🧪 Testing

### Frontend Tests
```bash
cd skyvoyage-nextjs
npm test
# Runs Playwright E2E tests
```

### Backend Tests
```bash
cd backend
python -m pytest
```

### Java Tests
```bash
cd java-booking-engine
mvn test
```

## 📊 Key Features

### ✅ Completed Features
- [x] Next.js 14 with App Router
- [x] Tailwind CSS with custom design tokens
- [x] Responsive Header with MegaMenu
- [x] Hero carousel with auto-rotation
- [x] Debounced airport autocomplete
- [x] Flight search with live data
- [x] Advanced filtering & sorting
- [x] Authentication system
- [x] NLP-powered chatbot
- [x] Multithreaded seat locking
- [x] PDF e-ticket generation
- [x] Comprehensive E2E tests

### 🚧 In Progress
- [ ] Multi-step booking flow
- [ ] Interactive seat map
- [ ] User dashboard
- [ ] Payment integration

## 🔒 Security Features

- JWT-based authentication
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection

## 🚀 Performance Optimizations

### Frontend
- Code splitting with dynamic imports
- Image optimization
- Debounced search inputs
- Lazy loading for heavy components
- Memoization for expensive operations
- Service Worker for caching

### Backend
- Connection pooling
- Redis caching
- Database indexing
- Async operations
- Request batching

## 📈 Monitoring & Analytics

- Health check endpoints
- Performance metrics
- Error tracking
- API usage statistics
- Booking analytics

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: SkyVoyage CI/CD
on: [push, pull_request]
jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
  
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - run: pip install -r requirements.txt
      - run: python -m pytest
```

## 🌐 Deployment

### Development
- All services run locally on different ports
- Hot reload enabled
- Debug mode active

### Production
- Docker containers (optional)
- Load balancer configuration
- SSL/TLS termination
- Database clustering
- Redis cluster for caching

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # User profile
PUT  /api/auth/profile     # Update profile
```

### Flight Endpoints
```
GET  /api/flights          # Search flights
GET  /api/flights/{id}     # Flight details
GET  /api/airports         # Airport list
GET  /api/airlines         # Airline list
```

### Booking Endpoints
```
POST /api/bookings          # Create booking
GET  /api/bookings/{pnr}    # Get booking by PNR
GET  /api/bookings/user     # User bookings
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- **Frontend Lead**: React/Next.js Specialist
- **Backend Lead**: Python/FastAPI Developer
- **DevOps Lead**: Infrastructure & Deployment
- **QA Lead**: Testing & Quality Assurance

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@skyvoyage.com
- Documentation: [Wiki](https://github.com/skyvoyage/docs)

---

**SkyVoyage** - Redefining the art of air travel with technology and elegance. ✈️
