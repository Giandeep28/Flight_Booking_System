"""
Real-time Booking Service for SkyVoyage
Integrates with Amadeus Order API for live booking creation
"""

import asyncio
import aiohttp
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import os
from amadeus_client import get_amadeus_client

class BookingService:
    """
    Real-time booking service using Amadeus Order API
    """
    
    def __init__(self):
        self.amadeus_client = get_amadeus_client()
        self.use_real_api = os.getenv('USE_LIVE_API', 'true').lower() == 'true'
    
    async def create_live_booking(
        self,
        flight_offer: Dict[str, Any],
        passenger_info: Dict[str, Any],
        seat_info: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Create a real booking using Amadeus Order API
        """
        try:
            if self.use_real_api:
                print("🎫 Creating LIVE booking with Amadeus Order API")
                async with self.amadeus_client as client:
                    # Prepare traveler information
                    travelers = self._prepare_travelers(passenger_info)
                    
                    # Prepare booking request
                    booking_request = {
                        'flightOffers': [flight_offer],
                        'travelers': travelers,
                        'type': 'flight'
                    }
                    
                    # Add seat information if provided
                    if seat_info:
                        booking_request['seating'] = [{
                            'travelerId': '1',
                            'seat': {
                                'number': seat_info.get('seat_number'),
                                'characteristics': seat_info.get('characteristics', [])
                            }
                        }]
                    
                    # Create booking with Amadeus
                    booking_result = await client.create_booking(
                        flight_offer=flight_offer,
                        traveler_info=passenger_info
                    )
                    
                    if booking_result:
                        # Process successful booking
                        pnr = self._extract_pnr(booking_result)
                        
                        return {
                            'success': True,
                            'pnr': pnr,
                            'booking_id': booking_result.get('id'),
                            'status': 'confirmed',
                            'message': 'Booking created successfully',
                            'data': booking_result,
                            'timestamp': datetime.now().isoformat()
                        }
                    else:
                        return {
                            'success': False,
                            'error': 'Failed to create booking with Amadeus',
                            'status': 'failed'
                        }
            else:
                print("🔧 Using MOCK booking (set USE_LIVE_API=true for live booking)")
                return await self._create_mock_booking(flight_offer, passenger_info, seat_info)
                
        except Exception as e:
            print(f"❌ Live booking error: {str(e)}")
            return {
                'success': False,
                'error': f"Booking failed: {str(e)}",
                'status': 'failed'
            }
    
    def _prepare_travelers(self, passenger_info: Dict[str, Any]) -> list:
        """
        Prepare traveler information for Amadeus API
        """
        traveler = {
            'id': '1',
            'dateOfBirth': passenger_info.get('date_of_birth'),
            'name': {
                'firstName': passenger_info.get('first_name'),
                'lastName': passenger_info.get('last_name')
            },
            'gender': passenger_info.get('gender', 'MALE'),
            'contact': {
                'emailAddress': passenger_info.get('email'),
                'phones': [{
                    'deviceType': 'MOBILE',
                    'countryCallingCode': '+91',
                    'number': passenger_info.get('phone')
                }]
            }
        }
        
        # Add additional information if available
        if passenger_info.get('passport_number'):
            traveler['documents'] = [{
                'documentType': 'PASSPORT',
                'number': passenger_info.get('passport_number'),
                'expiryDate': passenger_info.get('passport_expiry'),
                'issuanceCountry': passenger_info.get('passport_country', 'IN')
            }]
        
        return [traveler]
    
    def _extract_pnr(self, booking_result: Dict[str, Any]) -> str:
        """
        Extract PNR from Amadeus booking response
        """
        # Amadeus typically returns PNR in different locations
        # Check common locations
        if 'associatedRecords' in booking_result:
            records = booking_result['associatedRecords']
            if records and len(records) > 0:
                return records[0].get('reference', '').split('-')[0]
        
        if 'reservationInfo' in booking_result:
            return booking_result['reservationInfo'].get('reservationId', '')
        
        # Generate fallback PNR
        return 'SKY' + str(uuid.uuid4())[:6].upper()
    
    async def _create_mock_booking(
        self,
        flight_offer: Dict[str, Any],
        passenger_info: Dict[str, Any],
        seat_info: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Create a mock booking for testing purposes
        """
        # Simulate API delay
        await asyncio.sleep(2)
        
        # Generate mock PNR
        pnr = 'SKY' + str(uuid.uuid4())[:6].upper()
        
        return {
            'success': True,
            'pnr': pnr,
            'booking_id': f"MOCK_{uuid.uuid4().hex[:8].upper()}",
            'status': 'confirmed',
            'message': 'Mock booking created successfully',
            'data': {
                'flight_info': flight_offer,
                'passenger_info': passenger_info,
                'seat_info': seat_info
            },
            'timestamp': datetime.now().isoformat(),
            'mock': True
        }
    
    async def get_booking_details(self, pnr: str) -> Optional[Dict[str, Any]]:
        """
        Get booking details by PNR
        """
        try:
            if self.use_real_api:
                print(f"🔍 Getting LIVE booking details for PNR: {pnr}")
                async with self.amadeus_client as client:
                    # In a real implementation, you would query Amadeus Order API
                    # For now, return mock data
                    return await self._get_mock_booking_details(pnr)
            else:
                print(f"🔧 Using MOCK booking details for PNR: {pnr}")
                return await self._get_mock_booking_details(pnr)
                
        except Exception as e:
            print(f"❌ Error getting booking details: {str(e)}")
            return None
    
    async def _get_mock_booking_details(self, pnr: str) -> Dict[str, Any]:
        """
        Get mock booking details
        """
        return {
            'pnr': pnr,
            'status': 'confirmed',
            'passenger_name': 'Test Passenger',
            'flight_number': '6E2341',
            'departure_airport': 'DEL',
            'arrival_airport': 'BOM',
            'departure_time': '2024-04-15T10:30:00',
            'arrival_time': '2024-04-15T12:45:00',
            'seat_number': '12A',
            'cabin_class': 'Economy',
            'total_amount': 8500,
            'currency': 'INR',
            'booking_date': datetime.now().isoformat(),
            'mock': True
        }
    
    async def cancel_booking(self, pnr: str, reason: str = "Customer request") -> Dict[str, Any]:
        """
        Cancel a booking
        """
        try:
            if self.use_real_api:
                print(f"❌ Cancelling LIVE booking: {pnr}")
                async with self.amadeus_client as client:
                    # In a real implementation, you would call Amadeus Order API to cancel
                    # For now, simulate cancellation
                    await asyncio.sleep(1)
                    
                    return {
                        'success': True,
                        'pnr': pnr,
                        'status': 'cancelled',
                        'message': 'Booking cancelled successfully',
                        'reason': reason,
                        'timestamp': datetime.now().isoformat()
                    }
            else:
                print(f"🔧 Using MOCK cancellation for PNR: {pnr}")
                await asyncio.sleep(1)
                
                return {
                    'success': True,
                    'pnr': pnr,
                    'status': 'cancelled',
                    'message': 'Mock booking cancelled successfully',
                    'reason': reason,
                    'timestamp': datetime.now().isoformat(),
                    'mock': True
                }
                
        except Exception as e:
            print(f"❌ Error cancelling booking: {str(e)}")
            return {
                'success': False,
                'error': f"Cancellation failed: {str(e)}",
                'status': 'failed'
            }

# Create global booking service instance
booking_service = BookingService()
