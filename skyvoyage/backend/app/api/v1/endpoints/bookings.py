from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.booking import BookingCreate, BookingInDB
from app.database.mongodb import get_database
from app.core.security import get_current_user
from datetime import datetime
import uuid

router = APIRouter()

def generate_pnr():
    return str(uuid.uuid4())[:6].upper()

@router.post("")
async def create_booking(
    request: BookingCreate,
    current_user_id = Depends(get_current_user)
):
    """Create new booking"""
    db = get_database()
    
    # Validate flight exists
    flight = await db.flights.find_one({"_id": request.flight_id})
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    
    # Generate PNR
    pnr_code = generate_pnr()
    
    # Create booking
    booking = {
        "user_id": current_user_id,
        "pnr_code": pnr_code,
        "flight_id": request.flight_id,
        "passengers": [p.dict() for p in request.passengers],
        "selected_seats": request.selected_seats,
        "status": "pending",
        "total_price": flight["price_total"] * len(request.passengers),
        "created_at": datetime.utcnow()
    }
    
    result = await db.bookings.insert_one(booking)
    
    return {
        "id": str(result.inserted_id),
        "pnr_code": pnr_code,
        "status": "pending",
        "total_price": booking["total_price"]
    }

@router.get("/{booking_id}")
async def get_booking(booking_id: str, current_user_id = Depends(get_current_user)):
    db = get_database()
    booking = await db.bookings.find_one({"_id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking
