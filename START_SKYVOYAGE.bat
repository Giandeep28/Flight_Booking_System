@echo off
title SkyVoyage OTA Platform Launcher
color 0A
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║          SKYVOYAGE OTA PLATFORM LAUNCHER             ║
echo  ║          Production Multi-Service Stack              ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

set BASE_DIR=%~dp0
set JAVA_BUILD=%BASE_DIR%skyvoyage\java-backend\build
set PYTHON_DIR=%BASE_DIR%skyvoyage\python-layer
set NODE_DIR=%BASE_DIR%skyvoyage\api-gateway
set MONGO_DIR=%BASE_DIR%mongodb_data

:: Step 1: Start MongoDB
echo [1/4] Starting MongoDB...
if not exist "%MONGO_DIR%" mkdir "%MONGO_DIR%"
start "MongoDB" /min "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "%MONGO_DIR%" --port 27017 --logpath "%MONGO_DIR%\mongod.log"
timeout /t 3 /nobreak > nul
echo       MongoDB started on port 27017

:: Step 2: Start Python Intelligence Layer
echo [2/4] Starting Python Intelligence Layer...
start "Python-Intelligence" /min cmd /c "cd /d %PYTHON_DIR% && python main.py"
timeout /t 3 /nobreak > nul
echo       Python service started on port 5000

:: Step 3: Start Java Core Backend
echo [3/4] Starting Java Core Backend...
start "Java-Backend" /min cmd /c "cd /d %BASE_DIR%skyvoyage\java-backend && java -cp build com.skyvoyage.server.SkyVoyageServer"
timeout /t 3 /nobreak > nul
echo       Java service started on port 8080

:: Step 4: Start Node.js API Gateway
echo [4/4] Starting Node.js API Gateway...
start "Node-Gateway" /min cmd /c "cd /d %NODE_DIR% && node server.js"
timeout /t 3 /nobreak > nul
echo       Gateway started on port 4000

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║  ALL SERVICES RUNNING                                ║
echo  ║                                                      ║
echo  ║  Frontend:  http://localhost:4000                     ║
echo  ║  Gateway:   http://localhost:4000/api/health          ║
echo  ║  Python:    http://localhost:5000/health              ║
echo  ║  Java:      http://localhost:8080/health              ║
echo  ║  MongoDB:   mongodb://localhost:27017                 ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
echo  Press any key to open SkyVoyage in your browser...
pause > nul
start http://localhost:4000
