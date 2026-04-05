"""
Build data/airports_catalog.json from OpenFlights airports.dat (ODbL).

- All India airports with a valid 3-letter IATA code (~110–125).
- At least 105 international airports, prioritising major countries, then filling from the rest of the world.

Run: python build_airports_catalog.py
"""
from __future__ import annotations

import csv
import io
import json
import sys
import urllib.request
from pathlib import Path

OPENFLIGHTS_URL = (
    "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
)

INTL_COUNTRIES = {
    "United States",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Switzerland",
    "Austria",
    "Belgium",
    "Ireland",
    "Portugal",
    "Greece",
    "Poland",
    "Czech Republic",
    "Hungary",
    "Turkey",
    "United Arab Emirates",
    "Qatar",
    "Saudi Arabia",
    "Kuwait",
    "Bahrain",
    "Oman",
    "Israel",
    "Jordan",
    "Egypt",
    "Singapore",
    "Malaysia",
    "Thailand",
    "Indonesia",
    "Philippines",
    "Vietnam",
    "Japan",
    "South Korea",
    "China",
    "Hong Kong",
    "Taiwan",
    "Australia",
    "New Zealand",
    "Canada",
    "Mexico",
    "Brazil",
    "Argentina",
    "Chile",
    "South Africa",
    "Nigeria",
    "Kenya",
    "Morocco",
    "Russia",
    "Ukraine",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Romania",
    "Croatia",
    "Sri Lanka",
    "Nepal",
    "Bangladesh",
    "Pakistan",
    "Maldives",
    "Myanmar",
    "Cambodia",
    "Laos",
    "Kazakhstan",
    "Uzbekistan",
    "Georgia",
    "Azerbaijan",
    "Iran",
    "Iraq",
    "Lebanon",
    "Cyprus",
    "Malta",
    "Iceland",
    "Luxembourg",
    "Slovakia",
    "Slovenia",
    "Serbia",
    "Bulgaria",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Colombia",
    "Peru",
    "Ecuador",
    "Venezuela",
    "Panama",
    "Costa Rica",
    "Jamaica",
    "Trinidad and Tobago",
    "Fiji",
}


def norm_iata(s: str | None) -> str | None:
    if not s or s == r"\N" or len(s) != 3:
        return None
    return s.upper()


def row_airport(row: list[str]) -> bool:
    return len(row) >= 13 and row[12] == "airport"


def main() -> int:
    base = Path(__file__).resolve().parent
    out_dir = base / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "airports_catalog.json"

    print("Fetching OpenFlights airports.dat …", file=sys.stderr)
    req = urllib.request.Request(OPENFLIGHTS_URL, headers={"User-Agent": "SkyVoyage-catalog-builder/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        raw = resp.read().decode("utf-8", errors="replace")

    catalog: list[dict] = []
    seen: set[str] = set()

    def push(name: str, city: str, country: str, iata: str, region: str) -> None:
        code = norm_iata(iata)
        if not code or code in seen:
            return
        seen.add(code)
        catalog.append(
            {
                "code": code,
                "name": name,
                "city": city or name,
                "country": country,
                "region": region,
            }
        )

    reader = csv.reader(io.StringIO(raw), delimiter=",", quotechar='"')
    for row in reader:
        if not row_airport(row):
            continue
        if row[3] != "India":
            continue
        push(row[1], row[2], row[3], row[4], "IN")

    # International: diverse slice (105+ airports) without importing thousands of US regionals.
    intl_min = 105
    intl_preferred = 160
    intl_candidates: list[tuple[str, str, str, str]] = []
    reader2 = csv.reader(io.StringIO(raw), delimiter=",", quotechar='"')
    for row in reader2:
        if not row_airport(row):
            continue
        if row[3] == "India":
            continue
        if norm_iata(row[4]) is None:
            continue
        name, city, country, iata = row[1], row[2], row[3], row[4]
        intl_candidates.append((name, city, country, iata))

    def country_rank(c: str) -> tuple[int, str]:
        pref = 0 if c in INTL_COUNTRIES else 1
        return (pref, c.lower())

    intl_candidates.sort(key=lambda t: (country_rank(t[2]), t[2].lower(), (t[1] or "").lower()))

    for name, city, country, iata in intl_candidates:
        if sum(1 for x in catalog if x["region"] == "INTL") >= intl_preferred:
            break
        push(name, city, country, iata, "INTL")

    intl_n = sum(1 for x in catalog if x["region"] == "INTL")
    if intl_n < intl_min:
        for name, city, country, iata in intl_candidates:
            if sum(1 for x in catalog if x["region"] == "INTL") >= intl_min:
                break
            push(name, city, country, iata, "INTL")

    india_n = sum(1 for x in catalog if x["region"] == "IN")
    intl_n = sum(1 for x in catalog if x["region"] == "INTL")
    print(f"Catalog: {india_n} India + {intl_n} international = {len(catalog)} airports", file=sys.stderr)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"Wrote {out_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
