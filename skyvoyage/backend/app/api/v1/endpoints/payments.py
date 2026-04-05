from fastapi import APIRouter, HTTPException, Depends
from app.models.booking import PaymentConfirmRequest
from app.database.mongodb import get_database
from app.external_apis.stripe_client import create_payment_intent, confirm_payment
from app.core.security import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/intent")
async def get_payment_intent(booking_id: str, current_user_id = Depends(get_current_user)):
    """Create Stripe payment intent for a booking"""
    db = get_database()
    booking = await db.bookings.find_one({"_id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    intent_data = await create_payment_intent(booking_id, booking["total_price"])
    if not intent_data:
        raise HTTPException(status_code=500, detail="Failed to create payment intent")
        
    return intent_data

@router.post("/confirm")
async def confirm_booking_payment(request: PaymentConfirmRequest, current_user_id = Depends(get_current_user)):
    """Confirm payment and update booking status"""
    db = get_database()
    
    # Verify status from Stripe
    is_success = await confirm_payment(request.payment_method_id)
    if not is_success:
        raise HTTPException(status_code=400, detail="Payment verification failed")
        
    # Update booking status
    result = await db.bookings.update_one(
        {"_id": request.booking_id},
        {"$set": {"status": "confirmed", "payment_id": request.payment_method_id}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found or already confirmed")
        
    return {"status": "confirmed", "message": "Booking payment successful"}
    
@router.post("/webhook")
async def stripe_webhook():
    """Handle Stripe webhooks here for production-ready async status updates"""
    # Implementation details depend on specific requirements
    return {"status": "received"}
