@echo off
echo Starting SkyVoyage Flight Booking Platform...
echo.

echo [1/4] Starting API Gateway (Port 3001)...
cd /d "GIANDEEP MAIN\Flight Booking System\skyvoyage-gateway"
start "API Gateway" cmd /k "npm run dev"

echo [2/4] Starting Flight API (Port 8000)...
cd /d "GIANDEEP MAIN\Flight Booking System\backend"
start "Flight API" cmd /k "python app_enhanced.py"

echo [3/4] Starting Frontend (Port 3002)...
cd /d "GIANDEEP MAIN\Flight Booking System\skyvoyage-nextjs"
start "Frontend" cmd /k "npm run dev"

echo [4/4] Java Engine requires Maven - Please start manually:
echo cd "GIANDEEP MAIN\Flight Booking System\java-booking-engine"
echo mvn spring-boot:run
echo.

echo ========================================
echo SkyVoyage Platform Starting...
echo Frontend: http://localhost:3002
echo API Gateway: http://localhost:3001
echo Flight API: http://localhost:8000
echo Java Engine: http://localhost:8080 (manual start)
echo ========================================
echo.
echo Press any key to exit...
pause >nul
