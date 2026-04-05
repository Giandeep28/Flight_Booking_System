from app.database.mongodb import get_database
from app.models.booking import BookingCreate, BookingInDB
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

async def create_booking_service(booking_data: BookingCreate, user_id: str):
    """Business logic for creating a booking"""
    db = get_database()
    
    # 1. Generate PNR
    pnr = str(uuid.uuid4())[:6].upper()
    
    # 2. Get Flight Info for Price
    flight = await db.flights.find_one({"_id": booking_data.flight_id})
    if not flight:
        return None, "Flight not found"
        
    total_price = flight["price_total"] * len(booking_data.passengers)
    
    # 3. Create Record
    booking = {
        "user_id": user_id,
        "pnr_code": pnr,
        "flight_id": booking_data.flight_id,
        "passengers": [p.dict() for p in booking_data.passengers],
        "selected_seats": booking_data.selected_seats,
        "status": "pending",
        "total_price": total_price,
        "created_at": datetime.utcnow()
    }
    
    result = await db.bookings.insert_one(booking)
    return {**booking, "_id": str(result.inserted_id)}, None

async def get_user_bookings_service(user_id: str):
    """Retrieve all bookings for a specific user"""
    db = get_database()
    cursor = db.bookings.find({"user_id": user_id}).sort("created_at", -1)
    return await cursor.to_list(length=100)
    
async def confirm_booking_payment_service(booking_id: str, payment_id: str):
    """Update booking status after payment confirmation"""
    db = get_database()
    result = await db.bookings.update_one(
        {"_id": booking_id},
        {"$set": {"status": "confirmed", "payment_id": payment_id, "updated_at": datetime.utcnow()}}
    )
    return result.modified_count > 0
    
def generate_ticket_pdf(booking_id: str):
    """Placeholder for ticket generation logic"""
    pass
