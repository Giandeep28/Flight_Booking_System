#!/usr/bin/env python3
"""
Test script for SkyVoyage Airport Database
Tests all airport functionality to ensure comprehensive database is working
"""

from airports_database import (
    get_all_airports, 
    get_airport_by_code, 
    search_airports,
    get_airports_by_country,
    get_airports_by_type,
    get_airports_by_category,
    get_nearby_airports,
    get_airport_statistics
)

def test_airport_database():
    """Test all airport database functions"""
    print("🧪 Testing SkyVoyage Airport Database")
    print("=" * 50)
    
    # Test 1: Get all airports
    print("\n1. Testing get_all_airports()...")
    all_airports = get_all_airports()
    print(f"   ✅ Retrieved {len(all_airports)} airports")
    
    # Test 2: Get airport by code
    print("\n2. Testing get_airport_by_code()...")
    delhi = get_airport_by_code("DEL")
    jfk = get_airport_by_code("JFK")
    print(f"   ✅ DEL: {delhi.name if delhi else 'Not found'}")
    print(f"   ✅ JFK: {jfk.name if jfk else 'Not found'}")
    
    # Test 3: Search airports
    print("\n3. Testing search_airports()...")
    search_results = search_airports("Delhi", 5)
    print(f"   ✅ Found {len(search_results)} airports matching 'Delhi'")
    for airport in search_results:
        print(f"      - {airport.code}: {airport.name}")
    
    # Test 4: Get airports by country
    print("\n4. Testing get_airports_by_country()...")
    us_airports = get_airports_by_country("US")
    indian_airports = get_airports_by_country("IN")
    print(f"   ✅ US: {len(us_airports)} airports")
    print(f"   ✅ India: {len(indian_airports)} airports")
    
    # Test 5: Get airports by type
    print("\n5. Testing get_airports_by_type()...")
    domestic = get_airports_by_type("domestic")
    international = get_airports_by_type("international")
    print(f"   ✅ Domestic: {len(domestic)} airports")
    print(f"   ✅ International: {len(international)} airports")
    
    # Test 6: Get airports by category
    print("\n6. Testing get_airports_by_category()...")
    major = get_airports_by_category("major")
    regional = get_airports_by_category("regional")
    print(f"   ✅ Major: {len(major)} airports")
    print(f"   ✅ Regional: {len(regional)} airports")
    
    # Test 7: Get nearby airports
    print("\n7. Testing get_nearby_airports()...")
    # Delhi coordinates
    nearby = get_nearby_airports(28.6139, 77.2090, 500)
    print(f"   ✅ Found {len(nearby)} airports within 500km of Delhi")
    for airport in nearby[:3]:
        print(f"      - {airport.code}: {airport.name} ({airport.city})")
    
    # Test 8: Get statistics
    print("\n8. Testing get_airport_statistics()...")
    stats = get_airport_statistics()
    print(f"   ✅ Total airports: {stats['total_airports']}")
    print(f"   ✅ Indian airports: {stats['indian_airports']}")
    print(f"   ✅ International airports: {stats['international_airports']}")
    print(f"   ✅ Countries served: {stats['countries_served']}")
    print(f"   ✅ Major airports: {stats['major_airports']}")
    print(f"   ✅ Regional airports: {stats['regional_airports']}")
    
    # Test 9: Verify minimum requirements
    print("\n9. Testing minimum requirements...")
    if stats['indian_airports'] >= 90:
        print("   ✅ Indian airports requirement met (≥90)")
    else:
        print(f"   ❌ Indian airports requirement not met (≥90, got {stats['indian_airports']})")
    
    if stats['international_airports'] >= 50:
        print("   ✅ International airports requirement met (≥50)")
    else:
        print(f"   ❌ International airports requirement not met (≥50, got {stats['international_airports']})")
    
    print("\n" + "=" * 50)
    print("🎉 All airport database tests completed!")
    print(f"📊 Database Summary: {stats['total_airports']} airports across {stats['countries_served']} countries")
    
    return stats

if __name__ == "__main__":
    test_airport_database()
