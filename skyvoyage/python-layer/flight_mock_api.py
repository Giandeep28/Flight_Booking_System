"""
Flight Mock API - Realistic flight data generator
Ported from production-flight-system.js route database
"""
import random
import math
from datetime import datetime, timedelta

# ── Airline Database ────────────────────────────────────────────
AIRLINE_DB = {
    "AI": {"name": "Air India", "type": "full-service"},
    "6E": {"name": "IndiGo", "type": "low-cost"},
    "SG": {"name": "SpiceJet", "type": "low-cost"},
    "IX": {"name": "Air India Express", "type": "low-cost"},
    "QP": {"name": "Akasa Air", "type": "low-cost"},
    "UK": {"name": "Vistara", "type": "full-service"},
    "EK": {"name": "Emirates", "type": "premium"},
    "QR": {"name": "Qatar Airways", "type": "premium"},
    "SQ": {"name": "Singapore Airlines", "type": "premium"},
    "BA": {"name": "British Airways", "type": "premium"},
    "LH": {"name": "Lufthansa", "type": "premium"},
    "TK": {"name": "Turkish Airlines", "type": "full-service"},
    "EY": {"name": "Etihad Airways", "type": "premium"},
    "DL": {"name": "Delta Air Lines", "type": "premium"},
    "AA": {"name": "American Airlines", "type": "premium"},
    "FZ": {"name": "Flydubai", "type": "low-cost"},
    "VS": {"name": "Virgin Atlantic", "type": "premium"},
    "CX": {"name": "Cathay Pacific", "type": "premium"},
}

