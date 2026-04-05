from app.database.mongodb import get_database
from app.external_apis.amadeus_client import AmadeusClient
from app.models.flight import FlightInDB
import logging

logger = logging.getLogger(__name__)
amadeus = AmadeusClient()

async def search_flights_service(origin, destination, date, passengers):
    """Business logic for searching flights with caching"""
    db = get_database()
    
    # 1. Check local cache first (simplified)
    # In production, you'd check if cache is recent
    
    # 2. Call external API
    flights = await amadeus.search(origin, destination, date, passengers)
    
    # 3. Update cache
    if flights:
        # Clear old mock flights for this route if any
        # await db.flights.delete_many({"origin": origin, "destination": destination})
        # Insert new ones
        for f in flights:
            await db.flights.update_one(
                {"flight_number": f["flight_number"], "departure_time": f["departure_time"]},
                {"$set": f},
                upsert=True
            )
    
    return flights
