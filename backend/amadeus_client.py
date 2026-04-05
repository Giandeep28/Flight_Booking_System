"""
Amadeus API Client for SkyVoyage
Real-time flight search and booking integration with Amadeus GDS
"""

import aiohttp
import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import os
from dataclasses import dataclass

@dataclass
class AmadeusConfig:
    client_id: str
    client_secret: str
    base_url: str = "https://test.api.amadeus.com"
    token_url: str = "https://test.api.amadeus.com/v1/security/oauth2/token"
    
class AmadeusClient:
    """
    Real Amadeus API client for live flight data
    """
    
    def __init__(self, config: AmadeusConfig):
        self.config = config
        self.access_token = None
        self.token_expires_at = None
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        await self.get_access_token()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def get_access_token(self):
        """Get OAuth2 access token from Amadeus"""
        # Check if current token is still valid
        if (self.access_token and 
            self.token_expires_at and 
            datetime.now() < self.token_expires_at):
            return self.access_token
        
        print("🔑 Getting new Amadeus access token...")
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'client_credentials',
            'client_id': self.config.client_id,
            'client_secret': self.config.client_secret
        }
        
        try:
            async with self.session.post(
                self.config.token_url,
                headers=headers,
                data=data
            ) as response:
                if response.status == 200:
                    token_data = await response.json()
                    self.access_token = token_data['access_token']
                    # Set expiry time (5 minutes before actual expiry)
                    expires_in = token_data['expires_in'] - 300
                    self.token_expires_at = datetime.now() + timedelta(seconds=expires_in)
                    print(f"✅ Amadeus token obtained, expires at {self.token_expires_at}")
                    return self.access_token
                else:
                    error_text = await response.text()
                    print(f"❌ Failed to get Amadeus token: {error_text}")
                    raise Exception(f"Amadeus auth failed: {response.status}")
        except Exception as e:
            print(f"❌ Amadeus authentication error: {str(e)}")
            raise
    
    async def search_flights(
        self,
        origin: str,
        destination: str,
        departure_date: str,
        adults: int = 1,
        return_date: Optional[str] = None,
        cabin_class: str = "ECONOMY",
        max_results: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Search for flights using Amadeus Flight Offers API
        """
        await self.get_access_token()
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        params = {
            'originLocationCode': origin.upper(),
            'destinationLocationCode': destination.upper(),
            'departureDate': departure_date,
            'adults': adults,
            'currencyCode': 'INR',
            'max': max_results
        }
        
        # Add optional parameters
        if return_date:
            params['returnDate'] = return_date
        if cabin_class.upper() != 'ECONOMY':
            cabin_mapping = {
                'BUSINESS': 'BUSINESS',
                'FIRST': 'FIRST'
            }
            params['travelClass'] = cabin_mapping.get(cabin_class.upper(), 'ECONOMY')
        
        # Add additional search parameters for better results
        params.update({
            'includeAirlines': True,
            'includeRail': False,
            'includeBus': False,
            'nonStop': False,  # Allow connections
            'maxPrice': 200000,  # Max price in INR
            'maxFlightOffers': 5  # Max offers per flight
        })
        
        try:
            print(f"🔍 Searching flights {origin} → {destination} on {departure_date}")
            
            async with self.session.get(
                f"{self.config.base_url}/v2/shopping/flight-offers",
                headers=headers,
                params=params
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    flights = data.get('data', [])
                    
                    print(f"✅ Found {len(flights)} flight offers from Amadeus")
                    
                    # Transform Amadeus data to our format
                    return self._transform_flight_data(flights, origin, destination)
                    
                else:
                    error_text = await response.text()
                    print(f"❌ Amadeus search error: {response.status} - {error_text}")
                    return []
                    
        except Exception as e:
            print(f"❌ Amadeus search failed: {str(e)}")
            return []
    
    def _transform_flight_data(self, amadeus_flights: List[Dict], origin: str, destination: str) -> List[Dict[str, Any]]:
        """
        Transform Amadeus flight data to SkyVoyage format
        """
        transformed_flights = []
        
        for flight_offer in amadeus_flights:
            try:
                # Extract basic flight information
                itineraries = flight_offer.get('itineraries', [])
                if not itineraries:
                    continue
                
                itinerary = itineraries[0]
                segments = itinerary.get('segments', [])
                if not segments:
                    continue
                
                # Get first and last segments for overall flight info
                first_segment = segments[0]
                last_segment = segments[-1]
                
                # Calculate total duration
                duration = itinerary.get('duration', '')
                duration_hours = int(duration.split('PT')[1].split('H')[0]) if 'H' in duration else 0
                duration_minutes = int(duration.split('H')[1].split('M')[0]) if 'M' in duration.split('H')[-1] else 0
                
                # Extract airline information
                carrier_code = first_segment.get('carrierCode', '')
                flight_number = first_segment.get('number', '')
                
                # Get price information
                price_info = flight_offer.get('price', {})
                total_price = float(price_info.get('total', 0))
                currency = price_info.get('currency', 'INR')
                
                # Determine number of stops
                stops = len(segments) - 1
                
                # Create transformed flight object
                transformed_flight = {
                    'id': f"AM{flight_offer.get('id', '')[:8].upper()}",
                    'airline_name': self._get_airline_name(carrier_code),
                    'airline_code': carrier_code,
                    'airline_logo': f"https://www.gstatic.com/flights/airline_logos/70px/{carrier_code}.png",
                    'flight_number': f"{carrier_code}{flight_number}",
                    
                    # Airport information
                    'departure_airport': {
                        'code': first_segment.get('departure', {}).get('iataCode', origin),
                        'name': self._get_airport_name(first_segment.get('departure', {}).get('iataCode', origin)),
                        'city': self._get_airport_city(first_segment.get('departure', {}).get('iataCode', origin)),
                        'country': 'India' if len(first_segment.get('departure', {}).get('iataCode', origin)) == 3 else 'International'
                    },
                    'arrival_airport': {
                        'code': last_segment.get('arrival', {}).get('iataCode', destination),
                        'name': self._get_airport_name(last_segment.get('arrival', {}).get('iataCode', destination)),
                        'city': self._get_airport_city(last_segment.get('arrival', {}).get('iataCode', destination)),
                        'country': 'India' if len(last_segment.get('arrival', {}).get('iataCode', destination)) == 3 else 'International'
                    },
                    
                    # Timing
                    'departure_time': self._parse_amadeus_datetime(first_segment.get('departure', {}).get('at')),
                    'arrival_time': self._parse_amadeus_datetime(last_segment.get('arrival', {}).get('at')),
                    'duration': f"{duration_hours}h {duration_minutes}m",
                    
                    # Flight details
                    'stops': stops,
                    'layovers': self._get_layovers(segments) if stops > 0 else [],
                    'price': total_price,
                    'currency': currency,
                    'cabin_class': self._get_cabin_class(flight_offer),
                    'baggage_info': '20kg',  # Default, can be enhanced
                    'amenities': self._get_amenities(carrier_code),
                    'status': 'scheduled',
                    'aircraft': first_segment.get('aircraft', {}).get('code', 'Unknown'),
                    
                    # Additional data
                    'source': 'amadeus',
                    'offer_id': flight_offer.get('id'),
                    'raw_data': flight_offer  # Keep raw data for booking
                }
                
                transformed_flights.append(transformed_flight)
                
            except Exception as e:
                print(f"⚠️ Error transforming flight: {str(e)}")
                continue
        
        return transformed_flights
    
    def _get_airline_name(self, code: str) -> str:
        """Get airline name from IATA code"""
        airlines = {
            '6E': 'IndiGo',
            'UK': 'Vistara',
            'AI': 'Air India',
            'SG': 'SpiceJet',
            'IX': 'Air India Express',
            'G8': 'GoAir',
            'I5': 'AirAsia India',
            'E5': 'AirAsia India',
            'EK': 'Emirates',
            'QR': 'Qatar Airways',
            'SQ': 'Singapore Airlines',
            'BA': 'British Airways',
            'LH': 'Lufthansa',
            'AF': 'Air France',
            'KL': 'KLM',
            'EY': 'Etihad Airways',
            'TK': 'Turkish Airlines'
        }
        return airlines.get(code.upper(), f'{code} Airlines')
    
    def _get_airport_name(self, code: str) -> str:
        """Get airport name from IATA code"""
        airports = {
            'DEL': 'Indira Gandhi International Airport',
            'BOM': 'Chhatrapati Shivaji Maharaj International Airport',
            'BLR': 'Kempegowda International Airport',
            'HYD': 'Rajiv Gandhi International Airport',
            'MAA': 'Chennai International Airport',
            'CCU': 'Netaji Subhas Chandra Bose International Airport',
            'PNQ': 'Pune Airport',
            'AMD': 'Sardar Vallabhbhai Patel International Airport',
            'COK': 'Cochin International Airport',
            'GOI': 'Dabolim Airport',
            'JFK': 'John F. Kennedy International Airport',
            'LHR': 'Heathrow Airport',
            'DXB': 'Dubai International Airport',
            'SIN': 'Changi Airport',
            'CDG': 'Charles de Gaulle Airport',
            'NRT': 'Narita International Airport'
        }
        return airports.get(code.upper(), f'{code} Airport')
    
    def _get_airport_city(self, code: str) -> str:
        """Get airport city from IATA code"""
        cities = {
            'DEL': 'Delhi',
            'BOM': 'Mumbai',
            'BLR': 'Bengaluru',
            'HYD': 'Hyderabad',
            'MAA': 'Chennai',
            'CCU': 'Kolkata',
            'PNQ': 'Pune',
            'AMD': 'Ahmedabad',
            'COK': 'Kochi',
            'GOI': 'Goa',
            'JFK': 'New York',
            'LHR': 'London',
            'DXB': 'Dubai',
            'SIN': 'Singapore',
            'CDG': 'Paris',
            'NRT': 'Tokyo'
        }
        return cities.get(code.upper(), code)
    
    def _parse_amadeus_datetime(self, datetime_str: str) -> datetime:
        """Parse Amadeus datetime format"""
        try:
            # Amadeus format: 2024-04-15T10:30:00
            return datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
        except:
            return datetime.now()
    
    def _get_cabin_class(self, flight_offer: Dict) -> str:
        """Extract cabin class from flight offer"""
        traveler_pricings = flight_offer.get('travelerPricings', [])
        if traveler_pricings:
            fare_details = traveler_pricings[0].get('fareDetailsBySegment', [])
            if fare_details:
                cabin = fare_details[0].get('cabin', 'ECONOMY')
                return cabin
        return 'ECONOMY'
    
    def _get_layovers(self, segments: List[Dict]) -> List[Dict]:
        """Extract layover information"""
        layovers = []
        for i in range(len(segments) - 1):
            arrival = segments[i].get('arrival', {})
            departure = segments[i + 1].get('departure', {})
            
            layover = {
                'airport': arrival.get('iataCode', ''),
                'duration': self._calculate_layover_duration(arrival.get('at'), departure.get('at')),
                'aircraft_change': segments[i].get('aircraft', {}).get('code') != segments[i + 1].get('aircraft', {}).get('code')
            }
            layovers.append(layover)
        
        return layovers
    
    def _calculate_layover_duration(self, arrival_time: str, departure_time: str) -> str:
        """Calculate layover duration between arrival and departure"""
        try:
            arrival_dt = datetime.fromisoformat(arrival_time.replace('Z', '+00:00'))
            departure_dt = datetime.fromisoformat(departure_time.replace('Z', '+00:00'))
            duration = departure_dt - arrival_dt
            
            hours = duration.seconds // 3600
            minutes = (duration.seconds % 3600) // 60
            
            return f"{hours}h {minutes}m"
        except:
            return "0h 0m"
    
    def _get_amenities(self, airline_code: str) -> List[Dict[str, str]]:
        """Get typical amenities for airline"""
        base_amenities = [
            {"name": "WiFi", "icon": "wifi"},
            {"name": "USB Charging", "icon": "bolt"}
        ]
        
        # Add meal service for most airlines
        if airline_code.upper() in ['6E', 'UK', 'AI', 'EK', 'QR', 'SQ']:
            base_amenities.append({"name": "Meal", "icon": "utensils"})
        
        return base_amenities
    
    async def get_flight_details(self, offer_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed flight information by offer ID"""
        await self.get_access_token()
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        try:
            async with self.session.get(
                f"{self.config.base_url}/v2/shopping/flight-offers/{offer_id}",
                headers=headers
            ) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    return None
        except Exception as e:
            print(f"❌ Error getting flight details: {str(e)}")
            return None
    
    async def create_booking(self, flight_offer: Dict, traveler_info: Dict) -> Optional[Dict[str, Any]]:
        """
        Create flight booking using Amadeus Order API
        """
        await self.get_access_token()
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        # Prepare booking request
        booking_data = {
            'flightOffers': [flight_offer],
            'travelers': [{
                'id': '1',
                'dateOfBirth': traveler_info.get('date_of_birth'),
                'name': {
                    'firstName': traveler_info.get('first_name'),
                    'lastName': traveler_info.get('last_name')
                },
                'gender': traveler_info.get('gender', 'MALE'),
                'contact': {
                    'emailAddress': traveler_info.get('email'),
                    'phones': [{
                        'deviceType': 'MOBILE',
                        'countryCallingCode': '+91',
                        'number': traveler_info.get('phone')
                    }]
                }
            }],
            'type': 'flight'
        }
        
        try:
            print(f"📝 Creating booking with Amadeus...")
            
            async with self.session.post(
                f"{self.config.base_url}/v1/booking/flight-orders",
                headers=headers,
                json=booking_data
            ) as response:
                
                if response.status == 200:
                    booking_data = await response.json()
                    print(f"✅ Booking created successfully")
                    return booking_data
                else:
                    error_text = await response.text()
                    print(f"❌ Booking failed: {response.status} - {error_text}")
                    return None
                    
        except Exception as e:
            print(f"❌ Booking creation error: {str(e)}")
            return None

# Create global Amadeus client instance
def get_amadeus_client() -> AmadeusClient:
    """Get configured Amadeus client"""
    config = AmadeusConfig(
        client_id=os.getenv('AMADEUS_CLIENT_ID', 'YOUR_AMADEUS_CLIENT_ID'),
        client_secret=os.getenv('AMADEUS_CLIENT_SECRET', 'YOUR_AMADEUS_CLIENT_SECRET')
    )
    return AmadeusClient(config)