# ── Route Database (from production-flight-system.js) ───────────
ROUTE_DATABASE = {
    "DEL-BOM": [
        {"airline": "AI", "flight_number": "647", "time": "06:30", "duration_mins": 135, "base_price": 4500, "aircraft": "Airbus A320neo"},
        {"airline": "6E", "flight_number": "2174", "time": "08:15", "duration_mins": 150, "base_price": 3800, "aircraft": "Airbus A320"},
        {"airline": "SG", "flight_number": "815", "time": "10:00", "duration_mins": 135, "base_price": 3200, "aircraft": "Boeing 737-800"},
        {"airline": "UK", "flight_number": "803", "time": "12:30", "duration_mins": 135, "base_price": 5200, "aircraft": "Airbus A321neo"},
        {"airline": "IX", "flight_number": "1348", "time": "15:45", "duration_mins": 135, "base_price": 2800, "aircraft": "Boeing 737-800"},
        {"airline": "QP", "flight_number": "1152", "time": "18:00", "duration_mins": 135, "base_price": 2500, "aircraft": "Boeing 737 MAX"},
        {"airline": "6E", "flight_number": "524", "time": "20:30", "duration_mins": 150, "base_price": 4200, "aircraft": "Airbus A321neo"},
    ],
    "DEL-BLR": [
        {"airline": "AI", "flight_number": "507", "time": "06:00", "duration_mins": 165, "base_price": 4800, "aircraft": "Airbus A321"},
        {"airline": "6E", "flight_number": "524", "time": "08:30", "duration_mins": 155, "base_price": 4200, "aircraft": "Airbus A321neo"},
        {"airline": "SG", "flight_number": "372", "time": "11:00", "duration_mins": 160, "base_price": 3500, "aircraft": "Boeing 737-900"},
        {"airline": "UK", "flight_number": "881", "time": "14:15", "duration_mins": 165, "base_price": 5500, "aircraft": "Airbus A320neo"},
        {"airline": "QP", "flight_number": "142", "time": "17:30", "duration_mins": 155, "base_price": 3000, "aircraft": "Boeing 737 MAX"},
        {"airline": "IX", "flight_number": "814", "time": "20:00", "duration_mins": 165, "base_price": 3200, "aircraft": "Boeing 737-800"},
    ],
    "BOM-HYD": [
        {"airline": "AI", "flight_number": "629", "time": "07:15", "duration_mins": 90, "base_price": 3200, "aircraft": "Airbus A319"},
        {"airline": "6E", "flight_number": "617", "time": "09:45", "duration_mins": 85, "base_price": 2800, "aircraft": "Airbus A320"},
        {"airline": "SG", "flight_number": "301", "time": "12:00", "duration_mins": 90, "base_price": 2400, "aircraft": "Boeing 737-700"},
        {"airline": "UK", "flight_number": "823", "time": "15:30", "duration_mins": 90, "base_price": 3500, "aircraft": "Airbus A320neo"},
        {"airline": "QP", "flight_number": "201", "time": "18:45", "duration_mins": 85, "base_price": 2200, "aircraft": "Boeing 737 MAX"},
    ],
    "DEL-DXB": [
        {"airline": "EK", "flight_number": "514", "time": "03:45", "duration_mins": 210, "base_price": 15000, "aircraft": "Boeing 777-300ER"},
        {"airline": "AI", "flight_number": "947", "time": "07:30", "duration_mins": 225, "base_price": 12000, "aircraft": "Boeing 787-8"},
        {"airline": "6E", "flight_number": "1415", "time": "10:15", "duration_mins": 210, "base_price": 8500, "aircraft": "Airbus A321neo"},
        {"airline": "SG", "flight_number": "11", "time": "13:30", "duration_mins": 225, "base_price": 7500, "aircraft": "Boeing 737-800"},
        {"airline": "FZ", "flight_number": "433", "time": "16:45", "duration_mins": 210, "base_price": 7000, "aircraft": "Boeing 737-800"},
    ],
    "BOM-LHR": [
        {"airline": "AI", "flight_number": "131", "time": "01:15", "duration_mins": 570, "base_price": 45000, "aircraft": "Boeing 777-300ER"},
        {"airline": "BA", "flight_number": "138", "time": "04:30", "duration_mins": 555, "base_price": 48000, "aircraft": "Boeing 777-200"},
        {"airline": "VS", "flight_number": "324", "time": "10:45", "duration_mins": 570, "base_price": 42000, "aircraft": "Boeing 787-9"},
        {"airline": "AI", "flight_number": "169", "time": "13:30", "duration_mins": 570, "base_price": 43000, "aircraft": "Boeing 787-8"},
    ],
    "DEL-SIN": [
        {"airline": "SQ", "flight_number": "403", "time": "00:30", "duration_mins": 345, "base_price": 28000, "aircraft": "Airbus A350-900"},
        {"airline": "AI", "flight_number": "382", "time": "07:00", "duration_mins": 330, "base_price": 22000, "aircraft": "Boeing 787-8"},
        {"airline": "6E", "flight_number": "52", "time": "10:15", "duration_mins": 345, "base_price": 15000, "aircraft": "Airbus A321neo"},
        {"airline": "SQ", "flight_number": "441", "time": "21:45", "duration_mins": 345, "base_price": 29000, "aircraft": "Boeing 777-300ER"},
    ],
    "DEL-MAA": [
        {"airline": "AI", "flight_number": "439", "time": "06:15", "duration_mins": 170, "base_price": 4600, "aircraft": "Airbus A320"},
        {"airline": "6E", "flight_number": "281", "time": "09:00", "duration_mins": 165, "base_price": 3900, "aircraft": "Airbus A320neo"},
        {"airline": "SG", "flight_number": "155", "time": "13:00", "duration_mins": 175, "base_price": 3400, "aircraft": "Boeing 737-800"},
        {"airline": "UK", "flight_number": "829", "time": "17:30", "duration_mins": 170, "base_price": 5300, "aircraft": "Airbus A321neo"},
    ],
    "BLR-HYD": [
        {"airline": "6E", "flight_number": "234", "time": "07:00", "duration_mins": 75, "base_price": 2800, "aircraft": "Airbus A320"},
        {"airline": "AI", "flight_number": "501", "time": "10:30", "duration_mins": 80, "base_price": 3500, "aircraft": "Airbus A319"},
        {"airline": "SG", "flight_number": "411", "time": "14:00", "duration_mins": 75, "base_price": 2400, "aircraft": "Boeing 737-700"},
        {"airline": "QP", "flight_number": "301", "time": "18:00", "duration_mins": 80, "base_price": 2100, "aircraft": "Boeing 737 MAX"},
    ],
    "CCU-DEL": [
        {"airline": "AI", "flight_number": "401", "time": "06:00", "duration_mins": 140, "base_price": 4200, "aircraft": "Airbus A320"},
        {"airline": "6E", "flight_number": "176", "time": "09:30", "duration_mins": 135, "base_price": 3600, "aircraft": "Airbus A320neo"},
        {"airline": "SG", "flight_number": "208", "time": "14:00", "duration_mins": 140, "base_price": 3000, "aircraft": "Boeing 737-800"},
        {"airline": "QP", "flight_number": "121", "time": "19:00", "duration_mins": 135, "base_price": 2700, "aircraft": "Boeing 737 MAX"},
    ],
    "BOM-GOI": [
        {"airline": "6E", "flight_number": "377", "time": "08:00", "duration_mins": 70, "base_price": 2500, "aircraft": "Airbus A320"},
        {"airline": "AI", "flight_number": "681", "time": "11:30", "duration_mins": 75, "base_price": 3200, "aircraft": "Airbus A319"},
        {"airline": "SG", "flight_number": "501", "time": "15:00", "duration_mins": 70, "base_price": 2200, "aircraft": "Boeing 737-700"},
        {"airline": "QP", "flight_number": "251", "time": "19:30", "duration_mins": 75, "base_price": 1900, "aircraft": "Boeing 737 MAX"},
    ],
}

