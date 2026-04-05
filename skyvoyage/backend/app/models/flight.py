from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class FlightBase(BaseModel):
    flight_number: str
    airline_code: str
    origin: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    price_total: float
    available_seats: int
    aircraft_type: str

class FlightInDB(FlightBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FlightSearchRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: Optional[str] = None
    passengers: int = 1
    cabin_class: str = "economy"
