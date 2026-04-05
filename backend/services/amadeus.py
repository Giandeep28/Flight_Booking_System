import httpx
import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
from config import settings
import redis

logger = logging.getLogger(__name__)

class AmadeusService:
    def __init__(self):
        self.client_id = settings.amadeus_api_key
        self.client_secret = settings.amadeus_api_secret
        self.base_url = "https://test.api.amadeus.com/v1"
        self.auth_url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        self._access_token = None
        self._token_expires_at = 0
        
        # Redis setup for caching
        try:
            self.redis = redis.Redis(
                host=getattr(settings, 'redis_host', 'localhost'),
                port=getattr(settings, 'redis_port', 6379),
                db=0,
                decode_responses=True
            )
            self.redis.ping()
            logger.info("Redis cache connected for AmadeusService")
        except Exception as e:
            logger.warning(f"Redis connection failed, continuing without cache: {e}")
            self.redis = None

    async def _get_access_token(self) -> Optional[str]:
        """Fetch or return cached OAuth2 token."""
        if self._access_token and datetime.now().timestamp() < self._token_expires_at:
            return self._access_token

        if not self.client_id or not self.client_secret:
            logger.warning("Amadeus credentials missing. Falling back to Mock service.")
            return None

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.auth_url,
                    data={
                        "grant_type": "client_credentials",
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                    },
                )
                response.raise_for_status()
                data = response.json()
                self._access_token = data["access_token"]
                self._token_expires_at = datetime.now().timestamp() + data["expires_in"] - 60
                return self._access_token
        except Exception as e:
            logger.error(f"Failed to fetch Amadeus access token: {e}")
            return None

    async def search_flights(self, origin: str, destination: str, date: str, adults: int = 1) -> List[Dict[str, Any]]:
        """Search for flight offers with integrated Redis caching."""
        cache_key = f"flights:{origin}:{destination}:{date}:{adults}"
        
        # Try cache first
        if self.redis:
            try:
                cached_data = self.redis.get(cache_key)
                if cached_data:
                    logger.info(f"Returning cached flight data for {cache_key}")
                    return json.loads(cached_data)
            except Exception as e:
                logger.error(f"Redis cache read failed: {e}")

        token = await self._get_access_token()
        
        if not token:
            mock_data = self._get_mock_flights(origin, destination, date)
            self._save_to_cache(cache_key, mock_data, 1800) # Cache mocks for 30m
            return mock_data

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://test.api.amadeus.com/v2/shopping/flight-offers",
                    params={
                        "originLocationCode": origin,
                        "destinationLocationCode": destination,
                        "departureDate": date,
                        "adults": adults,
                        "currencyCode": "INR",
                        "max": 10
                    },
                    headers={"Authorization": f"Bearer {token}"}
                )
                response.raise_for_status()
                data = response.json()
                parsed_results = self._parse_amadeus_response(data)
                
                # Cache successful results for 15 minutes
                self._save_to_cache(cache_key, parsed_results, 900)
                
                return parsed_results
        except Exception as e:
            logger.error(f"Amadeus flight search failed: {e}")
            return self._get_mock_flights(origin, destination, date)

    def _save_to_cache(self, key: str, data: Any, ttl: int):
        """Helper to save JSON data to Redis."""
        if self.redis:
            try:
                self.redis.setex(key, ttl, json.dumps(data))
            except Exception as e:
                logger.error(f"Redis cache write failed: {e}")

    def _parse_amadeus_response(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Map Amadeus API response to SkyVoyage internal schema."""
        results = []
        for offer in data.get("data", []):
            itinerary = offer["itineraries"][0]
            segment = itinerary["segments"][0]
            results.append({
                "id": offer.get("id", str(hash(json.dumps(offer)))),
                "airline": {"name": "Airline", "code": segment["carrierCode"]},
                "from": segment["departure"]["iataCode"],
                "to": segment["arrival"]["iataCode"],
                "departure_time": segment["departure"]["at"],
                "arrival_time": segment["arrival"]["at"],
                "duration": itinerary["duration"].replace("PT", "").lower(),
                "price": float(offer["price"]["grandTotal"]),
                "currency": offer["price"]["currency"],
                "stops": len(itinerary["segments"]) - 1
            })
        return results

    def _get_mock_flights(self, origin: str, destination: str, date: str) -> List[Dict[str, Any]]:
        """Fallback mock data generator for development."""
        return [
            {
                "id": f"mock-{i}",
                "airline": {"name": name, "code": code},
                "from": origin,
                "to": destination,
                "departure_time": f"{date}T{time}",
                "arrival_time": f"{date}T{arr}",
                "duration": dur,
                "price": price,
                "currency": "INR",
                "stops": stops
            }
            for i, (name, code, time, arr, dur, price, stops) in enumerate([
                ("IndiGo", "6E", "06:00:00", "08:10:00", "2h 10m", 4500, 0),
                ("Air India", "AI", "08:15:00", "10:40:00", "2h 25m", 5200, 0),
                ("Vistara", "UK", "10:30:00", "15:15:00", "4h 45m", 7800, 1)
            ])
        ]

amadeus_service = AmadeusService()
