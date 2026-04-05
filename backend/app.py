"""
SkyVoyage Backend Application
FastAPI backend for flight booking system
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="SkyVoyage API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware(
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
)

class Airport(BaseModel):
    code: str
    name: str
    city: str
    country: str
    type: str  # "domestic" or "international"

class Amenity(BaseModel):
    name: str
    icon: str

class Flight(BaseModel):
    id: str
    airline_name: str
    airline_code: str
    airline_logo: str
    flight_number: str
    departure_airport: Airport
    arrival_airport: Airport
    departure_time: datetime
    arrival_time: datetime
    duration: str
    stops: int
    layovers: List[dict] = []
    price: float
    currency: str
    cabin_class: str
    baggage_info: str
    amenities: List[Amenity]
    status: str
    aircraft: str

class BookingRequest(BaseModel):
    flight_id: str
    passenger_name: str
    passenger_email: str
    passenger_phone: str

class Booking(BaseModel):
    pnr: str
    flight_id: str
    passenger_name: str
    passenger_email: str
    passenger_phone: str
    booking_date: datetime
    status: str
    seat_number: str
    total_amount: float

# Mock data
AIRPORTS = [
    Airport(code="DEL", name="Indira Gandhi International", city="Delhi", country="India", type="domestic"),
    Airport(code="BOM", name="Chhatrapati Shivaji Maharaj", city="Mumbai", country="India", type="domestic"),
    Airport(code="JFK", name="John F. Kennedy International", city="New York", country="USA", type="international"),
    Airport(code="LHR", name="Heathrow", city="London", country="UK", type="international"),
]

AIRLINES = [
    {"name": "Indigo", "code": "6E", "logo": "https://logo.clearbit.com/indigo.com"},
    {"name": "Vistara", "code": "UK", "logo": "https://logo.clearbit.com/vistara.com"},
    {"name": "Air India", "code": "AI", "logo": "https://logo.clearbit.com/airindia.com"},
]

@app.get("/")
async def root():
    return {"message": "SkyVoyage API is running", "version": "1.0.0"}

@app.get("/api/airports")
async def get_airports():
    return {"airports": AIRPORTS}

@app.get("/api/airlines")
async def get_airlines():
    return {"airlines": AIRLINES}

@app.get("/api/flights")
async def get_flights(
    from: Optional[str] = None,
    to: Optional[str] = None,
    date: Optional[str] = None,
    passengers: Optional[int] = 1
):
    """
    Get flights based on search criteria
    """
    # Mock flight data generation
    flights = []
    for i in range(8):
        departure_time = datetime.now().replace(hour=6 + i * 2)
        arrival_time = departure_time.replace(hour=10 + i * 3)
        duration = f"{2 + i}h {30 + i * 10}m"
        
        flights.append(Flight(
            id=f"FL{1000 + i}",
            airline_name=AIRLINES[i % len(AIRLINES)]["name"],
            airline_code=AIRLINES[i % len(AIRLINES)]["code"],
            airline_logo=AIRLINES[i % len(AIRLINES)]["logo"],
            flight_number=f"{AIRLINES[i % len(AIRLINES)]['code']}{100 + i}",
            departure_airport=AIRPORTS[0] if i % 2 == 0 else AIRPORTS[1],
            arrival_airport=AIRPORTS[1] if i % 2 == 0 else AIRPORTS[0],
            departure_time=departure_time,
            arrival_time=arrival_time,
            duration=duration,
            stops=i % 2,
            layovers=[],
            price=3000 + i * 1500,
            currency="INR",
            cabin_class="Economy",
            baggage_info="20kg",
            amenities=[
                Amenity(name="WiFi", icon="wifi"),
                Amenity(name="Meal", icon="utensils"),
                Amenity(name="USB Charging", icon="bolt")
            ],
            status="scheduled",
            aircraft="Boeing 737"
        ))
    
    return {"flights": flights}

@app.post("/api/bookings", response_model=Booking)
async def create_booking(booking: BookingRequest):
    """
    Create a new booking
    """
    pnr = str(uuid.uuid4())[:8].upper()
    
    return Booking(
        pnr=pnr,
        flight_id=booking.flight_id,
        passenger_name=booking.passenger_name,
        passenger_email=booking.passenger_email,
        passenger_phone=booking.passenger_phone,
        booking_date=datetime.now(),
        status="confirmed",
        seat_number="12A",
        total_amount=5000
    )

@app.get("/api/bookings/{pnr}")
async def get_booking(pnr: str):
    """
    Get booking details by PNR
    """
    # Mock booking data
    return Booking(
        pnr=pnr,
        flight_id="FL1234",
        passenger_name="John Doe",
        passenger_email="john@example.com",
        passenger_phone="+1234567890",
        booking_date=datetime.now(),
        status="confirmed",
        seat_number="12A",
        total_amount=5000
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
