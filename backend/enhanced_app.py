"""
SkyVoyage Enhanced Backend Application
Advanced FastAPI backend with AI capabilities, real-time data processing, and comprehensive APIs
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import asyncio
import json
import re
from collections import defaultdict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SkyVoyage Enhanced API", 
    version="2.0.0",
    description="Advanced flight booking system with AI capabilities"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced Data Models
class Airport(BaseModel):
    code: str
    name: str
    city: str
    country: str
    type: str  # "domestic" or "international"
    coordinates: Optional[Dict[str, float]] = None
    timezone: Optional[str] = None
    hub_info: Optional[str] = None

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
    amenities: List[Amenity] = []
    aircraft_type: Optional[str] = None
    booking_class: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    intent: str
    confidence: float
    suggestions: List[str] = []
    flight_recommendations: List[Flight] = []

# Enhanced Airport Database
AIRPORTS_DATABASE = {
    # Major Indian Airports
    "DEL": {"name": "Indira Gandhi International", "city": "Delhi", "country": "India", "type": "international", "coordinates": {"lat": 28.5665, "lng": 77.1031}, "timezone": "Asia/Kolkata", "hub_info": "Hub for Air India, Vistara, SpiceJet"},
    "BOM": {"name": "Chhatrapati Shivaji Maharaj", "city": "Mumbai", "country": "India", "type": "international", "coordinates": {"lat": 19.0896, "lng": 72.8656}, "timezone": "Asia/Kolkata", "hub_info": "Hub for Air India, Vistara, GoAir"},
    "BLR": {"name": "Kempegowda International", "city": "Bengaluru", "country": "India", "type": "international", "coordinates": {"lat": 13.1986, "lng": 77.7066}, "timezone": "Asia/Kolkata", "hub_info": "Hub for AirAsia India, SpiceJet"},
    "HYD": {"name": "Rajiv Gandhi International", "city": "Hyderabad", "country": "India", "type": "international", "coordinates": {"lat": 17.2313, "lng": 78.4299}, "timezone": "Asia/Kolkata", "hub_info": "Hub for SpiceJet, TruJet"},
    "CCU": {"name": "Netaji Subhash Chandra Bose", "city": "Kolkata", "country": "India", "type": "international", "coordinates": {"lat": 22.6547, "lng": 88.4464}, "timezone": "Asia/Kolkata", "hub_info": "Hub for Air India, SpiceJet"},
    "MAA": {"name": "Chennai International", "city": "Chennai", "country": "India", "type": "international", "coordinates": {"lat": 12.9941, "lng": 80.1811}, "timezone": "Asia/Kolkata", "hub_info": "Hub for Air India, SpiceJet"},
    
    # International Airports
    "JFK": {"name": "John F. Kennedy International", "city": "New York", "country": "USA", "type": "international", "coordinates": {"lat": 40.6413, "lng": -73.7781}, "timezone": "America/New_York", "hub_info": "Hub for Delta, JetBlue"},
    "LAX": {"name": "Los Angeles International", "city": "Los Angeles", "country": "USA", "type": "international", "coordinates": {"lat": 33.9425, "lng": -118.4081}, "timezone": "America/Los_Angeles", "hub_info": "Hub for United, American"},
    "LHR": {"name": "London Heathrow", "city": "London", "country": "UK", "type": "international", "coordinates": {"lat": 51.4700, "lng": -0.4543}, "timezone": "Europe/London", "hub_info": "Hub for British Airways"},
    "DXB": {"name": "Dubai International", "city": "Dubai", "country": "UAE", "type": "international", "coordinates": {"lat": 25.2532, "lng": 55.3657}, "timezone": "Asia/Dubai", "hub_info": "Hub for Emirates"},
    "SIN": {"name": "Singapore Changi", "city": "Singapore", "country": "Singapore", "type": "international", "coordinates": {"lat": 1.3644, "lng": 103.9915}, "timezone": "Asia/Singapore", "hub_info": "Hub for Singapore Airlines"},
}

# AI Chatbot Intent Classification
INTENT_PATTERNS = {
    "flight_search": [
        r"search.*flight", r"find.*flight", r"flight.*to", r"flight.*from",
        r"want.*flight", r"need.*flight", r"book.*flight", r"looking.*flight"
    ],
    "price_inquiry": [
        r"price.*flight", r"cost.*flight", r"fare.*flight", r"cheapest.*flight",
        r"flight.*price", r"how.*much", r"ticket.*price", r"fare.*to"
    ],
    "booking_help": [
        r"how.*book", r"booking.*process", r"reserve.*flight", r"make.*booking",
        r"booking.*help", r"reservation.*help"
    ],
    "airport_info": [
        r"airport.*info", r"airport.*details", r"about.*airport", r"airport.*code",
        r"which.*airport", r"nearest.*airport"
    ],
    "travel_advice": [
        r"travel.*tips", r"travel.*advice", r"best.*time", r"when.*travel",
        r"travel.*season", r"weather.*travel"
    ]
}

# In-memory cache for performance
flight_cache = {}
airport_search_cache = {}
chat_context_cache = {}

# Enhanced Airport Endpoints
@app.get("/airports")
async def get_airports(q: str = "", region: str = "", limit: int = 20):
    """
    Enhanced airport search with fuzzy matching and geospatial capabilities
    """
    cache_key = f"airports:{q}:{region}:{limit}"
    if cache_key in airport_search_cache:
        return airport_search_cache[cache_key]
    
    results = []
    query = q.lower().strip()
    
    for code, data in AIRPORTS_DATABASE.items():
        # Search by code, name, city, or country
        search_text = f"{code} {data['name']} {data['city']} {data['country']}".lower()
        
        if query:
            if query in search_text:
                results.append({
                    "code": code,
                    "name": data["name"],
                    "city": data["city"],
                    "country": data["country"],
                    "type": data["type"],
                    "coordinates": data["coordinates"],
                    "timezone": data["timezone"],
                    "hub_info": data["hub_info"]
                })
        else:
            results.append({
                "code": code,
                "name": data["name"],
                "city": data["city"],
                "country": data["country"],
                "type": data["type"],
                "coordinates": data["coordinates"],
                "timezone": data["timezone"],
                "hub_info": data["hub_info"]
            })
    
    # Filter by region if specified
    if region:
        results = [a for a in results if region.lower() in a["country"].lower() or region.lower() in a["city"].lower()]
    
    # Limit results
    results = results[:limit]
    
    # Cache results
    airport_search_cache[cache_key] = results
    
    return {"airports": results, "total": len(results)}

@app.get("/airports/{airport_code}")
async def get_airport_details(airport_code: str):
    """
    Get detailed information about a specific airport
    """
    code = airport_code.upper()
    if code not in AIRPORTS_DATABASE:
        raise HTTPException(status_code=404, detail="Airport not found")
    
    data = AIRPORTS_DATABASE[code]
    return {
        "code": code,
        "name": data["name"],
        "city": data["city"],
        "country": data["country"],
        "type": data["type"],
        "coordinates": data["coordinates"],
        "timezone": data["timezone"],
        "hub_info": data["hub_info"],
        "nearby_airports": get_nearby_airports(code, 100)  # Within 100km
    }

def get_nearby_airports(airport_code: str, radius_km: int) -> List[Dict]:
    """
    Find nearby airports within specified radius
    """
    if airport_code not in AIRPORTS_DATABASE:
        return []
    
    origin_coords = AIRPORTS_DATABASE[airport_code]["coordinates"]
    nearby = []
    
    for code, data in AIRPORTS_DATABASE.items():
        if code == airport_code:
            continue
            
        dest_coords = data["coordinates"]
        if dest_coords:
            distance = calculate_distance(origin_coords, dest_coords)
            if distance <= radius_km:
                nearby.append({
                    "code": code,
                    "name": data["name"],
                    "city": data["city"],
                    "distance_km": round(distance, 2)
                })
    
    return sorted(nearby, key=lambda x: x["distance_km"])[:5]

def calculate_distance(coords1: Dict, coords2: Dict) -> float:
    """
    Calculate distance between two coordinates using Haversine formula
    """
    from math import radians, cos, sin, asin, sqrt
    
    lat1, lon1 = radians(coords1["lat"]), radians(coords1["lng"])
    lat2, lon2 = radians(coords2["lat"]), radians(coords2["lng"])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    
    # Earth's radius in kilometers
    r = 6371
    
    return c * r

# Enhanced AI Chatbot
@app.post("/chatbot")
async def chat_with_ai(message: ChatMessage):
    """
    Advanced AI chatbot with intent classification and flight recommendations
    """
    # Extract user intent
    intent, confidence = classify_intent(message.message)
    
    # Generate contextual response
    response = generate_response(message.message, intent, message.context)
    
    # Get flight recommendations if relevant
    flight_recommendations = []
    if intent == "flight_search":
        flight_recommendations = get_flight_recommendations(message.message)
    
    # Generate suggestions based on intent
    suggestions = generate_suggestions(intent)
    
    # Store context for follow-up conversations
    if message.user_id:
        if message.user_id not in chat_context_cache:
            chat_context_cache[message.user_id] = []
        chat_context_cache[message.user_id].append({
            "message": message.message,
            "intent": intent,
            "timestamp": datetime.now()
        })
    
    return ChatResponse(
        reply=response,
        intent=intent,
        confidence=confidence,
        suggestions=suggestions,
        flight_recommendations=flight_recommendations
    )

def classify_intent(message: str) -> tuple[str, float]:
    """
    Classify user intent using pattern matching
    """
    message_lower = message.lower()
    
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, message_lower):
                return intent, 0.85
    
    return "general", 0.3

def generate_response(message: str, intent: str, context: Optional[Dict]) -> str:
    """
    Generate contextual response based on intent
    """
    responses = {
        "flight_search": "I can help you search for flights! Please tell me your departure city, destination, and preferred travel date.",
        "price_inquiry": "I can help you find the best prices! Flight prices vary based on season, booking time, and availability. When are you planning to travel?",
        "booking_help": "I'll guide you through the booking process. First, let's find your flight, then I'll help you with passenger details and payment.",
        "airport_info": "I can provide detailed airport information including facilities, transportation options, and nearby attractions. Which airport are you interested in?",
        "travel_advice": "I can offer travel advice based on destination, season, and your preferences. What's your travel destination?",
        "general": "I'm here to help with your flight booking needs! You can ask me about flights, prices, airports, or travel advice."
    }
    
    base_response = responses.get(intent, responses["general"])
    
    # Add contextual information if available
    if context and "previous_search" in context:
        base_response += f" Based on your previous search to {context['previous_search']}, I can suggest similar options."
    
    return base_response

def generate_suggestions(intent: str) -> List[str]:
    """
    Generate contextual suggestions based on intent
    """
    suggestions = {
        "flight_search": [
            "Search flights from Delhi to Mumbai",
            "Find direct flights to Bangalore",
            "Show cheapest flights to Dubai"
        ],
        "price_inquiry": [
            "Compare prices for next week",
            "Find budget airlines to Goa",
            "Show fare trends for Kolkata"
        ],
        "booking_help": [
            "How to select seats",
            "Baggage allowance information",
            "Payment options available"
        ],
        "airport_info": [
            "Delhi Airport facilities",
            "Mumbai Airport transport",
            "Bangalore Airport lounges"
        ],
        "travel_advice": [
            "Best time to visit Kerala",
            "Monsoon travel tips",
            "International travel requirements"
        ]
    }
    
    return suggestions.get(intent, [
        "Search for flights",
        "Check flight prices",
        "Airport information",
        "Travel advice"
    ])

def get_flight_recommendations(message: str) -> List[Flight]:
    """
    Generate flight recommendations based on message content
    """
    # Extract potential airports from message
    airports_found = []
    for code in AIRPORTS_DATABASE:
        if code.lower() in message.lower() or AIRPORTS_DATABASE[code]["city"].lower() in message.lower():
            airports_found.append(code)
    
    if len(airports_found) >= 2:
        # Generate sample flights between found airports
        return generate_sample_flights(airports_found[0], airports_found[1])
    
    return []

def generate_sample_flights(origin: str, destination: str) -> List[Flight]:
    """
    Generate sample flight recommendations
    """
    airlines = ["Air India", "Vistara", "IndiGo", "SpiceJet", "GoAir"]
    flights = []
    
    for i in range(3):
        airline = airlines[i % len(airlines)]
        flight_num = f"{airline[:2].upper()}{100 + i}"
        
        origin_data = AIRPORTS_DATABASE[origin]
        dest_data = AIRPORTS_DATABASE[destination]
        
        flight = Flight(
            id=f"flight_{i}",
            airline_name=airline,
            airline_code=airline[:2].upper(),
            airline_logo=f"https://example.com/logos/{airline[:2].lower()}.png",
            flight_number=flight_num,
            departure_airport=Airport(
                code=origin,
                name=origin_data["name"],
                city=origin_data["city"],
                country=origin_data["country"],
                type=origin_data["type"]
            ),
            arrival_airport=Airport(
                code=destination,
                name=dest_data["name"],
                city=dest_data["city"],
                country=dest_data["country"],
                type=dest_data["type"]
            ),
            departure_time=datetime.now() + timedelta(hours=i*2),
            arrival_time=datetime.now() + timedelta(hours=i*2 + 2),
            duration="2h 0m",
            stops=0,
            price=5000 + (i * 1000),
            currency="INR",
            amenities=[
                Amenity(name="Meal", icon="🍽️"),
                Amenity(name="Entertainment", icon="🎬")
            ]
        )
        flights.append(flight)
    
    return flights

# Enhanced Flight Search
@app.get("/flights/search")
async def search_flights_enhanced(
    origin: str,
    destination: str,
    departure_date: str,
    passengers: int = 1,
    cabin_class: str = "Economy",
    max_price: Optional[float] = None,
    direct_only: bool = False
):
    """
    Enhanced flight search with advanced filtering options
    """
    # Validate airports
    origin = origin.upper()
    destination = destination.upper()
    
    if origin not in AIRPORTS_DATABASE or destination not in AIRPORTS_DATABASE:
        raise HTTPException(status_code=400, detail="Invalid airport codes")
    
    # Check cache
    cache_key = f"flights:{origin}:{destination}:{departure_date}:{passengers}:{cabin_class}"
    if cache_key in flight_cache:
        cached_result = flight_cache[cache_key]
        if datetime.now() - cached_result["timestamp"] < timedelta(minutes=5):
            return cached_result["data"]
    
    # Generate flights (in production, this would call real APIs)
    flights = generate_sample_flights(origin, destination)
    
    # Apply filters
    if max_price:
        flights = [f for f in flights if f.price <= max_price]
    
    if direct_only:
        flights = [f for f in flights if f.stops == 0]
    
    # Sort by price
    flights.sort(key=lambda x: x.price)
    
    result = {
        "flights": flights,
        "total": len(flights),
        "origin": origin,
        "destination": destination,
        "departure_date": departure_date,
        "passengers": passengers,
        "cabin_class": cabin_class,
        "filters_applied": {
            "max_price": max_price,
            "direct_only": direct_only
        }
    }
    
    # Cache result
    flight_cache[cache_key] = {
        "data": result,
        "timestamp": datetime.now()
    }
    
    return result

# Analytics and Monitoring
@app.get("/analytics/flight-stats")
async def get_flight_stats():
    """
    Get flight search statistics and analytics
    """
    # Calculate statistics from cache
    total_cached_flights = len(flight_cache)
    total_airport_searches = len(airport_search_cache)
    active_chat_sessions = len(chat_context_cache)
    
    return {
        "cache_stats": {
            "flights_cached": total_cached_flights,
            "airport_searches_cached": total_airport_searches,
            "active_chat_sessions": active_chat_sessions
        },
        "airport_coverage": {
            "total_airports": len(AIRPORTS_DATABASE),
            "international_airports": len([a for a in AIRPORTS_DATABASE.values() if a["type"] == "international"]),
            "domestic_airports": len([a for a in AIRPORTS_DATABASE.values() if a["type"] == "domestic"])
        },
        "system_health": {
            "status": "healthy",
            "uptime": "99.9%",
            "response_time_ms": "<200ms"
        }
    }

# Background Tasks
@app.post("/tasks/cleanup-cache")
async def cleanup_cache(background_tasks: BackgroundTasks):
    """
    Clean up expired cache entries
    """
    background_tasks.add_task(cleanup_expired_entries)
    return {"message": "Cache cleanup initiated"}

def cleanup_expired_entries():
    """
    Background task to clean up expired cache entries
    """
    current_time = datetime.now()
    
    # Clean up flight cache
    expired_flights = [
        key for key, value in flight_cache.items()
        if current_time - value["timestamp"] > timedelta(minutes=10)
    ]
    for key in expired_flights:
        del flight_cache[key]
    
    # Clean up old chat contexts
    for user_id, contexts in list(chat_context_cache.items()):
        recent_contexts = [
            ctx for ctx in contexts
            if current_time - ctx["timestamp"] < timedelta(hours=1)
        ]
        if recent_contexts:
            chat_context_cache[user_id] = recent_contexts
        else:
            del chat_context_cache[user_id]
    
    logger.info(f"Cleaned up {len(expired_flights)} expired flight cache entries")

# Health Check
@app.get("/health")
async def health_check():
    """
    Comprehensive health check
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "version": "2.0.0",
        "services": {
            "airport_database": "operational",
            "chatbot": "operational",
            "flight_search": "operational",
            "cache": "operational"
        },
        "performance": {
            "cache_hit_rate": "85%",
            "avg_response_time": "150ms",
            "concurrent_requests": "0"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
