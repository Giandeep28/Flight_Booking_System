// Production Flight System - Realistic Data & Real Logos

// 1. COMPREHENSIVE AIRLINE MAPPING
const AIRLINE_MAPPING = {
  // Indian Airlines
  'air india': 'AI', 'airindia': 'AI',
  'air india express': 'IX', 'airindia express': 'IX',
  'indigo': '6E', 'indigo airlines': '6E',
  'spicejet': 'SG', 'spice jet': 'SG', 'spicejet airlines': 'SG',
  'akasa air': 'QP', 'akasa': 'QP', 'akasa airlines': 'QP',
  'alliance air': '9I', 'allianceair': '9I',
  'star air': 'S5', 'starair': 'S5',
  'vistara': 'UK', 'airasia india': 'I5', 'go first': 'G8',
  
  // International Airlines
  'emirates': 'EK', 'emirates airline': 'EK',
  'qatar airways': 'QR',
  'singapore airlines': 'SQ',
  'lufthansa': 'LH',
  'british airways': 'BA',
  'etihad airways': 'EY',
  'turkish airlines': 'TK',
  'air france': 'AF',
  'klm': 'KL',
  'delta air lines': 'DL',
  'united airlines': 'UA',
  'american airlines': 'AA',
  'cathay pacific': 'CX',
  'thai airways': 'TG',
  'malaysia airlines': 'MH',
  'sri lankan airlines': 'UL',
  'gulf air': 'GF',
  'oman air': 'WY',
  'kuwait airways': 'KU',
  'saudi arabian airlines': 'SV',
  'egyptair': 'MS',
  'ethiopian airlines': 'ET',
  'kenya airways': 'KQ',
  'south african airways': 'SA',
  'qantas': 'QF',
  'air new zealand': 'NZ',
  'fiji airways': 'FJ',
  'jet airways': '9W',
  'air asia': 'AK',
  'nepal airlines': 'RA',
  'biman bangladesh': 'BG',
  'myanmar airways': 'UB',
  'garuda indonesia': 'GA',
  'philippine airlines': 'PR',
  'vietnam airlines': 'VN',
  'china southern': 'CZ',
  'air china': 'CA',
  'china eastern': 'MU',
  'hainan airlines': 'HU',
  'korean air': 'KE',
  'asiana airlines': 'OZ',
  'japan airlines': 'JL',
  'ana': 'NH',
  'air canada': 'AC',
  'westjet': 'WS'
};

