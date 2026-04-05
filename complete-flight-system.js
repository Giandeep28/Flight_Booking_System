// Complete Flight System Implementation

// 1. AIRLINE MAPPING
const AIRLINE_MAPPING = {
  'air india': 'AI',
  'airindia': 'AI',
  'air india express': 'IX',
  'airindia express': 'IX',
  'indigo': '6E',
  'indigo airlines': '6E',
  'spicejet': 'SG',
  'spice jet': 'SG',
  'spicejet airlines': 'SG',
  'akasa air': 'QP',
  'akasa': 'QP',
  'akasa airlines': 'QP',
  'alliance air': '9I',
  'allianceair': '9I',
  'star air': 'S5',
  'starair': 'S5'
};

// 2. LOGO URL GENERATION
function getAirlineLogo(airlineName) {
  const cleanName = String(airlineName || '').toLowerCase().trim();
  const iata = AIRLINE_MAPPING[cleanName] || 'AI';
  const logoUrl = `https://content.airhex.com/content/logos/airlines_${iata}_350_100_r.png`;
  const fallbackUrl = `https://pics.avs.io/200/50/${iata}.png`;
  
  return {
    airline: airlineName,
    iata_code: iata,
    logo_url: logoUrl,
    fallback_url: fallbackUrl
  };
}

