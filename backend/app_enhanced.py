"""
SkyVoyage Enhanced Backend Application
FastAPI backend for flight booking system with live API integration and NLP chatbot
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import asyncio
import aiohttp
import json
import re
import subprocess
import sys
from dataclasses import dataclass
import os
from amadeus_client import get_amadeus_client, AmadeusClient
from booking_service import booking_service
from airports_database import get_all_airports, get_airport_by_code, search_airports

app = FastAPI(
    title="SkyVoyage API", 
    version="2.0.0",
    description="Enterprise-grade flight booking platform with live data and AI assistance"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class Airport(BaseModel):
    code: str
    name: str
    city: str
    country: str
    type: str  # "domestic" or "international"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

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
    layovers: List[Dict[str, Any]] = []
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
    seat_number: Optional[str] = None
    cabin_class: str = "Economy"
    baggage_info: str = "20kg"
    special_requests: Optional[str] = None

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
    cabin_class: str

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

# Live API Configuration
@dataclass
class APIConfig:
    AMADEUS_CLIENT_ID: str = "YOUR_AMADEUS_CLIENT_ID"
    AMADEUS_CLIENT_SECRET: str = "YOUR_AMADEUS_CLIENT_SECRET"
    KIWI_API_KEY: str = "YOUR_KIWI_API_KEY"
    BASE_URL: str = "https://test.api.amadeus.com"
    KIWI_URL: str = "https://api.tequila.kiwi.com"

config = APIConfig()

# Import comprehensive airport database
from airports_database import get_all_airports, get_airport_by_code, search_airports

# Use the comprehensive airport database
def get_airports_list():
    """Get all airports from comprehensive database"""
    from airports_database import get_all_airports
    airports = get_all_airports()
    return [
        {
            "code": airport.code,
            "name": airport.name,
            "city": airport.city,
            "state": airport.state,
            "country": airport.country,
            "country_code": airport.country_code,
            "latitude": airport.latitude,
            "longitude": airport.longitude,
            "timezone": airport.timezone,
            "type": airport.type,
            "category": airport.category,
            "hub_for": airport.hub_for,
            "iata_code": airport.iata_code,
            "icao_code": airport.icao_code,
            "elevation": airport.elevation,
            "website": airport.website,
            "phone": airport.phone
        }
        for airport in airports
    ]

# Dynamic airport list from comprehensive database
AIRPORTS = get_airports_list()

AIRLINES = [
    {"name": "Indigo", "code": "6E", "logo": "https://www.gstatic.com/flights/airline_logos/70px/6E.png"},
    {"name": "Vistara", "code": "UK", "logo": "https://www.gstatic.com/flights/airline_logos/70px/UK.png"},
    {"name": "Air India", "code": "AI", "logo": "https://www.gstatic.com/flights/airline_logos/70px/AI.png"},
    {"name": "Emirates", "code": "EK", "logo": "https://www.gstatic.com/flights/airline_logos/70px/EK.png"},
    {"name": "Qatar Airways", "code": "QR", "logo": "https://www.gstatic.com/flights/airline_logos/70px/QR.png"},
    {"name": "Singapore Airlines", "code": "SQ", "logo": "https://www.gstatic.com/flights/airline_logos/70px/SQ.png"},
]

# In-memory storage (replace with MongoDB in production)
bookings_db = {}
chat_sessions = {}

class LiveFlightAPI:
    """Integration with live flight data APIs"""
    
    def __init__(self):
        self.amadeus_client = get_amadeus_client()
        self.use_real_api = os.getenv('USE_LIVE_API', 'true').lower() == 'true'
    
    async def get_amadeus_token(self):
        """Get Amadeus API token"""
        return await self.amadeus_client.get_access_token()
    
    async def search_flights_amadeus(self, origin: str, destination: str, departure_date: str, 
                                    adults: int = 1, return_date: str = None, 
                                    cabin_class: str = "ECONOMY") -> List[Dict]:
        """Search flights using real Amadeus API"""
        try:
            if self.use_real_api:
                print("🌐 Using LIVE Amadeus API for flight search")
                async with self.amadeus_client as client:
                    flights = await client.search_flights(
                        origin=origin,
                        destination=destination,
                        departure_date=departure_date,
                        adults=adults,
                        return_date=return_date,
                        cabin_class=cabin_class,
                        max_results=50
                    )
                    return flights
            else:
                print("🔧 Using MOCK data (set USE_LIVE_API=true for live data)")
                return await self.generate_mock_flights(origin, destination, departure_date)
                
        except Exception as e:
            print(f"❌ Amadeus API error: {e}")
            print("🔄 Falling back to mock data")
            return await self.generate_mock_flights(origin, destination, departure_date)
    
    async def search_flights_kiwi(self, origin: str, destination: str, departure_date: str) -> List[Dict]:
        """Search flights using Kiwi/Tequila API (placeholder for future implementation)"""
        return await self.search_flights_amadeus(origin, destination, departure_date)
    
    async def generate_mock_flights(self, origin: str, destination: str, departure_date: str) -> List[Dict]:
        """Generate realistic mock flight data"""
        flights = []
        origin_airport = next((a for a in AIRPORTS if a.code == origin), AIRPORTS[0])
        dest_airport = next((a for a in AIRPORTS if a.code == destination), AIRPORTS[1])
        
        for i in range(8):
            airline = AIRLINES[i % len(AIRLINES)]
            departure_hour = 6 + i * 2
            duration_hours = 2 + (i % 4)
            arrival_hour = (departure_hour + duration_hours) % 24
            
            flight = {
                "id": f"FL{uuid.uuid4().hex[:8].upper()}",
                "airline_name": airline["name"],
                "airline_code": airline["code"],
                "airline_logo": airline["logo"],
                "flight_number": f"{airline['code']}{100 + i}",
                "departure_airport": origin_airport.dict(),
                "arrival_airport": dest_airport.dict(),
                "departure_time": datetime.strptime(f"{departure_date} {departure_hour:02d}:15", "%Y-%m-%d %H:%M"),
                "arrival_time": datetime.strptime(f"{departure_date} {arrival_hour:02d}:{15 + i*10 % 60:02d}", "%Y-%m-%d %H:%M"),
                "duration": f"{duration_hours}h {30 + i * 10 % 60}m",
                "stops": i % 2,
                "layovers": [] if i % 2 == 0 else [{"airport": "DXB", "duration": "2h 30m"}],
                "price": 3500 + i * 1500 + (1000 if i % 3 == 0 else 0),
                "currency": "INR",
                "cabin_class": "Economy",
                "baggage_info": "20kg",
                "amenities": [
                    {"name": "WiFi", "icon": "wifi"},
                    {"name": "Meal", "icon": "utensils"},
                    {"name": "USB Charging", "icon": "bolt"}
                ],
                "status": "scheduled",
                "aircraft": "Boeing 737-800" if i % 2 == 0 else "Airbus A320"
            }
            flights.append(flight)
        
        return flights

class NLPChatbot:
    """AI-powered chatbot for flight assistance"""
    
    def __init__(self):
        self.intents = {
            "flight_search": ["search", "find", "book", "flight", "ticket", "travel"],
            "booking_status": ["status", "booking", "pnr", "confirmation", "ticket"],
            "cancellation": ["cancel", "refund", "change", "modify"],
            "baggage": ["baggage", "luggage", "weight", "carry", "check"],
            "checkin": ["check-in", "boarding", "check in", "online check"],
            "general": ["hello", "hi", "help", "information", "contact"]
        }
    
    def classify_intent(self, message: str) -> str:
        """Classify user intent from message"""
        message_lower = message.lower()
        
        for intent, keywords in self.intents.items():
            if any(keyword in message_lower for keyword in keywords):
                return intent
        
        return "general"
    
    def extract_entities(self, message: str) -> Dict[str, Any]:
        """Extract entities like dates, locations, etc."""
        entities = {}
        
        # Extract airport codes
        airport_codes = re.findall(r'\b([A-Z]{3})\b', message.upper())
        if airport_codes:
            entities["airports"] = airport_codes
        
        # Extract dates
        date_patterns = [
            r'\b(\d{1,2}\/\d{1,2}\/\d{4})\b',
            r'\b(\d{4}-\d{2}-\d{2})\b',
            r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b'
        ]
        
        for pattern in date_patterns:
            dates = re.findall(pattern, message, re.IGNORECASE)
            if dates:
                entities["dates"] = dates
                break
        
        # Extract PNR numbers
        pnr_pattern = r'\b([A-Z0-9]{6,8})\b'
        pnrs = re.findall(pnr_pattern, message.upper())
        if pnrs:
            entities["pnrs"] = pnrs
        
        return entities
    
    def generate_response(self, intent: str, entities: Dict[str, Any]) -> str:
        """Generate appropriate response based on intent and entities"""
        
        if intent == "flight_search":
            if "airports" in entities and len(entities["airports"]) >= 2:
                return f"I can help you search flights from {entities['airports'][0]} to {entities['airports'][1]}. Please visit our search page to enter your travel dates and preferences."
            else:
                return "I'd be happy to help you search for flights! Please visit our main search page or tell me your departure city, destination, and travel date."
        
        elif intent == "booking_status":
            if "pnrs" in entities:
                return f"I can check the status of booking {entities['pnrs'][0]}. Please enter your PNR in the manage booking section for detailed information."
            else:
                return "To check your booking status, please provide your PNR (booking reference) number or visit the manage booking section."
        
        elif intent == "cancellation":
            return "For cancellations and refunds, please visit the manage booking section with your PNR. Our cancellation policy allows free cancellation up to 24 hours before departure."
        
        elif intent == "baggage":
            return "Standard baggage allowance is 20kg for Economy class. You can add extra baggage during booking or through manage booking. Carry-on allowance is 7kg."
        
        elif intent == "checkin":
            return "Online check-in opens 48 hours before departure and closes 2 hours before. You can check in through our website or mobile app using your PNR."
        
        else:  # general
            return "Hello! I'm SkyVoyage's AI assistant. I can help you with flight searches, booking status, baggage information, check-in procedures, and more. How may I assist you today?"

flight_api = LiveFlightAPI()
chatbot = NLPChatbot()

# API Endpoints
@app.get("/")
async def root():
    return {"message": "SkyVoyage Enhanced API is running", "version": "2.0.0"}

@app.get("/api/airports/statistics")
async def get_airport_statistics():
    """
    Get comprehensive airport database statistics
    """
    try:
        from airports_database import get_airport_statistics
        stats = get_airport_statistics()
        return {
            "status": "success",
            "statistics": stats,
            "message": f"Database contains {stats['total_airports']} airports ({stats['indian_airports']} Indian + {stats['international_airports']} international)"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to get airport statistics: {str(e)}"
        }

@app.get("/api/airports/search")
async def search_airports_endpoint(q: str = "", limit: int = 20):
    """
    Search airports by name, city, or code
    """
    try:
        from airports_database import search_airports
        if not q:
            return {
                "status": "error",
                "message": "Query parameter 'q' is required",
                "results": []
            }
        
        airports = search_airports(q, limit)
        results = [
            {
                "code": airport.code,
                "name": airport.name,
                "city": airport.city,
                "country": airport.country,
                "country_code": airport.country_code,
                "latitude": airport.latitude,
                "longitude": airport.longitude,
                "type": airport.type,
                "category": airport.category,
                "hub_for": airport.hub_for
            }
            for airport in airports
        ]
        
        return {
            "status": "success",
            "query": q,
            "total_results": len(results),
            "airports": results
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Search failed: {str(e)}",
            "results": []
        }

@app.get("/api/airports/country/{country_code}")
async def get_airports_by_country_endpoint(country_code: str):
    """
    Get all airports by country code
    """
    try:
        from airports_database import get_airports_by_country
        airports = get_airports_by_country(country_code)
        results = [
            {
                "code": airport.code,
                "name": airport.name,
                "city": airport.city,
                "country": airport.country,
                "latitude": airport.latitude,
                "longitude": airport.longitude,
                "type": airport.type,
                "category": airport.category
            }
            for airport in airports
        ]
        
        return {
            "status": "success",
            "country_code": country_code.upper(),
            "total_airports": len(results),
            "airports": results
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to get airports for country {country_code}: {str(e)}",
            "airports": []
        }

@app.get("/api/airports/nearby")
async def get_nearby_airports_endpoint(lat: float = None, lon: float = None, radius: float = 100):
    """
    Get airports within radius of coordinates
    """
    try:
        if lat is None or lon is None:
            return {
                "status": "error",
                "message": "Both 'lat' and 'lon' parameters are required",
                "airports": []
            }
        
        from airports_database import get_nearby_airports
        airports = get_nearby_airports(lat, lon, radius)
        results = [
            {
                "code": airport.code,
                "name": airport.name,
                "city": airport.city,
                "country": airport.country,
                "latitude": airport.latitude,
                "longitude": airport.longitude,
                "distance_km": round(
                    ((lat - airport.latitude) ** 2 + (lon - airport.longitude) ** 2) ** 0.5 * 111.32, 2
                )
            }
            for airport in airports
        ]
        
        return {
            "status": "success",
            "center_coordinates": {"latitude": lat, "longitude": lon},
            "radius_km": radius,
            "total_airports": len(results),
            "airports": results
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to get nearby airports: {str(e)}",
            "airports": []
        }

@app.get("/api/airports")
async def get_all_airports_endpoint(limit: int = 50):
    """
    Get all airports (with pagination)
    """
    try:
        from airports_database import get_all_airports
        all_airports = get_all_airports()
        
        # Paginate results
        total_airports = len(all_airports)
        airports = all_airports[:limit] if limit > 0 else all_airports
        
        results = [
            {
                "code": airport.code,
                "name": airport.name,
                "city": airport.city,
                "state": airport.state,
                "country": airport.country,
                "country_code": airport.country_code,
                "latitude": airport.latitude,
                "longitude": airport.longitude,
                "timezone": airport.timezone,
                "type": airport.type,
                "category": airport.category,
                "hub_for": airport.hub_for,
                "iata_code": airport.iata_code,
                "icao_code": airport.icao_code,
                "elevation": airport.elevation,
                "website": airport.website,
                "phone": airport.phone
            }
            for airport in airports
        ]
        
        return {
            "status": "success",
            "total_airports": total_airports,
            "returned_airports": len(results),
            "limit": limit,
            "airports": results
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to get airports: {str(e)}",
            "airports": []
        }

@app.get("/api/airports/search")
async def search_airports_endpoint(q: str = "", limit: int = 20):
    """
    Search airports by query
    """
    try:
        from airports_database import search_airports
        if not q:
            return {"airports": []}
        
        airports = search_airports(q, limit)
        results = [
            {
                "code": airport.code,
                "name": airport.name,
                "city": airport.city,
                "country": airport.country,
                "country_code": airport.country_code,
                "latitude": airport.latitude,
                "longitude": airport.longitude,
                "type": airport.type,
                "category": airport.category,
                "hub_for": airport.hub_for
            }
            for airport in airports
        ]
        
        return {
            "status": "success",
            "query": q,
            "total_results": len(results),
            "airports": results
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Search failed: {str(e)}",
            "results": []
        }

@app.get("/api/airlines")
async def get_airlines():
    """Get all airlines"""
    return {"airlines": AIRLINES}

@app.get("/api/flights")
async def get_flights(
    from_param: Optional[str] = None,
    to_param: Optional[str] = None,
    date_param: Optional[str] = None,
    passengers: Optional[int] = 1,
    tripType: Optional[str] = "oneway",
    returnDate: Optional[str] = None,
    cabinClass: Optional[str] = "Economy"
):
    """
    Search flights with live Amadeus API integration
    """
    try:
        print(f"🔍 Flight search request: {from_param} → {to_param} on {date_param}")
        
        # Validate required parameters
        if not all([from_param, to_param, date_param]):
            return {
                "status": "error",
                "message": "Missing required parameters: from, to, date",
                "flights": []
            }
        
        # Search flights using Amadeus API
        flights = await flight_api.search_flights_amadeus(
            origin=from_param,
            destination=to_param,
            departure_date=date_param,
            adults=passengers,
            return_date=returnDate if tripType == "round" else None,
            cabin_class=cabinClass
        )
        
        # Add search metadata
        response = {
            "status": "success",
            "total_results": len(flights),
            "search_params": {
                "from": from_param,
                "to": to_param,
                "date": date_param,
                "passengers": passengers,
                "tripType": tripType,
                "returnDate": returnDate,
                "cabinClass": cabinClass
            },
            "timestamp": datetime.now().isoformat(),
            "flights": flights
        }
        
        print(f"✅ Returning {len(flights)} flights from search")
        return response
        
    except Exception as e:
        error_msg = f"Search failed: {str(e)}"
        print(f"❌ Flight search error: {str(e)}")
        return {
            "status": "error",
            "message": error_msg,
            "flights": []
        }

@app.get("/api/flights/{flight_id}")
async def get_flight_details(flight_id: str):
    """Get detailed flight information"""
    # In production, fetch from database or API
    mock_flight = {
        "id": flight_id,
        "airline_name": "IndiGo",
        "airline_code": "6E",
        "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
        "flight_number": "6E2341",
        "departure_airport": AIRPORTS[0].dict(),
        "arrival_airport": AIRPORTS[1].dict(),
        "departure_time": datetime.now() + timedelta(hours=2),
        "arrival_time": datetime.now() + timedelta(hours=6),
        "duration": "4h 30m",
        "stops": 0,
        "layovers": [],
        "price": 8500.0,
        "currency": "INR",
        "cabin_class": "Economy",
        "baggage_info": "20kg",
        "amenities": [
            {"name": "WiFi", "icon": "wifi"},
            {"name": "Meal", "icon": "utensils"},
            {"name": "USB Charging", "icon": "bolt"}
        ],
        "status": "scheduled",
        "aircraft": "Airbus A320neo"
    }
    return mock_flight

@app.post("/api/bookings/live", response_model=Booking)
async def create_live_booking(booking: BookingRequest, background_tasks: BackgroundTasks):
    """
    Create a real-time booking using Amadeus Order API
    """
    try:
        print(f"🎫 Creating LIVE booking: {booking.passenger_name}")
        
        # Get flight details (in production, this would come from the flight offer)
        flight_details = await get_flight_details(booking.flight_id)
        
        if not flight_details:
            raise HTTPException(status_code=404, detail="Flight not found")
        
        # Prepare passenger information
        passenger_info = {
            'first_name': booking.passenger_name.split(' ')[0] if ' ' in booking.passenger_name else booking.passenger_name,
            'last_name': booking.passenger_name.split(' ')[1] if ' ' in booking.passenger_name else 'User',
            'email': booking.passenger_email,
            'phone': booking.passenger_phone,
            'date_of_birth': '1990-01-01',  # Would come from form
            'gender': 'MALE',  # Would come from form
            'passport_number': None  # Would come from form
        }
        
        # Prepare seat information
        seat_info = {
            'seat_number': booking.seat_number or '12A',
            'characteristics': ['WINDOW', 'RECLINING']
        } if booking.seat_number else None
        
        # Create live booking
        booking_result = await booking_service.create_live_booking(
            flight_offer=flight_details,
            passenger_info=passenger_info,
            seat_info=seat_info
        )
        
        if booking_result['success']:
            # Store booking in database
            new_booking = Booking(
                pnr=booking_result['pnr'],
                flight_id=booking.flight_id,
                passenger_name=booking.passenger_name,
                passenger_email=booking.passenger_email,
                passenger_phone=booking.passenger_phone,
                booking_date=datetime.now(),
                status=booking_result['status'],
                seat_number=booking.seat_number or "12A",
                total_amount=flight_details.get('price', 5000.0),
                cabin_class=booking.cabin_class
            )
            
            bookings_db[booking_result['pnr']] = new_booking.dict()
            
            # Generate e-ticket in background
            background_tasks.add_task(generate_eticket, booking_result['pnr'])
            
            return new_booking
        else:
            raise HTTPException(
                status_code=400,
                detail=booking_result.get('error', 'Booking failed')
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Live booking error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create booking")

@app.get("/api/bookings/{pnr}/live")
async def get_live_booking_details(pnr: str):
    """
    Get live booking details by PNR
    """
    try:
        print(f"🔍 Getting LIVE booking details for PNR: {pnr}")
        
        # First check local database
        if pnr in bookings_db:
            return bookings_db[pnr]
        
        # If not found, try to get from Amadeus
        booking_details = await booking_service.get_booking_details(pnr)
        
        if booking_details:
            return booking_details
        else:
            raise HTTPException(status_code=404, detail="Booking not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting booking details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get booking details")

@app.delete("/api/bookings/{pnr}/live")
async def cancel_live_booking(pnr: str, reason: str = "Customer request"):
    """
    Cancel a live booking
    """
    try:
        print(f"❌ Cancelling LIVE booking: {pnr}")
        
        # Cancel booking with Amadeus
        cancel_result = await booking_service.cancel_booking(pnr, reason)
        
        if cancel_result['success']:
            # Update local database
            if pnr in bookings_db:
                bookings_db[pnr]['status'] = 'cancelled'
                bookings_db[pnr]['cancelled_at'] = datetime.now().isoformat()
                bookings_db[pnr]['cancellation_reason'] = reason
            
            return {
                "message": "Booking cancelled successfully",
                "pnr": pnr,
                "status": "cancelled"
            }
        else:
            raise HTTPException(
                status_code=400,
                detail=cancel_result.get('error', 'Cancellation failed')
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error cancelling booking: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to cancel booking")

@app.post("/api/bookings", response_model=Booking)
async def create_booking(booking: BookingRequest, background_tasks: BackgroundTasks):
    """
    Create a new booking with Java backend integration
    """
    try:
        # Generate PNR
        pnr = str(uuid.uuid4())[:8].upper()
        
        # Create booking record
        new_booking = Booking(
            pnr=pnr,
            flight_id=booking.flight_id,
            passenger_name=booking.passenger_name,
            passenger_email=booking.passenger_email,
            passenger_phone=booking.passenger_phone,
            booking_date=datetime.now(),
            status="confirmed",
            seat_number=booking.seat_number or "12A",
            total_amount=5000.0,  # Calculate based on flight pricing
            cabin_class=booking.cabin_class
        )
        
        # Store in database (in-memory for demo)
        bookings_db[pnr] = new_booking.dict()
        
        # Call Java booking engine for seat locking and processing
        background_tasks.add_task(call_java_booking_engine, {
            "pnr": pnr,
            "flight_id": booking.flight_id,
            "passenger_name": booking.passenger_name,
            "seat_number": new_booking.seat_number,
            "action": "lock_seat"
        })
        
        # Generate e-ticket in background
        background_tasks.add_task(generate_eticket, pnr)
        
        return new_booking
        
    except Exception as e:
        print(f"Booking creation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create booking")

@app.get("/api/bookings/{pnr}")
async def get_booking(pnr: str):
    """Get booking details by PNR"""
    if pnr not in bookings_db:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return bookings_db[pnr]

@app.get("/api/bookings/user")
async def get_user_bookings():
    """Get all bookings for authenticated user"""
    # In production, filter by user ID from auth token
    return {"bookings": list(bookings_db.values())}

@app.post("/api/chatbot/message")
async def chatbot_message(chat: ChatMessage):
    """
    Process chatbot message with NLP
    """
    try:
        # Get or create session
        session_id = chat.session_id or str(uuid.uuid4())
        if session_id not in chat_sessions:
            chat_sessions[session_id] = {"messages": [], "created_at": datetime.now()}
        
        # Add user message to session
        chat_sessions[session_id]["messages"].append({
            "role": "user",
            "message": chat.message,
            "timestamp": datetime.now()
        })
        
        # Process message with NLP
        intent = chatbot.classify_intent(chat.message)
        entities = chatbot.extract_entities(chat.message)
        response = chatbot.generate_response(intent, entities)
        
        # Add bot response to session
        chat_sessions[session_id]["messages"].append({
            "role": "bot",
            "message": response,
            "timestamp": datetime.now(),
            "intent": intent,
            "entities": entities
        })
        
        return {
            "response": response,
            "session_id": session_id,
            "intent": intent,
            "entities": entities
        }
        
    except Exception as e:
        print(f"Chatbot error: {e}")
        return {
            "response": "I'm having trouble processing your request right now. Please try again or contact our support team.",
            "session_id": chat.session_id
        }

@app.get("/api/chatbot/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat session history"""
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return chat_sessions[session_id]

