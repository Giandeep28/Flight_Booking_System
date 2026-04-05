// Flight Data Loader
async function loadFlightData() {
  try {
    // Try to load from API first (if available)
    const response = await fetch('https://api.aviationstack.com/v1/flights?access_key=YOUR_API_KEY&limit=10');
    if (response.ok) {
      const data = await response.json();
      return transformApiData(data);
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }
  
  // Fallback to realistic mock data
  return getMockFlightData();
}

function getMockFlightData() {
  return {
    flights: [
      {
        id: "AI-647",
        airline: "Air India",
        iata: "AI",
        flight_number: "647",
        departure: { airport: "Indira Gandhi International Airport", iata: "DEL", city: "New Delhi", time: "06:30", terminal: "3" },
        arrival: { airport: "Chhatrapati Shivaji Maharaj International Airport", iata: "BOM", city: "Mumbai", time: "08:45", terminal: "2" },
        duration: "2h 15m", price: 4500, currency: "INR", stops: 0, aircraft: "Airbus A320neo"
      },
      {
        id: "6E-2174",
        airline: "IndiGo", 
        iata: "6E",
        flight_number: "2174",
        departure: { airport: "Indira Gandhi International Airport", iata: "DEL", city: "New Delhi", time: "08:15", terminal: "2" },
        arrival: { airport: "Kempegowda International Airport", iata: "BLR", city: "Bengaluru", time: "10:50", terminal: "1" },
        duration: "2h 35m", price: 3800, currency: "INR", stops: 0, aircraft: "Airbus A320"
      },
      {
        id: "SG-815",
        airline: "SpiceJet",
        iata: "SG", 
        flight_number: "815",
        departure: { airport: "Chhatrapati Shivaji Maharaj International Airport", iata: "BOM", city: "Mumbai", time: "09:00", terminal: "2" },
        arrival: { airport: "Rajiv Gandhi International Airport", iata: "HYD", city: "Hyderabad", time: "10:45", terminal: "1" },
        duration: "1h 45m", price: 3200, currency: "INR", stops: 0, aircraft: "Boeing 737-800"
      },
      {
        id: "IX-1348",
        airline: "Air India Express",
        iata: "IX",
        flight_number: "1348", 
        departure: { airport: "Kempegowda International Airport", iata: "BLR", city: "Bengaluru", time: "10:30", terminal: "1" },
        arrival: { airport: "Cochin International Airport", iata: "COK", city: "Kochi", time: "12:30", terminal: "1" },
        duration: "2h 00m", price: 2800, currency: "INR", stops: 0, aircraft: "Boeing 737-800"
      },
      {
        id: "QP-1152",
        airline: "Akasa Air",
        iata: "QP",
        flight_number: "1152",
        departure: { airport: "Rajiv Gandhi International Airport", iata: "HYD", city: "Hyderabad", time: "11:45", terminal: "1" },
        arrival: { airport: "Chennai International Airport", iata: "MAA", city: "Chennai", time: "13:15", terminal: "1" },
        duration: "1h 30m", price: 2500, currency: "INR", stops: 0, aircraft: "Boeing 737 MAX"
      },
      {
        id: "9I-623",
        airline: "Alliance Air",
        iata: "9I",
        flight_number: "623",
        departure: { airport: "Chennai International Airport", iata: "MAA", city: "Chennai", time: "13:30", terminal: "1" },
        arrival: { airport: "Bengaluru International Airport", iata: "BLR", city: "Bengaluru", time: "14:45", terminal: "1" },
        duration: "1h 15m", price: 2200, currency: "INR", stops: 0, aircraft: "ATR 72-600"
      },
      {
        id: "S5-142",
        airline: "Star Air",
        iata: "S5",
        flight_number: "142",
        departure: { airport: "Kempegowda International Airport", iata: "BLR", city: "Bengaluru", time: "15:00", terminal: "1" },
        arrival: { airport: "Belgaum Airport", iata: "IXG", city: "Belgaum", time: "16:00", terminal: "1" },
        duration: "1h 00m", price: 1800, currency: "INR", stops: 0, aircraft: "Embraer E175"
      }
    ],
    airports: {
      "DEL": { name: "Indira Gandhi International Airport", city: "New Delhi", country: "India" },
      "BOM": { name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
      "BLR": { name: "Kempegowda International Airport", city: "Bengaluru", country: "India" },
      "HYD": { name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" },
      "MAA": { name: "Chennai International Airport", city: "Chennai", country: "India" },
      "COK": { name: "Cochin International Airport", city: "Kochi", country: "India" },
      "IXG": { name: "Belgaum Airport", city: "Belgaum", country: "India" }
    }
  };
}

function transformApiData(apiData) {
  // Transform external API data to our format
  return apiData;
}
