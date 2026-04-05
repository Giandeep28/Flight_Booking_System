import stripe
from app.config import settings
import logging

logger = logging.getLogger(__name__)

if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

async def create_payment_intent(booking_id: str, amount: float, currency: str = "inr"):
    """Create Stripe payment intent for booking"""
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100), # Stripe expects amount in cents/paisa
            currency=currency,
            metadata={"booking_id": booking_id}
        )
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id
        }
    except Exception as e:
        logger.error(f"Stripe Payment Intent Error: {e}")
        return None

async def confirm_payment(payment_intent_id: str):
    """Verify payment status from Stripe"""
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        return intent.status == "succeeded"
    except Exception as e:
        logger.error(f"Stripe Payment Confirmation Error: {e}")
        return False