# Java Integration Functions
async def call_java_booking_engine(booking_data: Dict[str, Any]):
    """
    Call Java multithreading booking engine via subprocess
    In production, this would be a REST API call to the Java service
    """
    try:
        # Prepare command for Java booking engine
        java_command = [
            "java", 
            "-jar", 
            "booking-engine.jar",
            json.dumps(booking_data)
        ]
        
        # Execute Java booking engine
        process = await asyncio.create_subprocess_exec(
            *java_command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            print(f"Java booking engine error: {stderr.decode()}")
        else:
            print(f"Java booking engine response: {stdout.decode()}")
            
    except Exception as e:
        print(f"Failed to call Java booking engine: {e}")
        # Fallback processing in Python
        await process_booking_fallback(booking_data)

async def process_booking_fallback(booking_data: Dict[str, Any]):
    """Fallback booking processing if Java engine is unavailable"""
    # Simulate seat locking and booking confirmation
    await asyncio.sleep(2)  # Simulate processing time
    print(f"Processed booking {booking_data['pnr']} with fallback mechanism")

async def generate_eticket(pnr: str):
    """Generate PDF e-ticket"""
    try:
        # In production, use a PDF library like ReportLab
        # For demo, just log the action
        await asyncio.sleep(1)
        print(f"Generated e-ticket for PNR: {pnr}")
        
        # Store e-ticket path in booking
        if pnr in bookings_db:
            bookings_db[pnr]["eticket_path"] = f"/etickets/{pnr}.pdf"
            
    except Exception as e:
        print(f"E-ticket generation error: {e}")

# Health check endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "version": "2.0.0",
        "services": {
            "amadeus_api": "connected",  # Check actual connection in production
            "java_engine": "connected",     # Check actual connection in production
            "database": "connected"         # Check actual connection in production
        }
    }

@app.get("/api/stats")
async def get_api_stats():
    """Get API statistics"""
    return {
        "total_airports": len(AIRPORTS),
        "total_airlines": len(AIRLINES),
        "total_bookings": len(bookings_db),
        "active_chat_sessions": len(chat_sessions),
        "uptime": "2.5 hours"  # Calculate actual uptime in production
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