// 2. REALISTIC ROUTE DATABASE
const ROUTE_DATABASE = {
  // Domestic India Routes
  'DEL-BOM': [
    { airline: 'Air India', iata: 'AI', flight_number: '647', time: '06:30', duration: '2h 15m', price: 4500, aircraft: 'Airbus A320neo', frequency: 'daily' },
    { airline: 'IndiGo', iata: '6E', flight_number: '2174', time: '08:15', duration: '2h 30m', price: 3800, aircraft: 'Airbus A320', frequency: 'daily' },
    { airline: 'SpiceJet', iata: 'SG', flight_number: '815', time: '10:00', duration: '2h 15m', price: 3200, aircraft: 'Boeing 737-800', frequency: 'daily' },
    { airline: 'Vistara', iata: 'UK', flight_number: '803', time: '12:30', duration: '2h 15m', price: 5200, aircraft: 'Airbus A321neo', frequency: 'daily' },
    { airline: 'Air India Express', iata: 'IX', flight_number: '1348', time: '15:45', duration: '2h 15m', price: 2800, aircraft: 'Boeing 737-800', frequency: 'daily' },
    { airline: 'Akasa Air', iata: 'QP', flight_number: '1152', time: '18:00', duration: '2h 15m', price: 2500, aircraft: 'Boeing 737 MAX', frequency: 'daily' },
    { airline: 'IndiGo', iata: '6E', flight_number: '524', time: '20:30', duration: '2h 30m', price: 4200, aircraft: 'Airbus A321neo', frequency: 'daily' }
  ],
  'DEL-BLR': [
    { airline: 'Air India', iata: 'AI', flight_number: '507', time: '06:00', duration: '2h 45m', price: 4800, aircraft: 'Airbus A321', frequency: 'daily' },
    { airline: 'IndiGo', iata: '6E', flight_number: '524', time: '08:30', duration: '2h 35m', price: 4200, aircraft: 'Airbus A321neo', frequency: 'daily' },
    { airline: 'SpiceJet', iata: 'SG', flight_number: '372', time: '11:00', duration: '2h 40m', price: 3500, aircraft: 'Boeing 737-900', frequency: 'daily' },
    { airline: 'Vistara', iata: 'UK', flight_number: '881', time: '14:15', duration: '2h 45m', price: 5500, aircraft: 'Airbus A320neo', frequency: 'daily' },
    { airline: 'Akasa Air', iata: 'QP', flight_number: '142', time: '17:30', duration: '2h 35m', price: 3000, aircraft: 'Boeing 737 MAX', frequency: 'daily' },
    { airline: 'Air India Express', iata: 'IX', flight_number: '814', time: '20:00', duration: '2h 45m', price: 3200, aircraft: 'Boeing 737-800', frequency: 'daily' }
  ],
  'BOM-HYD': [
    { airline: 'Air India', iata: 'AI', flight_number: '629', time: '07:15', duration: '1h 30m', price: 3200, aircraft: 'Airbus A319', frequency: 'daily' },
    { airline: 'IndiGo', iata: '6E', flight_number: '617', time: '09:45', duration: '1h 25m', price: 2800, aircraft: 'Airbus A320', frequency: 'daily' },
    { airline: 'SpiceJet', iata: 'SG', flight_number: '301', time: '12:00', duration: '1h 30m', price: 2400, aircraft: 'Boeing 737-700', frequency: 'daily' },
    { airline: 'Vistara', iata: 'UK', flight_number: '823', time: '15:30', duration: '1h 30m', price: 3500, aircraft: 'Airbus A320neo', frequency: 'daily' },
    { airline: 'Akasa Air', iata: 'QP', flight_number: '201', time: '18:45', duration: '1h 25m', price: 2200, aircraft: 'Boeing 737 MAX', frequency: 'daily' },
    { airline: 'Air India Express', iata: 'IX', flight_number: '412', time: '21:15', duration: '1h 30m', price: 2000, aircraft: 'Boeing 737-800', frequency: 'daily' }
  ],
  
  // International Routes from India
  'DEL-DXB': [
    { airline: 'Emirates', iata: 'EK', flight_number: '514', time: '03:45', duration: '3h 30m', price: 15000, aircraft: 'Boeing 777-300ER', frequency: 'daily' },
    { airline: 'Air India', iata: 'AI', flight_number: '947', time: '07:30', duration: '3h 45m', price: 12000, aircraft: 'Boeing 787-8', frequency: 'daily' },
    { airline: 'IndiGo', iata: '6E', flight_number: '1415', time: '10:15', duration: '3h 30m', price: 8500, aircraft: 'Airbus A321neo', frequency: 'daily' },
    { airline: 'SpiceJet', iata: 'SG', flight_number: '11', time: '13:30', duration: '3h 45m', price: 7500, aircraft: 'Boeing 737-800', frequency: 'daily' },
    { airline: 'Flydubai', iata: 'FZ', flight_number: '433', time: '16:45', duration: '3h 30m', price: 7000, aircraft: 'Boeing 737-800', frequency: 'daily' },
    { airline: 'Vistara', iata: 'UK', flight_number: '961', time: '20:00', duration: '3h 45m', price: 11000, aircraft: 'Boeing 787-9', frequency: 'daily' }
  ],
  'BOM-LHR': [
    { airline: 'Air India', iata: 'AI', flight_number: '131', time: '01:15', duration: '9h 30m', price: 45000, aircraft: 'Boeing 777-300ER', frequency: 'daily' },
    { airline: 'British Airways', iata: 'BA', flight_number: '138', time: '04:30', duration: '9h 15m', price: 48000, aircraft: 'Boeing 777-200', frequency: 'daily' },
    { airline: 'Virgin Atlantic', iata: 'VS', flight_number: '324', time: '10:45', duration: '9h 30m', price: 42000, aircraft: 'Boeing 787-9', frequency: 'daily' },
    { airline: 'Air India', iata: 'AI', flight_number: '169', time: '13:30', duration: '9h 30m', price: 43000, aircraft: 'Boeing 787-8', frequency: 'daily' },
    { airline: 'British Airways', iata: 'BA', flight_number: '134', time: '20:15', duration: '9h 15m', price: 46000, aircraft: 'Airbus A350-1000', frequency: 'daily' }
  ],
  'DEL-SIN': [
    { airline: 'Singapore Airlines', iata: 'SQ', flight_number: '403', time: '00:30', duration: '5h 45m', price: 28000, aircraft: 'Airbus A350-900', frequency: 'daily' },
    { airline: 'Air India', iata: 'AI', flight_number: '382', time: '07:00', duration: '5h 30m', price: 22000, aircraft: 'Boeing 787-8', frequency: 'daily' },
    { airline: 'IndiGo', iata: '6E', flight_number: '52', time: '10:15', duration: '5h 45m', price: 15000, aircraft: 'Airbus A321neo', frequency: 'daily' },
    { airline: 'Vistara', iata: 'UK', flight_number: '327', time: '14:30', duration: '5h 30m', price: 25000, aircraft: 'Boeing 787-9', frequency: 'daily' },
    { airline: 'Singapore Airlines', iata: 'SQ', flight_number: '441', time: '21:45', duration: '5h 45m', price: 29000, aircraft: 'Boeing 777-300ER', frequency: 'daily' }
  ],
  
  // International to International
  'DXB-LHR': [
    { airline: 'Emirates', iata: 'EK', flight_number: '9', time: '02:15', duration: '7h 30m', price: 35000, aircraft: 'Airbus A380-800', frequency: 'daily' },
    { airline: 'British Airways', iata: 'BA', flight_number: '106', time: '07:45', duration: '7h 45m', price: 32000, aircraft: 'Boeing 777-200', frequency: 'daily' },
    { airline: 'Qatar Airways', iata: 'QR', flight_number: '115', time: '13:30', duration: '7h 30m', price: 30000, aircraft: 'Boeing 787-9', frequency: 'daily' },
    { airline: 'Emirates', iata: 'EK', flight_number: '11', time: '19:00', duration: '7h 30m', price: 34000, aircraft: 'Boeing 777-300ER', frequency: 'daily' }
  ],
  'LHR-JFK': [
    { airline: 'British Airways', iata: 'BA', flight_number: '117', time: '08:30', duration: '8h 00m', price: 55000, aircraft: 'Boeing 747-400', frequency: 'daily' },
    { airline: 'Virgin Atlantic', iata: 'VS', flight_number: '3', time: '11:15', duration: '8h 15m', price: 52000, aircraft: 'Airbus A350-1000', frequency: 'daily' },
    { airline: 'American Airlines', iata: 'AA', flight_number: '106', time: '13:45', duration: '8h 00m', price: 48000, aircraft: 'Boeing 777-300ER', frequency: 'daily' },
    { airline: 'Delta Air Lines', iata: 'DL', flight_number: '1', time: '17:30', duration: '8h 15m', price: 51000, aircraft: 'Airbus A330-900', frequency: 'daily' },
    { airline: 'British Airways', iata: 'BA', flight_number: '179', time: '21:00', duration: '8h 00m', price: 53000, aircraft: 'Boeing 777-200', frequency: 'daily' }
  ],
  'SIN-HKG': [
    { airline: 'Singapore Airlines', iata: 'SQ', flight_number: '880', time: '08:45', duration: '3h 55m', price: 12000, aircraft: 'Airbus A350-900', frequency: 'daily' },
    { airline: 'Cathay Pacific', iata: 'CX', flight_number: '650', time: '11:30', duration: '4h 00m', price: 11000, aircraft: 'Airbus A330-300', frequency: 'daily' },
    { airline: 'Singapore Airlines', iata: 'SQ', flight_number: '896', time: '15:15', duration: '3h 55m', price: 12500, aircraft: 'Boeing 777-300ER', frequency: 'daily' },
    { airline: 'Cathay Pacific', iata: 'CX', flight_number: '714', time: '19:00', duration: '4h 00m', price: 11500, aircraft: 'Boeing 777-300ER', frequency: 'daily' }
  ]
};

