# SkyVoyage Flight Booking System - Complete Setup Guide

## 🚀 Overview

SkyVoyage is a production-ready, enterprise-grade flight booking platform built with modern microservices architecture. This guide will help you set up the complete system from scratch.

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0+ 
- **Python**: 3.9+
- **Java**: 17+
- **MongoDB**: 6.0+
- **Git**: Latest version

### Development Tools
- **IDE**: VS Code, IntelliJ IDEA, or similar
- **API Client**: Postman or Insomnia
- **Database Tool**: MongoDB Compass
- **Browser**: Chrome/Firefox with DevTools

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Node.js       │    │   FastAPI       │
│   Frontend       │◄──►│   API Gateway   │◄──►│   Python        │
│   (Port 3000)    │    │   (Port 3001)   │    │   (Port 8000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   Java          │
                                              │   Booking       │
                                              │   Engine        │
                                              │   (Port 8080)   │
                                              └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   MongoDB       │
                                              │   Database      │
                                              │   (Port 27017)   │
                                              └─────────────────┘
```

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/skyvoyage-flight-booking.git
cd skyvoyage-flight-booking
```

### 2. Set Up Environment Variables

Create environment files for each service:

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001
```

#### API Gateway (.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-2024
FLIGHT_SERVICE_URL=http://localhost:8000
JAVA_BOOKING_URL=http://localhost:8080
NODE_ENV=development
```

#### Backend (.env)
```env
# Flight APIs (Get your own keys from respective providers)
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-secret
KIWI_API_KEY=your-kiwi-api-key

# Database
MONGODB_URL=mongodb://localhost:27017/skyvoyage
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-super-secret-key-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Java (application.properties)
```properties
server.port=8080
spring.application.name=skyvoyage-booking-engine

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/skyvoyage
spring.data.mongodb.database=skyvoyage

# Logging
logging.level.com.skyvoyage=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

### 3. Install Dependencies

#### Frontend (Next.js)
```bash
cd skyvoyage-nextjs
npm install
```

#### API Gateway (Node.js)
```bash
cd skyvoyage-gateway
npm install
```

#### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
```

#### Java Booking Engine
```bash
cd java-booking-engine
mvn clean install
```

### 4. Database Setup

#### Install MongoDB
**Windows:**
```bash
# Download and install MongoDB Community Server
# Or use chocolatey: choco install mongodb
```

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### Create Database and Collections
```bash
# Connect to MongoDB
mongosh

# Create database
use skyvoyage

# Create collections (will be created automatically)
db.createCollection("users")
db.createCollection("bookings")
db.createCollection("flights")

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.bookings.createIndex({ pnr: 1 }, { unique: true })
db.flights.createIndex({ flightId: 1 }, { unique: true })
```

## 🚀 Running the System

### Method 1: Manual Startup (Development)

Open 4 separate terminal windows:

#### Terminal 1: Frontend
```bash
cd skyvoyage-nextjs
npm run dev
# Runs on http://localhost:3000
```

#### Terminal 2: API Gateway
```bash
cd skyvoyage-gateway
npm run dev
# Runs on http://localhost:3001
```

#### Terminal 3: Backend API
```bash
cd backend
python app_enhanced.py
# Runs on http://localhost:8000
```

#### Terminal 4: Java Booking Engine
```bash
cd java-booking-engine
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Method 2: Using the Provided Scripts

#### Windows
```bash
# Run the provided batch file
START_SERVICES.bat
```

#### Unix/Linux/macOS
```bash
# Create and run shell script
chmod +x start-services.sh
./start-services.sh
```


## 🔧 Configuration

### API Keys Setup

1. **Amadeus API**:
   - Register at [Amadeus Developer Portal](https://developers.amadeus.com/)
   - Create a new application
   - Get Client ID and Client Secret
   - Update `.env` file

2. **Kiwi/Tequila API**:
   - Register at [Tequila Kiwi](https://tequila.kiwi.com/)
   - Get API Key
   - Update `.env` file

### MongoDB Connection

Ensure MongoDB is running and accessible:

```bash
# Test connection
mongosh --eval "db.adminCommand('ismaster')"
```

### Security Configuration

1. **JWT Secret**: Use a strong, unique secret key
2. **CORS**: Configure allowed origins properly
3. **Rate Limiting**: Adjust limits based on your needs
4. **Input Validation**: All inputs are validated at multiple levels

## 🧪 Testing

### Run E2E Tests
```bash
cd skyvoyage-nextjs
npm test
```

### Run API Tests
```bash
cd backend
python -m pytest
```

### Run Java Tests
```bash
cd java-booking-engine
mvn test
```

## 📊 Monitoring and Debugging

### Health Check Endpoints

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3001/health
- **Backend**: http://localhost:8000/health
- **Java Engine**: http://localhost:8080/actuator/health

### Logs Location

- **Frontend**: Console logs in browser
- **API Gateway**: Console output
- **Backend**: Console output
- **Java**: Logs in console or `logs/` directory

### Database Monitoring

```bash
# MongoDB stats
mongosh --eval "db.stats()"

# Check connections
mongosh --eval "db.serverStatus().connections"
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
netstat -tulpn | grep :3000

# Kill process
kill -9 <PID>

# Or use different port in .env
```

#### 2. MongoDB Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Check logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### 3. API Timeouts
```bash
# Check if all services are running
curl http://localhost:3000
curl http://localhost:3001/health
curl http://localhost:8000/health
curl http://localhost:8080/actuator/health
```

#### 4. Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 5. Java Compilation Errors
```bash
# Clean and rebuild
mvn clean
mvn compile

# Check Java version
java -version
javac -version
```

### Debug Mode

Enable debug logging by setting environment variable:
```bash
export DEBUG=skyvoyage:*
```

## 📱 Accessing the Application

Once all services are running:

1. **Main Application**: http://localhost:3000
2. **API Documentation**: http://localhost:8000/docs
3. **Health Dashboard**: http://localhost:3001/health

## 🔒 Security Considerations

### Development vs Production

- **Development**: Use default keys and local database
- **Production**: 
  - Use environment-specific secrets
  - Enable HTTPS
  - Use production database
  - Configure proper CORS
  - Set up monitoring and logging

### Security Headers

The API Gateway includes security headers via Helmet:
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

## 📈 Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization
- Debounced search inputs
- Lazy loading components

### Backend
- Connection pooling
- Redis caching (optional)
- Database indexing
- Async operations

### Database
- Proper indexing strategy
- Connection pooling
- Query optimization
- Regular maintenance

## 🔄 CI/CD Setup

### GitHub Actions Example

```yaml
name: SkyVoyage CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

## 📚 Additional Resources

### Documentation
- [API Documentation](http://localhost:8000/docs)
- [Database Schema](./database/schemas/)
- [Architecture Guide](./docs/architecture.md)

### Support
- Create an issue on GitHub
- Email: support@skyvoyage.com
- Documentation: [Wiki](https://github.com/your-org/skyvoyage/wiki)

## 🎯 Next Steps

1. **Configure Live APIs**: Set up Amadeus and Kiwi API keys
2. **Deploy to Production**: Use cloud platforms or traditional deployment methods
3. **Set Up Monitoring**: Add logging and monitoring tools
4. **Scale**: Load balancing and auto-scaling
5. **Security**: SSL certificates and security audits

---

**Happy Coding! 🚀**

For any issues or questions, please refer to the troubleshooting section or create an issue in the repository.
