"""
SkyVoyage Python Intelligence Layer
FastAPI server providing airport search, flight data, and AI chatbot
Port: 5000
"""
import os
import json
import asyncio
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from airport_api import load_airports, search_airports
from flight_mock_api import generate_flights
from chatbot_engine import get_response
from amadeus_client import search_flights as amadeus_search


# ── Lifespan ────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    load_airports()
    print("[SkyVoyage Python] Intelligence Layer started on port 5000")
    yield
    print("[SkyVoyage Python] Shutting down")


app = FastAPI(
    title="SkyVoyage Intelligence Layer",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Models ──────────────────────────────────────────────
class FlightSearchRequest(BaseModel):
    origin: str
    destination: str
    date: str
    passengers: int = 1

class ChatMessage(BaseModel):
    message: str
    userId: Optional[str] = None


# ── Health Check ────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "python-intelligence-layer", "timestamp": datetime.now().isoformat()}


# ── Airport Search ──────────────────────────────────────────────
@app.get("/airports/search")
async def airport_search(q: str = Query("", min_length=0), limit: int = Query(25, le=50)):
    """Search airports by code, city, or name with fuzzy matching"""
    results = search_airports(q, limit)
    return {"success": True, "count": len(results), "airports": results}


# ── Flight Search (Aggregated) ──────────────────────────────────
@app.post("/flights/search")
async def flight_search(req: FlightSearchRequest):
    """
    Multi-source flight aggregator:
    1. Try Amadeus API (if configured)
    2. Fallback to mock data generator
    3. Merge, deduplicate, and return
    """
    origin = req.origin.upper()
    destination = req.destination.upper()
    
    if origin == destination:
        raise HTTPException(400, "Origin and destination must be different")
    
    all_flights = []
    sources_used = []
    
    # Source 1: Amadeus API (parallel)
    try:
        amadeus_flights = await amadeus_search(origin, destination, req.date, req.passengers)
        if amadeus_flights:
            all_flights.extend(amadeus_flights)
            sources_used.append("amadeus")
    except Exception as e:
        print(f"[FlightSearch] Amadeus failed: {e}")
    
    # Source 2: Mock data (always available)
    mock_flights = generate_flights(origin, destination, req.date, req.passengers)
    if mock_flights:
        # Deduplicate against Amadeus results
        existing_ids = {f["id"] for f in all_flights}
        for flight in mock_flights:
            if flight["id"] not in existing_ids:
                all_flights.append(flight)
        sources_used.append("mock")
    
    if not all_flights:
        raise HTTPException(404, f"No flights found from {origin} to {destination}")
    
    # Sort by price (cheapest first)
    all_flights.sort(key=lambda f: f["price"])
    
    return {
        "success": True,
        "count": len(all_flights),
        "flights": all_flights,
        "sources": sources_used,
        "searchParams": {
            "origin": origin,
            "destination": destination,
            "date": req.date,
            "passengers": req.passengers,
        },
        "timestamp": datetime.now().isoformat(),
    }


# ── Price Revalidation ──────────────────────────────────────────
@app.post("/flights/revalidate")
async def revalidate_price(flight_id: str = Query(...), origin: str = Query(...), destination: str = Query(...), date: str = Query(...)):
    """Revalidate flight price before booking"""
    flights = generate_flights(origin.upper(), destination.upper(), date)
    
    for flight in flights:
        if flight["id"] == flight_id:
            return {
                "success": True,
                "valid": True,
                "flight": flight,
                "timestamp": datetime.now().isoformat(),
            }
    
    return {
        "success": False,
        "valid": False,
        "message": "Flight no longer available",
    }


# ── AI Chatbot ──────────────────────────────────────────────────
@app.post("/chatbot/message")
async def chatbot_message(msg: ChatMessage):
    """Process chatbot message and return AI response"""
    if not msg.message.strip():
        raise HTTPException(400, "Message cannot be empty")
    
    response = get_response(msg.message)
    return {"success": True, **response}


# ── Run ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")
