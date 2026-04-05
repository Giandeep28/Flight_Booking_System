function getAirlineLogoUrl(airlineName) {
  const cleanName = String(airlineName || '').toLowerCase().trim();
  const iata = AIRLINE_IATA_MAPPING[cleanName];
  
  if (!iata) {
    console.warn(`No IATA code found for airline: ${airlineName}`);
    return null;
  }
  
  const logoUrl = `https://content.airhex.com/content/logos/airlines_${iata}_350_100_r.png`;
  const fallbackUrl = `https://pics.avs.io/200/50/${iata}.png`;
  
  return {
    airline: airlineName,
    iata_code: iata,
    logo_url: logoUrl,
    fallback_url: fallbackUrl
  };
}

function generateLogoUrlByIata(iataCode) {
  if (!iataCode || typeof iataCode !== 'string') {
    console.warn('Invalid IATA code provided');
    return null;
  }
  
  const upperIata = iataCode.toUpperCase().trim();
  const logoUrl = `https://content.airhex.com/content/logos/airlines_${upperIata}_350_100_r.png`;
  const fallbackUrl = `https://pics.avs.io/200/50/${upperIata}.png`;
  
  return {
    iata_code: upperIata,
    airline: IATA_AIRLINE_MAPPING[upperIata] || 'Unknown Airline',
    logo_url: logoUrl,
    fallback_url: fallbackUrl
  };
}

function getAirlineNameByIata(iataCode) {
  return IATA_AIRLINE_MAPPING[iataCode?.toUpperCase()] || null;
}
