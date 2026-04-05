from fastapi import APIRouter
from app.api.v1.endpoints import flights, bookings, auth, payments, users

router = APIRouter()

router.include_router(flights.router, prefix="/flights", tags=["flights"])
router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(payments.router, prefix="/payments", tags=["payments"])
router.include_router(users.router, prefix="/users", tags=["users"])
