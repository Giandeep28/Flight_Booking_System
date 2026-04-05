// Airline Logo System - Production Ready
// Maps airline names to IATA codes and handles dynamic logo loading

const AIRLINE_DATA = {
    'Air India': 'AI',
    'IndiGo': '6E',
    'SpiceJet': 'SG',
    'Akasa Air': 'QP',
    'AirAsia India': 'I5',
    'Go First': 'G8'
};

// Get airline logo URL with fallback
function getAirlineLogoUrl(airlineName, airlineCode) {
    const baseUrl = 'https://content.airhex.com/content/logos/airlines_';
    const logoUrl = `${baseUrl}${airlineCode}_350_100_r.png`;
    return logoUrl;
}

// Create fallback logo SVG
function createFallbackLogo(airlineName) {
    const svg = `
        <svg width="350" height="100" viewBox="0 0 350 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="350" height="100" fill="#F0F4F8"/>
            <text x="175" y="55" font-family="Arial, sans-serif" font-size="14" fill="#0066CC" text-anchor="middle">${airlineName}</text>
        </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Handle logo loading with error fallback
function loadAirlineLogo(airlineName, airlineCode, imgElement) {
    const logoUrl = getAirlineLogoUrl(airlineName, airlineCode);
    const fallbackUrl = createFallbackLogo(airlineName);
    
    imgElement.src = logoUrl;
    imgElement.onerror = function() {
        this.onerror = null;
        this.src = fallbackUrl;
        this.style.opacity = '0.7';
        console.warn(`Failed to load logo for ${airlineName}, using fallback`);
    };
    imgElement.onload = function() {
        console.log(`Successfully loaded logo for ${airlineName}`);
    };
}

// Get airline code from name
function getAirlineCode(airlineName) {
    return AIRLINE_DATA[airlineName] || 'XX';
}

// Validate airline data
function validateAirlineData(airlineName, airlineCode) {
    if (!airlineName || !airlineCode) {
        console.error('Missing airline name or code');
        return false;
    }
    
    if (!AIRLINE_DATA[airlineName]) {
        console.warn(`Unknown airline: ${airlineName}`);
        return false;
    }
    
    return true;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AIRLINE_DATA,
        getAirlineLogoUrl,
        createFallbackLogo,
        loadAirlineLogo,
        getAirlineCode,
        validateAirlineData
    };
}

// Example usage:
/*
// In your flight card creation:
const imgElement = document.createElement('img');
imgElement.className = 'airline-logo';
imgElement.alt = airlineName;
loadAirlineLogo(airlineName, airlineCode, imgElement);
container.appendChild(imgElement);
*/
