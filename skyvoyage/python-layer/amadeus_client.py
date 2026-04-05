"""
Amadeus Self-Service API Client
Handles OAuth2 authentication and Flight Offers Search
Falls back to mock data on any failure
"""
import httpx
import os
import time
from typing import Optional

AMADEUS_BASE_URL = "https://test.api.amadeus.com"
_token_cache = {"access_token": None, "expires_at": 0}


async def _get_token() -> Optional[str]:
    """Get OAuth2 access token from Amadeus"""
    api_key = os.getenv("AMADEUS_API_KEY", "")
    api_secret = os.getenv("AMADEUS_API_SECRET", "")
    
    if not api_key or not api_secret:
        return None
    
    # Check cached token
    if _token_cache["access_token"] and time.time() < _token_cache["expires_at"]:
        return _token_cache["access_token"]
    
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                f"{AMADEUS_BASE_URL}/v1/security/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": api_key,
                    "client_secret": api_secret,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if resp.status_code == 200:
                data = resp.json()
                _token_cache["access_token"] = data["access_token"]
                _token_cache["expires_at"] = time.time() + data.get("expires_in", 1799) - 60
                return data["access_token"]
    except Exception as e:
        print(f"[Amadeus] Token error: {e}")
    return None


async def search_flights(origin: str, destination: str, date: str, adults: int = 1):
    """
    Search flights via Amadeus Flight Offers Search API
    Returns list of normalized flight objects or None on failure
    """
    token = await _get_token()
    if not token:
        return None
    
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{AMADEUS_BASE_URL}/v2/shopping/flight-offers",
                params={
                    "originLocationCode": origin,
                    "destinationLocationCode": destination,
                    "departureDate": date,
                    "adults": adults,
                    "max": 10,
                    "currencyCode": "INR",
                },
                headers={"Authorization": f"Bearer {token}"},
            )
            
            if resp.status_code == 200:
                data = resp.json()
                return _normalize_amadeus_results(data.get("data", []))
            else:
                print(f"[Amadeus] Search error: {resp.status_code}")
    except Exception as e:
        print(f"[Amadeus] Request failed: {e}")
    
    return None


def _normalize_amadeus_results(offers):
    """Transform Amadeus API response into our standard flight format"""
    flights = []
    for offer in offers:
        try:
            itinerary = offer["itineraries"][0]
            segments = itinerary["segments"]
            first_seg = segments[0]
            last_seg = segments[-1]
            
            airline_code = first_seg["carrierCode"]
            flight_num = first_seg["number"]
            
            dep_time = first_seg["departure"]["at"].split("T")[1][:5]
            arr_time = last_seg["arrival"]["at"].split("T")[1][:5]
            
            # Calculate duration
            duration_str = itinerary.get("duration", "PT2H30M")
            hours = int(duration_str.split("H")[0].replace("PT", "")) if "H" in duration_str else 0
            mins_part = duration_str.split("H")[1] if "H" in duration_str else duration_str.replace("PT", "")
            mins = int(mins_part.replace("M", "")) if mins_part.replace("M", "") else 0
            
            price = float(offer["price"]["total"])
            
            flights.append({
                "id": f"{airline_code}-{flight_num}",
                "airline": airline_code,
                "airlineCode": airline_code,
                "flightNumber": f"{airline_code}-{flight_num}",
                "departure": {
                    "airport": first_seg["departure"]["iataCode"],
                    "city": first_seg["departure"]["iataCode"],
                    "time": dep_time,
                    "terminal": first_seg["departure"].get("terminal", "1"),
                },
                "arrival": {
                    "airport": last_seg["arrival"]["iataCode"],
                    "city": last_seg["arrival"]["iataCode"],
                    "time": arr_time,
                    "terminal": last_seg["arrival"].get("terminal", "1"),
                },
                "duration": f"{hours}h {mins}m",
                "durationMins": hours * 60 + mins,
                "stops": len(segments) - 1,
                "aircraft": first_seg.get("aircraft", {}).get("code", "320"),
                "baseFare": int(price * 0.85),
                "taxes": int(price * 0.15),
                "price": int(price),
                "currency": offer["price"].get("currency", "INR"),
                "seatsAvailable": offer.get("numberOfBookableSeats", 9),
                "refundable": not offer.get("pricingOptions", {}).get("fareType", [""])[0].startswith("PUBLISHED"),
                "airlineType": "unknown",
                "logoUrl": f"https://content.airhex.com/content/logos/airlines_{airline_code}_350_100_r.png",
                "source": "amadeus",
            })
        except Exception as e:
            print(f"[Amadeus] Parse error for offer: {e}")
            continue
    
    return flights
