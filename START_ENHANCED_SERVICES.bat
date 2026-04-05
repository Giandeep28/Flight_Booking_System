@echo off
echo ========================================
echo SkyVoyage Enhanced Services Startup
echo ========================================
echo.

:: Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    pause
    exit /b 1
)

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9 or higher
    pause
    exit /b 1
)

:: Create necessary directories
echo Creating necessary directories...
if not exist "skyvoyage-data" mkdir skyvoyage-data
if not exist "skyvoyage-data\logs" mkdir skyvoyage-data\logs
if not exist "skyvoyage-data\tickets" mkdir skyvoyage-data\tickets
if not exist "logs" mkdir logs

:: Set environment variables
set JAVA_ENGINE_PORT=8085
set NODE_GATEWAY_PORT=3001
set PYTHON_SERVICE_PORT=8000
set MONGODB_URI=mongodb://127.0.0.1:27017/skyvoyage
set JWT_SECRET=skyvoyage_enhanced_secret_key_change_me_in_production
set AMADEUS_API_KEY=
set AMADEUS_API_SECRET=
set AMADEUS_PRODUCTION=false
set DUFFEL_ACCESS_TOKEN=
set AVIATION_STACK_KEY=
set FRONTEND_URL=http://localhost:3000
set FLIGHT_CACHE_TTL_MS=900000

echo.
echo Starting Enhanced SkyVoyage Services...
echo ========================================

:: Start MongoDB (assuming MongoDB is installed as a service)
echo Starting MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB started successfully
) else (
    echo MongoDB may already be running or not installed as service
    echo Please ensure MongoDB is running on port 27017
)

:: Wait for MongoDB to start
timeout /t 3 /nobreak >nul

:: Start Python Enhanced Backend
echo.
echo Starting Python Enhanced Backend (Port %PYTHON_SERVICE_PORT%)...
start "Python Backend" cmd /k "cd /d \"%~dp0backend\" && python enhanced_app.py"

:: Wait for Python service to start
timeout /t 5 /nobreak >nul

:: Start Node.js API Gateway
echo Starting Node.js API Gateway (Port %NODE_GATEWAY_PORT%)...
start "API Gateway" cmd /k "cd /d \"%~dp0skyvoyage\api-gateway\" && npm install && node server.js"

:: Wait for API Gateway to start
timeout /t 5 /nobreak >nul

:: Start Java Backend Engine
echo Starting Java Backend Engine (Port %JAVA_ENGINE_PORT%)...
start "Java Engine" cmd /k "cd /d \"%~dp0skyvoyage\java-engine\" && mvn spring-boot:run"

:: Wait for Java service to start
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo All Enhanced Services Started!
echo ========================================
echo.
echo Service URLs:
echo - Python Backend: http://localhost:%PYTHON_SERVICE_PORT%
echo - API Gateway: http://localhost:%NODE_GATEWAY_PORT%
echo - Java Engine: http://localhost:%JAVA_ENGINE_PORT%
echo - Enhanced Frontend: Open skyvoyage-enhanced-frontend.html
echo.
echo Health Check URLs:
echo - Python Health: http://localhost:%PYTHON_SERVICE_PORT%/health
echo - Gateway Health: http://localhost:%NODE_GATEWAY_PORT%/health
echo - Java Health: http://localhost:%JAVA_ENGINE_PORT%/health
echo.
echo API Documentation:
echo - Python API: http://localhost:%PYTHON_SERVICE_PORT%/docs
echo - Gateway Status: http://localhost:%NODE_GATEWAY_PORT%/api/integrations/status
echo.
echo Test Data:
echo - Sample test data available in skyvoyage_db_test.json
echo.
echo Press any key to open the enhanced frontend in browser...
pause >nul

:: Open enhanced frontend in browser
start "" "%~dp0skyvoyage-enhanced-frontend.html"

echo.
echo ========================================
echo SkyVoyage Enhanced System Ready!
echo ========================================
echo.
echo Features Available:
echo - Enhanced Flight Search with Intelligent Ranking
echo - Real-time Price Validation
echo - AI-Powered Chatbot Assistant
echo - Advanced Caching and Performance Optimization
echo - Concurrent Booking Processing
echo - Comprehensive Error Handling
echo - Enhanced Security with Rate Limiting
echo.
echo To stop all services, close the command windows or run STOP_SERVICES.bat
echo.
echo For production deployment:
echo 1. Update environment variables with real API keys
echo 2. Configure production database
echo 3. Set up SSL certificates
echo 4. Configure load balancer
echo 5. Set up monitoring and logging
echo.
pause
