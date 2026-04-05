"""
SkyVoyage Python service: airport lookup (bundled catalog + Amadeus + AviationStack), AI chatbot.
Flight search is handled by the Java engine; this service does not return mock flights.

Airport catalog is built from OpenFlights data (ODbL); see build_airports_catalog.py and data/airports_catalog.json.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="SkyVoyage Aviation & AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

AMADEUS_KEY = os.getenv("AMADEUS_API_KEY", "")
AMADEUS_SECRET = os.getenv("AMADEUS_API_SECRET", "")
AVIATION_STACK_KEY = os.getenv("AVIATION_STACK_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

_amadeus_token: Optional[str] = None
_amadeus_expires: float = 0

_CATALOG_PATH = Path(__file__).resolve().parent / "data" / "airports_catalog.json"


def _amadeus_base() -> str:
    prod = os.getenv("AMADEUS_PRODUCTION", "").lower() in ("1", "true", "yes")
    prod = prod or os.getenv("AMADEUS_ENV", "").lower() == "production"
    return "https://api.amadeus.com" if prod else "https://test.api.amadeus.com"


def _load_catalog() -> list[dict[str, Any]]:
    try:
        with open(_CATALOG_PATH, encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, list):
                return []
            # One row per IATA (source data can contain duplicates after merges)
            seen: set[str] = set()
            out: list[dict[str, Any]] = []
            for a in data:
                c = (a.get("code") or "").strip().upper()
                if len(c) != 3 or c in seen:
                    continue
                seen.add(c)
                out.append(a)
            return out
    except FileNotFoundError:
        return []


AIRPORTS_CATALOG: list[dict[str, Any]] = _load_catalog()
CATALOG_INDIA_COUNT = sum(1 for a in AIRPORTS_CATALOG if a.get("region") == "IN")
CATALOG_INTL_COUNT = sum(1 for a in AIRPORTS_CATALOG if a.get("region") == "INTL")


def _catalog_to_api(a: dict[str, Any]) -> dict[str, Any]:
    city = a.get("city") or ""
    name = a.get("name") or ""
    code = a.get("code") or ""
    return {
        "code": code,
        "name": name,
        "city": city,
        "label": f"{city} — {name} ({code})" if city else f"{name} ({code})",
        "source": "catalog",
    }


def search_catalog(q: str, limit: int = 400) -> list[dict[str, Any]]:
    q = (q or "").strip()
    if len(q) < 2:
        return []
    ql = q.lower()
    legacy_city = {"bombay": "mumbai", "calcutta": "kolkata", "madras": "chennai", "baroda": "vadodara"}
    if ql in legacy_city:
        ql = legacy_city[ql]
    india_hints = ("india", "indian", "bharat", "भारत")
    if ql in india_hints:
        rows = [a for a in AIRPORTS_CATALOG if a.get("region") == "IN"]
        return [_catalog_to_api(a) for a in rows[:limit]]

    intl_hints = ("international", "intl", "overseas", "abroad", "foreign")
    if ql in intl_hints:
        rows = [a for a in AIRPORTS_CATALOG if a.get("region") == "INTL"]
        return [_catalog_to_api(a) for a in rows[:limit]]

    # Short tokens → substring match on OpenFlights country name
    country_hints: dict[str, str] = {
        "usa": "united states",
        "america": "united states",
        "us": "united states",
        "uk": "united kingdom",
        "britain": "united kingdom",
        "england": "united kingdom",
        "scotland": "united kingdom",
        "uae": "united arab emirates",
        "emirates": "united arab emirates",
        "dubai": "united arab emirates",
        "canada": "canada",
        "australia": "australia",
        "singapore": "singapore",
        "thailand": "thailand",
        "japan": "japan",
        "china": "china",
        "hong": "hong kong",
        "korea": "korea",
        "germany": "germany",
        "france": "france",
        "spain": "spain",
        "italy": "italy",
        "turkey": "turkey",
        "qatar": "qatar",
        "saudi": "saudi arabia",
        "kuwait": "kuwait",
        "oman": "oman",
        "bahrain": "bahrain",
        "malaysia": "malaysia",
        "indonesia": "indonesia",
        "vietnam": "vietnam",
        "philippines": "philippines",
        "nepal": "nepal",
        "bangladesh": "bangladesh",
        "pakistan": "pakistan",
        "sri": "sri lanka",
        "lanka": "sri lanka",
        "new": "new zealand",
        "zealand": "new zealand",
        "mexico": "mexico",
        "brazil": "brazil",
        "netherlands": "netherlands",
        "holland": "netherlands",
        "amsterdam": "netherlands",
        "swiss": "switzerland",
        "switzerland": "switzerland",
        "austria": "austria",
        "belgium": "belgium",
        "greece": "greece",
        "portugal": "portugal",
        "ireland": "ireland",
        "poland": "poland",
        "russia": "russia",
        "egypt": "egypt",
        "israel": "israel",
    }
    if ql in country_hints:
        needle = country_hints[ql]
        rows = [
            a
            for a in AIRPORTS_CATALOG
            if needle in (a.get("country") or "").lower()
        ]
        return [_catalog_to_api(a) for a in rows[:limit]]

    scored: list[tuple[int, dict[str, Any]]] = []
    for a in AIRPORTS_CATALOG:
        code = (a.get("code") or "").lower()
        city = (a.get("city") or "").lower()
        name = (a.get("name") or "").lower()
        country = (a.get("country") or "").lower()
        score = 0
        if code == ql:
            score = 100
        elif city == ql or name == ql:
            score = 95
        elif code.startswith(ql):
            score = 88
        elif city.startswith(ql) or name.startswith(ql):
            score = 75
        elif ql in city or ql in name:
            score = 55
        elif ql in country:
            score = 45
        elif ql in code:
            score = 40
        else:
            continue
        scored.append((score, a))

    scored.sort(key=lambda t: (-t[0], (t[1].get("city") or ""), t[1].get("code") or ""))
    return [_catalog_to_api(a) for _, a in scored[:limit]]


def merge_airports(
    catalog_rows: list[dict[str, Any]],
    amadeus_rows: list[dict[str, Any]],
    avs_rows: list[dict[str, Any]],
    max_results: int = 350,
) -> list[dict[str, Any]]:
    """Catalog supplies breadth; Amadeus/AviationStack override same IATA with fresher labels."""
    by_code: dict[str, dict[str, Any]] = {}
    for a in catalog_rows:
        code = (a.get("code") or "").strip().upper()
        if code and len(code) == 3:
            by_code[code] = a
    for a in amadeus_rows + avs_rows:
        code = (a.get("code") or "").strip().upper()
        if code and len(code) == 3:
            by_code[code] = a
    out = list(by_code.values())
    out.sort(key=lambda x: (0 if x.get("source") != "catalog" else 1, x.get("city") or "", x.get("code") or ""))
    return out[:max_results]


async def get_amadeus_token(client: httpx.AsyncClient) -> str:
    global _amadeus_token, _amadeus_expires
    import time

    now = time.time()
    if _amadeus_token and now < _amadeus_expires - 60:
        return _amadeus_token

    base = _amadeus_base()
    r = await client.post(
        f"{base}/v1/security/oauth2/token",
        data={
            "grant_type": "client_credentials",
            "client_id": AMADEUS_KEY,
            "client_secret": AMADEUS_SECRET,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    r.raise_for_status()
    data = r.json()
    _amadeus_token = data["access_token"]
    _amadeus_expires = now + float(data.get("expires_in", 1800))
    return _amadeus_token


async def amadeus_airports(client: httpx.AsyncClient, keyword: str) -> list[dict[str, Any]]:
    if not AMADEUS_KEY or not AMADEUS_SECRET:
        return []
    token = await get_amadeus_token(client)
    base = _amadeus_base()
    all_rows: list[dict[str, Any]] = []
    for offset in (0, 20, 40, 60, 80):
        r = await client.get(
            f"{base}/v1/reference-data/locations",
            params={
                "keyword": keyword,
                "subType": "AIRPORT,CITY",
                "page[limit]": 20,
                "page[offset]": offset,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        if r.status_code >= 400:
            break
        batch = r.json().get("data") or []
        if not batch:
            break
        for loc in batch:
            iata = loc.get("iataCode") or ""
            name = loc.get("name") or ""
            city = (loc.get("address") or {}).get("cityName") or ""
            if not iata:
                continue
            all_rows.append(
                {
                    "code": iata,
                    "name": name,
                    "city": city,
                    "label": f"{city} — {name} ({iata})" if city else f"{name} ({iata})",
                    "source": "amadeus",
                }
            )
        if len(batch) < 20:
            break
    return all_rows


async def aviationstack_airports(client: httpx.AsyncClient, keyword: str) -> list[dict[str, Any]]:
    if not AVIATION_STACK_KEY:
        return []
    r = await client.get(
        "http://api.aviationstack.com/v1/airports",
        params={"access_key": AVIATION_STACK_KEY, "search": keyword, "limit": 100},
    )
    if r.status_code >= 400:
        return []
    js = r.json()
    if js.get("error"):
        return []
    out = []
    for a in js.get("data") or []:
        code = a.get("iata_code") or ""
        name = a.get("airport_name") or a.get("name") or ""
        city = (a.get("city_name") or "") if isinstance(a.get("city_name"), str) else ""
        if code:
            out.append(
                {
                    "code": code,
                    "name": name,
                    "city": city,
                    "label": f"{city} — {name} ({code})" if city else f"{name} ({code})",
                    "source": "aviationstack",
                }
            )
    return out


@app.get("/")
async def root():
    return {
        "message": "SkyVoyage Python Service Active",
        "endpoints": ["/airports", "/airports/meta", "/chatbot"],
        "airports_catalog_loaded": len(AIRPORTS_CATALOG),
        "catalog_india_airports": CATALOG_INDIA_COUNT,
        "catalog_international_airports": CATALOG_INTL_COUNT,
    }


@app.get("/airports/meta")
async def airports_meta():
    """Counts for the bundled OpenFlights-derived catalog (no heavy payload)."""
    return {
        "catalog_file": _CATALOG_PATH.name,
        "entries_loaded": len(AIRPORTS_CATALOG),
        "india_iata_airports": CATALOG_INDIA_COUNT,
        "international_iata_airports": CATALOG_INTL_COUNT,
        "browse_query": {"india": "region=IN", "international": "region=INTL"},
    }


@app.get("/airports")
async def get_airports(q: str = "", region: str = ""):
    """Search by text (q) and/or browse full catalog slices (region=IN | INTL)."""
    reg = (region or "").strip().upper()
    if reg == "IN":
        rows = [a for a in AIRPORTS_CATALOG if a.get("region") == "IN"]
        rows.sort(key=lambda x: ((x.get("city") or "").lower(), x.get("code") or ""))
        return [_catalog_to_api(a) for a in rows]
    if reg == "INTL":
        rows = [a for a in AIRPORTS_CATALOG if a.get("region") == "INTL"]
        rows.sort(key=lambda x: ((x.get("country") or "").lower(), (x.get("city") or "").lower()))
        return [_catalog_to_api(a) for a in rows]

    q = (q or "").strip()
    if len(q) < 2:
        return []

    catalog_hits = search_catalog(q, limit=400)

    async with httpx.AsyncClient(timeout=45.0) as client:
        import asyncio

        amadeus_task = amadeus_airports(client, q)
        avs_task = aviationstack_airports(client, q)
        amadeus, avs = await asyncio.gather(amadeus_task, avs_task)

    return merge_airports(catalog_hits, amadeus, avs, max_results=350)


class SearchQuery(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: str | None = None
    passengers: int = 1
    cabin_class: str = "Economy"


class ChatBody(BaseModel):
    text: str = ""


@app.post("/search-flights")
async def search_flights_legacy(_: SearchQuery):
    """Legacy path: flight search is owned by Java. Return explicit redirect hint."""
    raise HTTPException(
        status_code=501,
        detail="Use POST /api/flights/search on the gateway (Java engine).",
    )


@app.post("/chatbot")
async def chatbot(body: ChatBody):
    text = (body.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty message")

    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=501,
            detail="AI chatbot requires OPENAI_API_KEY in environment.",
        )

    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": OPENAI_MODEL,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are SkyBot, a concise travel assistant for SkyVoyage flight booking. "
                        "Help with flights, airports, PNR, baggage, and policies. Keep answers short.",
                    },
                    {"role": "user", "content": text},
                ],
                "max_tokens": 500,
            },
        )
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail=r.text)
        data = r.json()
        reply = data["choices"][0]["message"]["content"]
        return {"reply": reply}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