// 3. FLIGHT DATA LOADER
async function loadFlightData(fromIata, toIata, date) {
  // Try AviationStack API (free tier - 500 requests/month)
  try {
    const apiKey = 'YOUR_AVIATIONSTACK_API_KEY'; // Get free key from aviationstack.com
    const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${fromIata}&arr_iata=${toIata}&flight_date=${date}&limit=10`;
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return transformAviationStackData(data);
    }
  } catch (error) {
    console.log('API unavailable, using realistic mock data');
  }
  
  // Fallback to realistic mock data
  return getRealisticMockData(fromIata, toIata);
}

function transformAviationStackData(apiData) {
  return apiData.data.map(flight => ({
    id: `${flight.airline.iata}-${flight.flight.number}`,
    airline: flight.airline.name,
    iata: flight.airline.iata,
    flight_number: flight.flight.number,
    departure: {
      airport: flight.departure.airport,
      iata: flight.departure.iata,
      city: flight.departure.city,
      time: flight.departure.scheduled,
      terminal: flight.departure.terminal
    },
    arrival: {
      airport: flight.arrival.airport,
      iata: flight.arrival.iata,
      city: flight.arrival.city,
      time: flight.arrival.scheduled,
      terminal: flight.arrival.terminal
    },
    duration: formatDuration(flight.departure.scheduled, flight.arrival.scheduled),
    price: generateRealisticPrice(flight.airline.iata, flight.departure.iata, flight.arrival.iata),
    currency: "INR",
    stops: 0,
    aircraft: flight.aircraft?.iata || "A320"
  }));
}

function getRealisticMockData(fromIata, toIata) {
  const routes = {
    'DEL-BOM': [
      { airline: 'Air India', iata: 'AI', flight_number: '647', time: '06:30', duration: '2h 15m', price: 4500, aircraft: 'Airbus A320neo' },
      { airline: 'IndiGo', iata: '6E', flight_number: '2174', time: '08:15', duration: '2h 30m', price: 3800, aircraft: 'Airbus A320' },
      { airline: 'SpiceJet', iata: 'SG', flight_number: '815', time: '10:00', duration: '2h 15m', price: 3200, aircraft: 'Boeing 737-800' },
      { airline: 'Air India Express', iata: 'IX', flight_number: '1348', time: '12:30', duration: '2h 15m', price: 2800, aircraft: 'Boeing 737-800' },
      { airline: 'Akasa Air', iata: 'QP', flight_number: '1152', time: '14:45', duration: '2h 15m', price: 2500, aircraft: 'Boeing 737 MAX' },
      { airline: 'Alliance Air', iata: '9I', flight_number: '623', time: '17:30', duration: '2h 15m', price: 2200, aircraft: 'ATR 72-600' }
    ],
    'DEL-BLR': [
      { airline: 'Air India', iata: 'AI', flight_number: '507', time: '06:00', duration: '2h 45m', price: 4800, aircraft: 'Airbus A321' },
      { airline: 'IndiGo', iata: '6E', flight_number: '524', time: '08:30', duration: '2h 35m', price: 4200, aircraft: 'Airbus A321neo' },
      { airline: 'SpiceJet', iata: 'SG', flight_number: '372', time: '11:00', duration: '2h 40m', price: 3500, aircraft: 'Boeing 737-900' },
      { airline: 'Akasa Air', iata: 'QP', flight_number: '142', time: '15:30', duration: '2h 35m', price: 3000, aircraft: 'Boeing 737 MAX' },
      { airline: 'Star Air', iata: 'S5', flight_number: '842', time: '18:00', duration: '2h 45m', price: 2800, aircraft: 'Embraer E175' }
    ],
    'BOM-HYD': [
      { airline: 'Air India', iata: 'AI', flight_number: '629', time: '07:15', duration: '1h 30m', price: 3200, aircraft: 'Airbus A319' },
      { airline: 'IndiGo', iata: '6E', flight_number: '617', time: '09:45', duration: '1h 25m', price: 2800, aircraft: 'Airbus A320' },
      { airline: 'SpiceJet', iata: 'SG', flight_number: '301', time: '12:00', duration: '1h 30m', price: 2400, aircraft: 'Boeing 737-700' },
      { airline: 'Akasa Air', iata: 'QP', flight_number: '201', time: '16:30', duration: '1h 25m', price: 2200, aircraft: 'Boeing 737 MAX' }
    ],
    'BLR-MAA': [
      { airline: 'Air India', iata: 'AI', flight_number: '543', time: '06:45', duration: '1h 00m', price: 2500, aircraft: 'Airbus A319' },
      { airline: 'IndiGo', iata: '6E', flight_number: '712', time: '09:15', duration: '1h 05m', price: 2200, aircraft: 'Airbus A320' },
      { airline: 'SpiceJet', iata: 'SG', flight_number: '217', time: '13:30', duration: '1h 00m', price: 1800, aircraft: 'Boeing 737-700' },
      { airline: 'Alliance Air', iata: '9I', flight_number: '241', time: '17:45', duration: '1h 05m', price: 1600, aircraft: 'ATR 72-600' }
    ]
  };
  
  const routeKey = `${fromIata}-${toIata}`;
  const flights = routes[routeKey] || routes['DEL-BOM']; // Default route
  
  const airports = {
    'DEL': { name: 'Indira Gandhi International Airport', city: 'New Delhi', terminal: '3' },
    'BOM': { name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', terminal: '2' },
    'BLR': { name: 'Kempegowda International Airport', city: 'Bengaluru', terminal: '1' },
    'HYD': { name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', terminal: '1' },
    'MAA': { name: 'Chennai International Airport', city: 'Chennai', terminal: '1' }
  };
  
  return flights.map((flight, index) => {
    const arrivalTime = calculateArrivalTime(flight.time, flight.duration);
    
    return {
      id: `${flight.iata}-${flight.flight_number}`,
      airline: flight.airline,
      iata: flight.iata,
      flight_number: flight.flight_number,
      departure: {
        airport: airports[fromIata].name,
        iata: fromIata,
        city: airports[fromIata].city,
        time: flight.time,
        terminal: airports[fromIata].terminal
      },
      arrival: {
        airport: airports[toIata].name,
        iata: toIata,
        city: airports[toIata].city,
        time: arrivalTime,
        terminal: airports[toIata].terminal
      },
      duration: flight.duration,
      price: flight.price,
      currency: "INR",
      stops: 0,
      aircraft: flight.aircraft
    };
  });
}

// 4. UTILITY FUNCTIONS
function calculateArrivalTime(departureTime, duration) {
  const [depHours, depMinutes] = departureTime.split(':').map(Number);
  const [durHours, durMinutes] = duration.replace('h ', ':').replace('m', '').split(':').map(Number);
  
  const totalMinutes = depHours * 60 + depMinutes + durHours * 60 + durMinutes;
  const arrHours = Math.floor(totalMinutes / 60) % 24;
  const arrMinutes = totalMinutes % 60;
  
  return `${arrHours.toString().padStart(2, '0')}:${arrMinutes.toString().padStart(2, '0')}`;
}

function generateRealisticPrice(airlineIata, fromIata, toIata) {
  const basePrices = {
    'AI': 4500,
    '6E': 3800,
    'SG': 3200,
    'IX': 2800,
    'QP': 2500,
    '9I': 2200,
    'S5': 2000
  };
  
  const routeMultiplier = {
    'DEL-BOM': 1.0,
    'DEL-BLR': 1.1,
    'BOM-HYD': 0.8,
    'BLR-MAA': 0.7
  };
  
  const routeKey = `${fromIata}-${toIata}`;
  const multiplier = routeMultiplier[routeKey] || 1.0;
  
  return Math.round(basePrices[airlineIata] * multiplier);
}

// 5. RENDERING FUNCTIONS
function renderAirlineLogoHTML(airlineName, className = "airline-logo") {
  const logoData = getAirlineLogo(airlineName);
  
  return `<img src="${logoData.logo_url}" 
               alt="${airlineName}" 
               class="${className}" 
               onerror="this.onerror=null; this.src='${logoData.fallback_url}'; console.error('Logo failed for ${logoData.iata_code}');"
               loading="lazy" />`;
}

function renderFlightCardHTML(flight) {
  const logoHTML = renderAirlineLogoHTML(flight.airline, "airline-logo");
  
  return `
    <div class="flight-card">
      <div class="flight-header">
        <div class="airline-info">
          ${logoHTML}
          <div class="flight-details">
            <div class="airline-name">${flight.airline}</div>
            <div class="flight-number">${flight.iata}-${flight.flight_number}</div>
          </div>
        </div>
        <div class="price">₹${flight.price.toLocaleString('en-IN')}</div>
      </div>
      
      <div class="flight-route">
        <div class="departure">
          <div class="time">${flight.departure.time}</div>
          <div class="city">${flight.departure.iata}</div>
          <div class="airport">${flight.departure.city}</div>
        </div>
        
        <div class="flight-path">
          <div class="duration">${flight.duration}</div>
          <div class="stops">Non-stop</div>
        </div>
        
        <div class="arrival">
          <div class="time">${flight.arrival.time}</div>
          <div class="city">${flight.arrival.iata}</div>
          <div class="airport">${flight.arrival.city}</div>
        </div>
      </div>
      
      <div class="flight-footer">
        <div class="aircraft">${flight.aircraft}</div>
        <button class="book-btn" onclick="bookFlight('${flight.id}')">Book Now</button>
      </div>
    </div>
  `;
}

// 6. MAIN FUNCTION
async function searchFlights(fromIata, toIata, date) {
  const flights = await loadFlightData(fromIata, toIata, date);
  return flights;
}
