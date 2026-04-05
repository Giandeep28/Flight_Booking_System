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

function generateLogoUrl(iataCode) {
  return `https://content.airhex.com/content/logos/airlines_${iataCode}_350_100_r.png`;
}