// 3. AIRPORT DATABASE
const AIRPORT_DATABASE = {
  // India
  'DEL': { name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India', type: 'international' },
  'BOM': { name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', type: 'international' },
  'BLR': { name: 'Kempegowda International Airport', city: 'Bengaluru', country: 'India', type: 'international' },
  'HYD': { name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', type: 'international' },
  'MAA': { name: 'Chennai International Airport', city: 'Chennai', country: 'India', type: 'international' },
  'COK': { name: 'Cochin International Airport', city: 'Kochi', country: 'India', type: 'international' },
  'CCU': { name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', country: 'India', type: 'international' },
  'AMD': { name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India', type: 'international' },
  'PNQ': { name: 'Pune Airport', city: 'Pune', country: 'India', type: 'domestic' },
  'GOI': { name: 'Dabolim Airport', city: 'Goa', country: 'India', type: 'international' },
  
  // Middle East
  'DXB': { name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', type: 'international' },
  'DOH': { name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', type: 'international' },
  'AUH': { name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'UAE', type: 'international' },
  'KWI': { name: 'Kuwait International Airport', city: 'Kuwait', country: 'Kuwait', type: 'international' },
  
  // Europe
  'LHR': { name: 'London Heathrow Airport', city: 'London', country: 'UK', type: 'international' },
  'CDG': { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', type: 'international' },
  'FRA': { name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', type: 'international' },
  'AMS': { name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', type: 'international' },
  
  // Asia Pacific
  'SIN': { name: 'Changi Airport', city: 'Singapore', country: 'Singapore', type: 'international' },
  'HKG': { name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', type: 'international' },
  'NRT': { name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', type: 'international' },
  'ICN': { name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', type: 'international' },
  'BKK': { name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', type: 'international' },
  
  // Americas
  'JFK': { name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', type: 'international' },
  'LAX': { name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', type: 'international' },
  'ORD': { name: "O'Hare International Airport", city: 'Chicago', country: 'USA', type: 'international' },
  'YYZ': { name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', type: 'international' }
};

// 4. API INTEGRATION FUNCTIONS
async function fetchLiveFlightData(fromIata, toIata, date) {
  // AviationStack API (Free tier: 500 requests/month)
  try {
    const apiKey = process.env.AVIATIONSTACK_API_KEY || 'YOUR_API_KEY';
    const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${fromIata}&arr_iata=${toIata}&flight_date=${date}&limit=20`;
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return transformAviationStackData(data);
    }
  } catch (error) {
    console.log('AviationStack API unavailable');
  }
  
  // AeroDataBox API (Free tier: 500 requests/month)
  try {
    const apiKey = process.env.AERODATABOX_API_KEY || 'YOUR_API_KEY';
    const url = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${fromIata}/${date}T00:00/${date}T23:59?withLeg=true&direction=departure&withCancelled=false&withCargo=false&withPrivate=false`;
    
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return transformAeroDataBoxData(data, toIata);
    }
  } catch (error) {
    console.log('AeroDataBox API unavailable');
  }
  
  return null;
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
      city: flight.departure.city || flight.departure.iata,
      time: flight.departure.scheduled?.split(' ')[1] || '00:00',
      terminal: flight.departure.terminal || '1'
    },
    arrival: {
      airport: flight.arrival.airport,
      iata: flight.arrival.iata,
      city: flight.arrival.city || flight.arrival.iata,
      time: flight.arrival.scheduled?.split(' ')[1] || '00:00',
      terminal: flight.arrival.terminal || '1'
    },
    duration: calculateDurationFromTimes(flight.departure.scheduled, flight.arrival.scheduled),
    price: generateDynamicPricing(flight.airline.iata, flight.departure.iata, flight.arrival.iata),
    currency: "INR",
    stops: 0,
    aircraft: flight.aircraft?.iata || "A320"
  }));
}

function transformAeroDataBoxData(apiData, destinationIata) {
  return apiData
    .filter(flight => flight.arrival?.airport?.iata === destinationIata)
    .map(flight => ({
      id: `${flight.airline.iata}-${flight.flightNumber}`,
      airline: flight.airline.name,
      iata: flight.airline.iata,
      flight_number: flight.flightNumber,
      departure: {
        airport: flight.departure.airport.name,
        iata: flight.departure.airport.iata,
        city: flight.departure.airport.shortName,
        time: flight.departure.scheduledTime.local?.split('T')[1]?.substring(0, 5) || '00:00',
        terminal: flight.departure.terminal || '1'
      },
      arrival: {
        airport: flight.arrival.airport.name,
        iata: flight.arrival.airport.iata,
        city: flight.arrival.airport.shortName,
        time: flight.arrival.scheduledTime.local?.split('T')[1]?.substring(0, 5) || '00:00',
        terminal: flight.arrival.terminal || '1'
      },
      duration: formatDuration(flight.flightDuration?.minutes || 120),
      price: generateDynamicPricing(flight.airline.iata, flight.departure.airport.iata, flight.arrival.airport.iata),
      currency: "INR",
      stops: 0,
      aircraft: flight.aircraft?.model || "A320"
    }));
}

// 5. REALISTIC MOCK DATA GENERATOR
function generateRealisticFlights(fromIata, toIata, date) {
  const routeKey = `${fromIata}-${toIata}`;
  const reverseRouteKey = `${toIata}-${fromIata}`;
  
  let routeData = ROUTE_DATABASE[routeKey];
  
  // If reverse route exists, create return flights
  if (!routeData && ROUTE_DATABASE[reverseRouteKey]) {
    routeData = ROUTE_DATABASE[reverseRouteKey].map(flight => ({
      ...flight,
      flight_number: generateReturnFlightNumber(flight.flight_number),
      time: generateReturnTime(flight.time, flight.duration)
    }));
  }
  
  // If no specific route data, generate generic flights
  if (!routeData) {
    routeData = generateGenericRouteFlights(fromIata, toIata);
  }
  
  return routeData.map((flight, index) => {
    const arrivalTime = calculateArrivalTime(flight.time, flight.duration);
    const fromAirport = AIRPORT_DATABASE[fromIata] || { name: `${fromIata} Airport`, city: fromIata, country: 'Unknown', type: 'international' };
    const toAirport = AIRPORT_DATABASE[toIata] || { name: `${toIata} Airport`, city: toIata, country: 'Unknown', type: 'international' };
    
    return {
      id: `${flight.iata}-${flight.flight_number}`,
      airline: flight.airline,
      iata: flight.iata,
      flight_number: flight.flight_number,
      departure: {
        airport: fromAirport.name,
        iata: fromIata,
        city: fromAirport.city,
        country: fromAirport.country,
        time: flight.time,
        terminal: flight.iata === 'AI' || flight.iata === 'UK' ? '3' : flight.iata === '6E' ? '2' : '1'
      },
      arrival: {
        airport: toAirport.name,
        iata: toIata,
        city: toAirport.city,
        country: toAirport.country,
        time: arrivalTime,
        terminal: toIata === 'DEL' || toIata === 'BOM' ? '3' : '1'
      },
      duration: flight.duration,
      price: adjustPriceForDate(flight.price, date),
      currency: "INR",
      stops: 0,
      aircraft: flight.aircraft,
      flight_type: fromAirport.country === toAirport.country ? 'domestic' : 'international'
    };
  });
}

function generateGenericRouteFlights(fromIata, toIata) {
  const airlines = ['Air India', 'IndiGo', 'Emirates', 'Singapore Airlines', 'British Airways'];
  const baseAirlines = ['AI', '6E', 'EK', 'SQ', 'BA'];
  
  return airlines.map((airline, index) => {
    const iata = baseAirlines[index];
    const baseTime = 6 + index * 2;
    const distance = calculateDistance(fromIata, toIata);
    const duration = estimateFlightDuration(distance);
    const price = estimateFlightPrice(iata, distance);
    
    return {
      airline: airline,
      iata: iata,
      flight_number: Math.floor(Math.random() * 900) + 100,
      time: `${baseTime.toString().padStart(2, '0')}:30`,
      duration: duration,
      price: price,
      aircraft: iata === 'EK' ? 'Boeing 777-300ER' : iata === 'SQ' ? 'Airbus A350-900' : 'Airbus A320neo'
    };
  });
}

// 6. UTILITY FUNCTIONS
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

function calculateArrivalTime(departureTime, duration) {
  const [depHours, depMinutes] = departureTime.split(':').map(Number);
  const [durHours, durMinutes] = duration.replace('h ', ':').replace('m', '').split(':').map(Number);
  
  const totalMinutes = depHours * 60 + depMinutes + durHours * 60 + durMinutes;
  const arrHours = Math.floor(totalMinutes / 60) % 24;
  const arrMinutes = totalMinutes % 60;
  
  return `${arrHours.toString().padStart(2, '0')}:${arrMinutes.toString().padStart(2, '0')}`;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function calculateDurationFromTimes(departureTime, arrivalTime) {
  if (!departureTime || !arrivalTime) return '2h 30m';
  
  const dep = new Date(departureTime);
  const arr = new Date(arrivalTime);
  const diff = arr - dep;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

function generateDynamicPricing(airlineIata, fromIata, toIata) {
  const basePrices = {
    'AI': 8000, '6E': 6000, 'SG': 5500, 'IX': 5000, 'QP': 4500, 'UK': 9000, 'I5': 4000,
    'EK': 25000, 'QR': 22000, 'EY': 20000, 'SQ': 28000, 'LH': 35000, 'BA': 38000,
    'AF': 32000, 'KL': 30000, 'DL': 45000, 'UA': 42000, 'AA': 43000
  };
  
  const distance = calculateDistance(fromIata, toIata);
  const multiplier = distance / 1000;
  const basePrice = basePrices[airlineIata] || 8000;
  
  return Math.round(basePrice * multiplier);
}

function calculateDistance(fromIata, toIata) {
  // Simplified distance calculation (would use real coordinates in production)
  const distances = {
    'DEL-BOM': 1400, 'DEL-BLR': 1700, 'BOM-HYD': 700, 'DEL-DXB': 2200,
    'BOM-LHR': 7200, 'DEL-SIN': 4100, 'DXB-LHR': 5500, 'LHR-JFK': 5600,
    'SIN-HKG': 2600
  };
  
  return distances[`${fromIata}-${toIata}`] || distances[`${toIata}-${fromIata}`] || 2000;
}

function estimateFlightDuration(distance) {
  const avgSpeed = 850; // km/h average speed
  const hours = distance / avgSpeed;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

function estimateFlightPrice(airlineIata, distance) {
  const pricePerKm = {
    'AI': 6, '6E': 4, 'SG': 3.5, 'IX': 3, 'QP': 2.5, 'UK': 7,
    'EK': 12, 'QR': 10, 'SQ': 14, 'LH': 15, 'BA': 16
  };
  
  const rate = pricePerKm[airlineIata] || 5;
  return Math.round(distance * rate);
}

function adjustPriceForDate(basePrice, date) {
  const today = new Date();
  const travelDate = new Date(date);
  const daysUntilTravel = Math.ceil((travelDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilTravel < 7) return Math.round(basePrice * 1.3);
  if (daysUntilTravel < 14) return Math.round(basePrice * 1.15);
  if (daysUntilTravel < 30) return Math.round(basePrice * 1.05);
  return basePrice;
}

// 7. MAIN SEARCH FUNCTION
async function searchFlights(fromIata, toIata, date, passengers = 1) {
  // Try live data first
  let flights = await fetchLiveFlightData(fromIata, toIata, date);
  
  // Fallback to realistic mock data
  if (!flights || flights.length === 0) {
    flights = generateRealisticFlights(fromIata, toIata, date);
  }
  
  // Adjust for passenger count
  return flights.map(flight => ({
    ...flight,
    price: flight.price * passengers,
    passengers: passengers
  }));
}

// 8. RENDERING FUNCTIONS
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
  const isInternational = flight.flight_type === 'international';
  
  return `
    <div class="flight-card ${isInternational ? 'international' : 'domestic'}">
      <div class="flight-header">
        <div class="airline-info">
          ${logoHTML}
          <div class="flight-details">
            <div class="airline-name">${flight.airline}</div>
            <div class="flight-number">${flight.iata}-${flight.flight_number}</div>
            <div class="flight-type">${isInternational ? 'International' : 'Domestic'}</div>
          </div>
        </div>
        <div class="price-section">
          <div class="price">₹${flight.price.toLocaleString('en-IN')}</div>
          <div class="price-label">per person</div>
        </div>
      </div>
      
      <div class="flight-route">
        <div class="departure">
          <div class="time">${flight.departure.time}</div>
          <div class="city">${flight.departure.iata}</div>
          <div class="airport">${flight.departure.city}</div>
          <div class="terminal">Terminal ${flight.departure.terminal}</div>
        </div>
        
        <div class="flight-path">
          <div class="duration">${flight.duration}</div>
          <div class="stops">Non-stop</div>
          <div class="aircraft">${flight.aircraft}</div>
        </div>
        
        <div class="arrival">
          <div class="time">${flight.arrival.time}</div>
          <div class="city">${flight.arrival.iata}</div>
          <div class="airport">${flight.arrival.city}</div>
          <div class="terminal">Terminal ${flight.arrival.terminal}</div>
        </div>
      </div>
      
      <div class="flight-footer">
        <div class="country-info">${flight.departure.country} → ${flight.arrival.country}</div>
        <button class="book-btn" onclick="bookFlight('${flight.id}')">Book Now</button>
      </div>
    </div>
  `;
}

// Export for use in main application
window.FlightSystem = {
  searchFlights,
  renderFlightCardHTML,
  renderAirlineLogoHTML,
  AIRLINE_MAPPING,
  AIRPORT_DATABASE,
  ROUTE_DATABASE
};
