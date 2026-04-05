"""
Airport Data API - Fast prefix + fuzzy search over 90+ airports
"""
import json
import os
from difflib import SequenceMatcher
from pathlib import Path

AIRPORTS = []

def load_airports():
    global AIRPORTS
    catalog_path = Path(__file__).parent / "data" / "airports_catalog.json"
    with open(catalog_path, "r", encoding="utf-8") as f:
        AIRPORTS = json.load(f)
    print(f"[AirportAPI] Loaded {len(AIRPORTS)} airports")

def search_airports(query: str, limit: int = 25):
    """Search airports by prefix match on code, city, name + fuzzy fallback"""
    if not query or len(query.strip()) == 0:
        return AIRPORTS[:limit]
    
    q = query.lower().strip()
    exact_matches = []
    prefix_matches = []
    contains_matches = []
    fuzzy_matches = []
    
    for airport in AIRPORTS:
        code = airport["code"].lower()
        city = airport["city"].lower()
        name = airport["name"].lower()
        
        # Exact code match (highest priority)
        if code == q:
            exact_matches.append(airport)
        # Code starts with query
        elif code.startswith(q):
            prefix_matches.append(airport)
        # City starts with query
        elif city.startswith(q):
            prefix_matches.append(airport)
        # City/name contains query
        elif q in city or q in name or q in code:
            contains_matches.append(airport)
        # Fuzzy match (for typos)
        else:
            ratio = max(
                SequenceMatcher(None, q, city).ratio(),
                SequenceMatcher(None, q, code).ratio(),
                SequenceMatcher(None, q, name[:len(q)+5]).ratio()
            )
            if ratio > 0.55:
                fuzzy_matches.append((ratio, airport))
    
    # Sort fuzzy by ratio
    fuzzy_matches.sort(key=lambda x: x[0], reverse=True)
    fuzzy_results = [a for _, a in fuzzy_matches]
    
    # Combine in priority order
    results = exact_matches + prefix_matches + contains_matches + fuzzy_results
    return results[:limit]