# ── Airport coordinates for distance estimation ─────────────────
AIRPORT_COORDS = {
    "DEL": (28.5562, 77.1000), "BOM": (19.0896, 72.8656), "BLR": (13.1979, 77.7063),
    "HYD": (17.2403, 78.4294), "MAA": (12.9941, 80.1709), "CCU": (22.6520, 88.4463),
    "COK": (10.1520, 76.4019), "GOI": (15.3808, 73.8314), "AMD": (23.0225, 72.5714),
    "PNQ": (18.5822, 73.9197), "JAI": (26.8242, 75.8122), "LKO": (26.7606, 80.8893),
    "DXB": (25.2532, 55.3657), "LHR": (51.4700, -0.4543), "SIN": (1.3644, 103.9915),
    "JFK": (40.6413, -73.7781), "HKG": (22.3080, 113.9185), "NRT": (35.7647, 140.3864),
    "BKK": (13.6900, 100.7501), "DOH": (25.2731, 51.6081), "AUH": (24.4330, 54.6511),
}


def _haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))


def _format_duration(mins):
    return f"{mins // 60}h {mins % 60}m"


def _arrival_time(dep_time_str, duration_mins):
    h, m = map(int, dep_time_str.split(":"))
    total = h * 60 + m + duration_mins
    arr_h = (total // 60) % 24
    arr_m = total % 60
    return f"{arr_h:02d}:{arr_m:02d}"


def _adjust_price(base_price, date_str):
    """Adjust price based on booking date proximity"""
    try:
        travel = datetime.strptime(date_str, "%Y-%m-%d")
        days_until = (travel - datetime.now()).days
        if days_until < 3:
            return int(base_price * 1.45)
        elif days_until < 7:
            return int(base_price * 1.30)
        elif days_until < 14:
            return int(base_price * 1.15)
        elif days_until < 30:
            return int(base_price * 1.05)
        elif days_until > 90:
            return int(base_price * 0.85)
        return base_price
    except:
        return base_price


def _generate_generic_flights(from_code, to_code, date_str):
    """Generate flights for routes not in the route database"""
    airlines = [
        ("AI", "Airbus A320neo"), ("6E", "Airbus A320"),
        ("SG", "Boeing 737-800"), ("UK", "Airbus A321neo"),
        ("QP", "Boeing 737 MAX"),
    ]
    
    # Estimate distance and duration
    c1 = AIRPORT_COORDS.get(from_code, (20, 80))
    c2 = AIRPORT_COORDS.get(to_code, (25, 75))
    distance = _haversine(c1[0], c1[1], c2[0], c2[1])
    duration_mins = max(60, int(distance / 14))  # ~840 km/h avg
    
    # Estimate price per km
    price_per_km = {"AI": 6, "6E": 4, "SG": 3.5, "UK": 7, "QP": 2.5, "EK": 12, "SQ": 14}
    
    flights = []
    for i, (code, aircraft) in enumerate(airlines):
        base_hour = 6 + i * 3
        base_price = int(distance * price_per_km.get(code, 5))
        flights.append({
            "airline": code,
            "flight_number": str(random.randint(100, 999)),
            "time": f"{base_hour:02d}:{random.choice(['00','15','30','45'])}",
            "duration_mins": duration_mins + random.randint(-10, 10),
            "base_price": max(1500, base_price),
            "aircraft": aircraft,
        })
    return flights


def generate_flights(from_code: str, to_code: str, date_str: str, passengers: int = 1):
    """Main flight generation function"""
    route_key = f"{from_code}-{to_code}"
    reverse_key = f"{to_code}-{from_code}"
    
    route_data = ROUTE_DATABASE.get(route_key)
    if not route_data:
        route_data = ROUTE_DATABASE.get(reverse_key)
    if not route_data:
        route_data = _generate_generic_flights(from_code, to_code, date_str)
    
    flights = []
    for flight in route_data:
        airline_code = flight["airline"]
        airline_info = AIRLINE_DB.get(airline_code, {"name": airline_code, "type": "unknown"})
        adjusted_price = _adjust_price(flight["base_price"], date_str)
        
        # Add slight randomness (±3%)
        adjusted_price = int(adjusted_price * random.uniform(0.97, 1.03))
        taxes = int(adjusted_price * 0.18)
        
        flights.append({
            "id": f"{airline_code}-{flight['flight_number']}",
            "airline": airline_info["name"],
            "airlineCode": airline_code,
            "flightNumber": f"{airline_code}-{flight['flight_number']}",
            "departure": {
                "airport": from_code,
                "city": from_code,
                "time": flight["time"],
                "terminal": "3" if airline_code in ["AI", "UK"] else "2" if airline_code == "6E" else "1",
            },
            "arrival": {
                "airport": to_code,
                "city": to_code,
                "time": _arrival_time(flight["time"], flight["duration_mins"]),
                "terminal": "1",
            },
            "duration": _format_duration(flight["duration_mins"]),
            "durationMins": flight["duration_mins"],
            "stops": 0,
            "aircraft": flight["aircraft"],
            "baseFare": adjusted_price,
            "taxes": taxes,
            "price": (adjusted_price + taxes) * passengers,
            "currency": "INR",
            "seatsAvailable": random.randint(3, 42),
            "refundable": airline_info["type"] != "low-cost",
            "airlineType": airline_info["type"],
            "logoUrl": f"https://content.airhex.com/content/logos/airlines_{airline_code}_350_100_r.png",
        })
    
    return flights
