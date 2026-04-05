# SkyVoyage — Local Engineering Runbook

## Architecture

1. **Next.js** (`../skyvoyage-nextjs`) — UI on port **3000** (proxies `/api/*` to the gateway).
2. **Node gateway** (`api-gateway/server.js`) — **3001**, MongoDB, JWT, caching, OpenSky proxy.
3. **Java engine** (`java-engine`) — **8085**, parallel **Amadeus** + **Duffel** + **AviationStack** search, PNR / ticket files.
4. **Python** (`python-service/app.py`) — **8000**, **bundled airport catalog** (120+ India, 100+ international IATA) merged with Amadeus + AviationStack, OpenAI chatbot.
5. **MongoDB** — local or Atlas (`MONGODB_URI`).

## Live data (required for a real booking experience)

SkyVoyage does **not** use mock flights. The Java engine calls **live** providers:

| Data | Source | Purpose |
|------|--------|--------|
| Bookable fares & offers | **Amadeus** Flight Offers Search | GDS-style shopping; real fares you can select for booking |
| Bookable fares & offers | **Duffel** Offer Requests (optional) | NDC / multi-source live offers ([Duffel](https://duffel.com/)); no public Skyscanner API — this is a practical “extra feed” for indies |
| Airline display names | **Amadeus** Airline lookup | Full airline names + IATA logos (gstatic CDN) |
| Extra schedules | **AviationStack** (optional) | Supplemental routes (schedule-only unless paired with a priced offer) |
| Airports autocomplete | **`data/airports_catalog.json`** (OpenFlights-derived ODbL) + **Amadeus** + **AviationStack** | Full India + major international coverage even when APIs cap results |
| Live positions | **OpenSky** Network | Dashboard / status (ADS-B coverage) |

**Minimum for end-to-end booking:** configure at least one priced feed for the Java engine:

- `AMADEUS_API_KEY` + `AMADEUS_API_SECRET` (also copy into Python `.env` for airports), and/or  
- `DUFFEL_ACCESS_TOKEN` for Duffel live offers.

Optional: `AVIATION_STACK_KEY` for extra schedule rows. Production Amadeus: `AMADEUS_PRODUCTION=true` or `AMADEUS_ENV=production`.  
Optional: `OPENAI_API_KEY` on Python for SkyBot.

Check wiring: `GET http://localhost:3001/api/integrations/status` (gateway must be running).

## Prerequisites

- Node.js 18+, npm  
- Java 17 + Maven (for the Java service)  
- Python 3.10+  
- MongoDB running locally  
- [Amadeus](https://developers.amadeus.com/) API key + secret and/or [Duffel](https://duffel.com/) access token — **at least one for live bookable fares**  
- Optional: [AviationStack](https://aviationstack.com/) key  
- Optional: `OPENAI_API_KEY` for SkyBot  

## Setup

1. Copy env files:

   ```bash
   cp skyvoyage/.env.example skyvoyage/api-gateway/.env
   cp skyvoyage/.env.example skyvoyage/python-service/.env
   ```

   Set `MONGODB_URI` and either Amadeus (`AMADEUS_API_KEY`, `AMADEUS_API_SECRET`) or Duffel (`DUFFEL_ACCESS_TOKEN`) on the Java process (same `.env` values if you load env into the shell before `java ...`).

2. **Gateway**

   ```bash
   cd skyvoyage/api-gateway
   npm install
   node server.js
   ```

3. **Java engine**

   ```bash
   cd skyvoyage/java-engine
   mvn -q package -DskipTests
   java -cp target/skyvoyage-java-engine-1.0.0.jar com.skyvoyage.http.SkyVoyageServer
   ```

   Or run the shaded JAR produced under `target/` (name may include `-shaded` depending on Maven output).

4. **Python**

   ```bash
   cd skyvoyage/python-service
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   ```

   Airport autocomplete uses `data/airports_catalog.json` (committed). To refresh it from OpenFlights: `python build_airports_catalog.py`.

   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

   In the UI, typing **`india`**, **`international`**, or short country tokens (**`usa`**, **`uk`**, **`uae`**, **`thailand`**, …) lists the matching catalog slice before you narrow by city.

5. **Frontend**

   ```bash
   cd skyvoyage-nextjs
   npm install
   npm run dev
   ```

   Optional: `API_GATEWAY_URL=http://localhost:3001` if the gateway port differs.

## API flow

- Flight search: Browser → Next rewrite → `POST /api/flights/search` → Java `POST /v1/flights/search` (results cached in MongoDB `flightcaches`).
- Airports: `GET /api/airports/search?q=` → Python `GET /airports`. Browse full bundled lists: `GET /api/airports/search?region=IN` (all ~121 Indian IATA) or `?region=INTL` (~160 international). Home search has **All Indian airports** / **International list** chips. Quick counts: `GET /api/airports/meta` (gateway) or Python `GET /airports/meta`.
- Bookings: `POST /api/bookings` (JWT, validated) → Java `POST /v1/bookings` → MongoDB `bookings` + `payments`. Search results for **Amadeus** include `raw_offer`; the Java engine calls **Amadeus Flight Create Orders** when that payload and a valid token exist (`booking_mode: amadeus_live`). **Duffel** and other rows use a **simulated PNR** (`booking_mode: simulated`) until NDC orders are integrated.
- Price check: `POST /api/flights/price` → Java `POST /v1/flights/price` (Amadeus Flight Offers Price, optional).
- Chat: `POST /api/chat` → Python `POST /chatbot` (requires `OPENAI_API_KEY`).
- Live status: `GET /api/flight-status?callsign=` → OpenSky Network (coverage varies).

## Troubleshooting

- **No flights**: verify Amadeus credentials (test uses `test.api.amadeus.com` unless `AMADEUS_PRODUCTION` / `AMADEUS_ENV` select production) and/or a valid `DUFFEL_ACCESS_TOKEN`.
- **Few airports in autocomplete**: ensure `python-service/data/airports_catalog.json` exists (run `python build_airports_catalog.py` in `python-service`). Optionally configure Amadeus or AviationStack in the Python `.env` for live name overrides.
- **Chat 501**: set `OPENAI_API_KEY` in Python.
- **Mongo connection**: verify `mongod` is running or use Atlas URI.
