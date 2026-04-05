// HTML Image Rendering
function renderAirlineLogo(airlineName, className = "airline-logo") {
  const { iata_code, logo_url, fallback_url } = getAirlineLogo(airlineName);
  
  return `<img src="${logo_url}" 
               alt="${airlineName}" 
               class="${className}" 
               onerror="this.onerror=null; this.src='${fallback_url}'; console.error('Logo failed for ${iata_code}');">`;
}

// React Component
function AirlineLogo({ airlineName, className = "airline-logo" }) {
  const { iata_code, logo_url, fallback_url } = getAirlineLogo(airlineName);
  
  return (
    <img 
      src={logo_url}
      alt={airlineName}
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallback_url;
        console.error(`Logo failed for ${iata_code}`);
      }}
    />
  );
}

// Vanilla JS DOM Creation
function createAirlineLogoElement(airlineName, className = "airline-logo") {
  const { iata_code, logo_url, fallback_url } = getAirlineLogo(airlineName);
  
  const img = document.createElement('img');
  img.src = logo_url;
  img.alt = airlineName;
  img.className = className;
  img.onerror = function() {
    this.onerror = null;
    this.src = fallback_url;
    console.error(`Logo failed for ${iata_code}`);
  };
  
  return img;
}
