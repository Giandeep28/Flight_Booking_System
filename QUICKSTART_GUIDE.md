# 🚀 SkyVoyage Quick Start Guide

Complete setup instructions for the SkyVoyage enterprise flight booking platform.

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ 
- **Python** 3.9+
- **Java** 17+
- **MongoDB** 6.0+
- **Git** (for version control)

## 🛠️ Installation & Setup

### 1. Clone & Setup Frontend (Next.js)

```bash
cd skyvoyage-nextjs
npm install
npm run dev
```
🌐 **Frontend runs on**: http://localhost:3000

### 2. Setup API Gateway (Node.js)

```bash
cd skyvoyage-gateway
npm install
npm run dev
```
🔐 **Gateway runs on**: http://localhost:3001

### 3. Setup Backend API (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python app_enhanced.py
```
🐍 **Backend runs on**: http://localhost:8000

### 4. Setup Java Booking Engine

```bash
cd java-booking-engine
mvn clean install
mvn spring-boot:run
```
☕ **Java Engine runs on**: http://localhost:8080

## 🔧 Environment Configuration

Create `.env` files in each service directory:

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001
```

### API Gateway (.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=skyvoyage_super_secret_key_2024
FLIGHT_SERVICE_URL=http://localhost:8000
JAVA_BOOKING_URL=http://localhost:8080
```

### Backend (.env)
```env
AMADEUS_CLIENT_ID=your_amadeus_id
AMADEUS_CLIENT_SECRET=your_amadeus_secret
KIWI_API_KEY=your_kiwi_api_key
MONGODB_URL=mongodb://localhost:27017/skyvoyage
```

## 🎯 Quick Test Flow

1. **Open Browser**: Navigate to http://localhost:3000
2. **Search Flights**: 
   - From: Delhi (DEL)
   - To: Mumbai (BOM)
   - Date: Select tomorrow
3. **Select Flight**: Choose from results
4. **Complete Booking**: Fill passenger details, select seat, make payment
5. **Check Dashboard**: View your booking history

## 🧪 Running Tests

### Frontend Tests
```bash
cd skyvoyage-nextjs
npm test                    # Headless tests
npm run test:e2e           # Headed tests
npm run test:ui            # Interactive test UI
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

## 📊 Service Health Checks

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3001/health
- **Backend API**: http://localhost:8000/health
- **Java Engine**: http://localhost:8080/actuator/health

## 🔍 Debugging Tips

### Frontend Issues
- Check browser console for errors
- Verify network requests in DevTools
- Ensure all services are running

### Backend Issues
- Check Python version compatibility
- Verify MongoDB connection
- Check API logs for errors

### Java Engine Issues
- Verify Java 17+ is installed
- Check Maven dependencies
- Review Spring Boot logs

## 🚨 Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port
netstat -tulpn | grep :3000
# Kill process
kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Start MongoDB
mongod --dbpath /path/to/data
# Or use Docker
docker run -d -p 27017:27017 mongo
```

### CORS Issues
- Ensure FRONTEND_URL is correctly set in gateway
- Check API Gateway CORS configuration

## 📱 Mobile Testing

- Use browser dev tools mobile simulation
- Test on actual devices for best results
- Responsive design is fully implemented

## 🎨 Customization

### Change Theme Colors
Edit `app/globals.css`:
```css
:root {
  --primary: #C5A059;    /* Change gold color */
  --dark: #000814;        /* Change dark color */
}
```

### Add New Airlines
Update `backend/app_enhanced.py`:
```python
AIRLINES = [
    {"name": "Your Airline", "code": "YA", "logo": "logo_url"},
    # Add more airlines...
]
```

## 🚀 Production Deployment

### Build Frontend
```bash
cd skyvoyage-nextjs
npm run build
npm start
```

### Production Environment Variables
```bash
NODE_ENV=production
JWT_SECRET=your_production_secret
MONGODB_URL=mongodb://prod-server:27017/skyvoyage-prod
```

## 📚 API Documentation

- **Swagger UI**: http://localhost:8000/docs (FastAPI)
- **Postman Collection**: Available in `/docs` folder
- **API Examples**: Check `README_SKYVOYAGE_NEXTJS.md`

## 🆘 Support & Troubleshooting

### Getting Help
1. Check this guide first
2. Review service logs
3. Check GitHub Issues
4. Contact support team

### Log Locations
- **Frontend**: Browser console & terminal
- **Gateway**: Terminal output
- **Backend**: Python console output
- **Java**: Spring Boot logs

## 🎉 Success!

Once all services are running, you should see:
- ✅ Beautiful flight search interface
- ✅ Real-time flight results
- ✅ Smooth booking process
- ✅ Interactive seat selection
- ✅ Secure payment flow
- ✅ User dashboard
- ✅ Mobile-responsive design

**SkyVoyage is ready for takeoff!** ✈️

---

**Need Help?** 📧 support@skyvoyage.com | 📖 [Documentation](https://github.com/skyvoyage/docs)
