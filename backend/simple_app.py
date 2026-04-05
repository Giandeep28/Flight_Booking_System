"""
SkyVoyage Simple Backend - Working Version
FastAPI backend for flight booking system
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn

app = FastAPI(title="SkyVoyage API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
AIRPORTS = [
    {"code": "DEL", "name": "Delhi", "city": "Delhi", "country": "India"},
    {"code": "BOM", "name": "Mumbai", "city": "Mumbai", "country": "India"},
    {"code": "SIN", "name": "Singapore", "city": "Singapore", "country": "Singapore"},
    {"code": "DXB", "name": "Dubai", "city": "Dubai", "country": "UAE"},
]

AIRLINES = [
    {"code": "6E", "name": "IndiGo"},
    {"code": "AI", "name": "Air India"},
    {"code": "SG", "name": "SpiceJet"},
    {"code": "EK", "name": "Emirates"},
]

class FlightResponse(BaseModel):
    id: str
    airline_name: str
    airline_code: str
    flight_number: str
    departure_airport: dict
    arrival_airport: dict
    departure_time: str
    arrival_time: str
    price: float
    currency: str
    available_seats: int
    cabin_class: str

@app.get("/")
async def root():
    return {"message": "SkyVoyage API is running", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/airports")
async def get_airports():
    """Get all airports"""
    return {"airports": AIRPORTS}

@app.get("/api/airlines")
async def get_airlines():
    """Get all airlines"""
    return {"airlines": AIRLINES}

@app.get("/api/flights")
async def get_flights(
    from_airport: Optional[str] = None,
    to_airport: Optional[str] = None,
    date: Optional[str] = None,
    passengers: Optional[int] = 1
):
    """Get flights based on search criteria"""
    flights = []
    
    # Generate mock flights
    for i in range(5):
        departure_time = datetime.now().replace(hour=6 + i * 2)
        arrival_time = departure_time.replace(hour=10 + i * 3)
        
        flight = {
            "id": f"flight_{i+1}",
            "airline_name": AIRLINES[i % len(AIRLINES)]["name"],
            "airline_code": AIRLINES[i % len(AIRLINES)]["code"],
            "flight_number": f"{AIRLINES[i % len(AIRLINES)]['code']}{100 + i}",
            "departure_airport": AIRPORTS[0] if from_airport else AIRPORTS[1],
            "arrival_airport": AIRPORTS[1] if to_airport else AIRPORTS[2],
            "departure_time": departure_time.isoformat(),
            "arrival_time": arrival_time.isoformat(),
            "price": 5000 + (i * 2000),
            "currency": "INR",
            "available_seats": 45 - (i * 5),
            "cabin_class": "Economy"
        }
        flights.append(FlightResponse(**flight))
    
    return {
        "status": "success",
        "total_results": len(flights),
        "flights": flights
    }

@app.get("/api/flights/{flight_id}")
async def get_flight_details(flight_id: str):
    """Get detailed flight information"""
    # Return mock flight details
    return {
        "id": flight_id,
        "airline_name": "IndiGo",
        "airline_code": "6E",
        "flight_number": "6E-2341",
        "departure_airport": {"code": "DEL", "name": "Delhi", "city": "Delhi", "country": "India"},
        "arrival_airport": {"code": "BOM", "name": "Mumbai", "city": "Mumbai", "country": "India"},
        "departure_time": "2024-12-15T08:00:00",
        "arrival_time": "2024-12-15T10:30:00",
        "price": 7500,
        "currency": "INR",
        "available_seats": 42,
        "cabin_class": "Economy",
        "aircraft_type": "Airbus A320"
    }

if __name__ == "__main__":
    print("🚀 Starting SkyVoyage Backend API...")
    print("📍 Available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
