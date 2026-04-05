from amadeus import Client, ResponseError
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class AmadeusClient:
    def __init__(self):
        try:
            self.client = Client(
                client_id=settings.AMADEUS_CLIENT_ID,
                client_secret=settings.AMADEUS_CLIENT_SECRET
            )
        except Exception as e:
            logger.error(f"Failed to initialize Amadeus client: {e}")
            self.client = None
    
    async def search(self, origin, destination, date, passengers):
        """Search real flights using Amadeus API"""
        if not self.client:
            return self._get_mock_flights()
            
        try:
            response = self.client.shopping.flight_offers_search.get(
                originLocationCode=origin,
                destinationLocationCode=destination,
                departureDate=date,
                adults=passengers,
                max=50
            )
            
            flights = []
            for offer in response.data[:10]:
                flight = self._parse_offer(offer)
                flights.append(flight)
            
            return flights
        except ResponseError as e:
            logger.error(f"Amadeus API Error: {e}")
            return self._get_mock_flights()
    
    def _parse_offer(self, offer):
        """Convert Amadeus response to our internal format"""
        itinerary = offer['itineraries'][0]
        segment = itinerary['segments'][0]
        
        return {
            "flight_number": segment['operating'].get('carrierCode', 'AI') + segment['number'],
            "airline_code": segment['operating'].get('carrierCode', 'AI'),
            "origin": segment['departure']['iataCode'],
            "destination": segment['arrival']['iataCode'],
            "departure_time": segment['departure']['at'],
            "arrival_time": segment['arrival']['at'],
            "price_total": float(offer['price']['total']),
            "available_seats": offer.get('numberOfBookableSeats', 10),
            "aircraft_type": segment['aircraft']['code'] if 'aircraft' in segment else "B787"
        }
        
    def _get_mock_flights(self):
        """Return dummy flights if API is unavailable or for testing"""
        return [
            {
                "flight_number": "AI101",
                "airline_code": "AI",
                "origin": "DEL",
                "destination": "BOM",
                "departure_time": "2026-04-10T10:00:00",
                "arrival_time": "2026-04-10T12:00:00",
                "price_total": 4500.0,
                "available_seats": 20,
                "aircraft_type": "Boeing 787"
            }
        ]
