import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
# Add parent dir to sys.path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.config import settings

async def setup():
    print(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # User indexes
    print("Creating User indexes...")
    await db.users.create_index("email", unique=True)
    await db.users.create_index("phone", unique=True)
    await db.users.create_index("username", unique=True)
    
    # Flight indexes
    print("Creating Flight indexes...")
    await db.flights.create_index([
        ("departure_date", 1),
        ("origin", 1),
        ("destination", 1)
    ])
    await db.flights.create_index("flight_number")
    
    # Booking indexes
    print("Creating Booking indexes...")
    await db.bookings.create_index("pnr_code", unique=True)
    await db.bookings.create_index("user_id")
    await db.bookings.create_index("created_at")
    
    # Seed sample flights
    print("Seeding sample flights...")
    sample_flights = [
        {
            "flight_number": "AI101",
            "airline_code": "AI",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "2026-04-10T10:00:00",
            "arrival_time": "2026-04-10T12:00:00",
            "price_total": 4500.0,
            "available_seats": 45,
            "aircraft_type": "Boeing 787"
        },
        {
            "flight_number": "6E245",
            "airline_code": "6E",
            "origin": "DEL",
            "destination": "BOM",
            "departure_time": "2026-04-10T14:00:00",
            "arrival_time": "2026-04-10T16:00:00",
            "price_total": 3800.0,
            "available_seats": 120,
            "aircraft_type": "Airbus A320"
        },
        {
            "flight_number": "UK981",
            "airline_code": "UK",
            "origin": "BOM",
            "destination": "BLR",
            "departure_time": "2026-04-11T09:00:00",
            "arrival_time": "2026-04-11T10:45:00",
            "price_total": 5200.0,
            "available_seats": 60,
            "aircraft_type": "Boeing 737"
        }
    ]
    
    for f in sample_flights:
        await db.flights.update_one(
            {"flight_number": f["flight_number"], "departure_time": f["departure_time"]},
            {"$set": f},
            upsert=True
        )
    
    print("✓ Database setup completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(setup())
