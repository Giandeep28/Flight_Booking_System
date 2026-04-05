from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PassengerInfo(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    passport_number: str
    date_of_birth: str

class BookingCreate(BaseModel):
    flight_id: str
    passengers: List[PassengerInfo]
    selected_seats: List[str]

class BookingInDB(BookingCreate):
    id: str = Field(alias="_id")
    user_id: str
    pnr_code: str
    status: str = "pending"
    total_price: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentConfirmRequest(BaseModel):
    booking_id: str
    payment_method_id: str
