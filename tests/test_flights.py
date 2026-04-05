"""
Test suite for SkyVoyage flight search functionality
"""

import pytest
import requests
from fastapi.testclient import TestClient

def test_flights_api():
    """Test the flights API endpoint"""
    with TestClient(app="http://localhost:8000") as client:
        # Test basic flight search
        response = client.get("/api/flights")
        assert response.status_code == 200
        data = response.json()
        assert "flights" in data
        assert len(data["flights"]) > 0
        
        # Test flight search with parameters
        response = client.get("/api/flights?from=DEL&to=BOM")
        assert response.status_code == 200
        
        # Test airlines endpoint
        response = client.get("/api/airlines")
        assert response.status_code == 200
        data = response.json()
        assert "airlines" in data

def test_airports_api():
    """Test the airports API endpoint"""
    with TestClient(app="http://localhost:8000") as client:
        response = client.get("/api/airports")
        assert response.status_code == 200
        data = response.json()
        assert "airports" in data
        assert len(data["airports"]) > 0

if __name__ == "__main__":
    test_flights_api()
    test_airports_api()
    print("All tests passed!")
