from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.database.mongodb import get_database
from app.models.flight import FlightSearchRequest, FlightInDB
from datetime import datetime

router = APIRouter()

@router.get("/search")
async def search_flights(
    origin: str = Query(..., min_length=3),
    destination: str = Query(..., min_length=3),
    departure_date: str = Query(...),
    return_date: Optional[str] = None,
    passengers: int = Query(1, ge=1, le=9),
    cabin_class: str = Query("economy")
):
    """Search flights from external APIs or local DB cache"""
    db = get_database()
    
    # In a real app, you'd call Amadeus/Kiwi Client here
    # For now, let's return some mock data or search local DB
    query = {
        "origin": origin.upper(),
        "destination": destination.upper(),
        # "departure_time": {"$gte": datetime.fromisoformat(departure_date)}
    }
    
    flights_cursor = db.flights.find(query)
    flights = await flights_cursor.to_list(length=100)
    
    return {
        "total_results": len(flights),
        "flights": flights
    }

@router.get("/{flight_id}")
async def get_flight(flight_id: str):
    db = get_database()
    flight = await db.flights.find_one({"_id": flight_id})
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight
