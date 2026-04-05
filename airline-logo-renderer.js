// HTML Template Rendering
function renderAirlineLogoHTML(airlineName, className = "airline-logo", altText = null) {
  const logoData = getAirlineLogoUrl(airlineName);
  
  if (!logoData) {
    return `<img src="https://pics.avs.io/200/50/DEFAULT.png" alt="${altText || airlineName}" class="${className}" />`;
  }
  
  return `<img src="${logoData.logo_url}" 
               alt="${altText || airlineName}" 
               class="${className}" 
               onerror="this.onerror=null; this.src='${logoData.fallback_url}'; console.error('Logo failed for ${logoData.iata_code}');"
               loading="lazy" />`;
}

// React Component
function AirlineLogoReact({ airlineName, className = "airline-logo", alt }) {
  const logoData = getAirlineLogoUrl(airlineName);
  
  if (!logoData) {
    return <img src="https://pics.avs.io/200/50/DEFAULT.png" alt={alt || airlineName} className={className} />;
  }
  
  return (
    <img 
      src={logoData.logo_url}
      alt={alt || airlineName}
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = logoData.fallback_url;
        console.error(`Logo failed for ${logoData.iata_code}`);
      }}
      loading="lazy"
    />
  );
}

// Vanilla JS DOM Element Creation
function createAirlineLogoElement(airlineName, className = "airline-logo", altText = null) {
  const logoData = getAirlineLogoUrl(airlineName);
  
  const img = document.createElement('img');
  img.alt = altText || airlineName || 'Airline Logo';
  img.className = className;
  img.loading = 'lazy';
  
  if (logoData) {
    img.src = logoData.logo_url;
    img.onerror = function() {
      this.onerror = null;
      this.src = logoData.fallback_url;
      console.error(`Logo failed for ${logoData.iata_code}`);
    };
  } else {
    img.src = 'https://pics.avs.io/200/50/DEFAULT.png';
  }
  
  return img;
}

// Flight Card HTML Template
function renderFlightCardHTML(flight) {
  const logoHTML = renderAirlineLogoHTML(flight.airline, "airline-logo", flight.airline);
  
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
          <div class="stops">${flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
        </div>
        
        <div class="arrival">
          <div class="time">${flight.arrival.time}</div>
          <div class="city">${flight.arrival.iata}</div>
          <div class="airport">${flight.arrival.city}</div>
        </div>
      </div>
      
      <div class="flight-footer">
        <div class="aircraft">${flight.aircraft}</div>
        <button class="book-btn">Book Now</button>
      </div>
    </div>
  `;
}
