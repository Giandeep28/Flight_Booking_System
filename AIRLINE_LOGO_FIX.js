// FIXED AIRLINE LOGO SYSTEM - Production Ready

// CORRECT IATA MAPPING
const AIRLINE_IATA_MAP = {
    'Air India': 'AI',
    'IndiGo': '6E',
    'SpiceJet': 'SG',
    'Akasa Air': 'QP',
    'AirAsia India': 'I5',
    'Go First': 'G8'
};

// 1. GET CORRECT LOGO URL
function getAirlineLogoUrl(airlineName, fallbackCode = 'AI') {
    const code = AIRLINE_IATA_MAP[airlineName] || fallbackCode;
    const url = `https://content.airhex.com/content/logos/airlines_${code}_350_100_r.png`;
    console.log(`[LOGO] ${airlineName} → ${code} → ${url}`);
    return url;
}

// 2. CREATE IMG ELEMENT WITH FALLBACK
function createAirlineLogoImg(airlineName, className = 'airline-logo') {
    const img = document.createElement('img');
    const logoUrl = getAirlineLogoUrl(airlineName);
    
    img.src = logoUrl;
    img.alt = airlineName;
    img.className = className;
    img.style.cssText = 'width:80px;height:24px;object-fit:contain;';
    
    // FALLBACK CHAIN: AirHex → Public CDN → Text
    img.onerror = function() {
        console.warn(`[FALLBACK] AirHex failed for ${airlineName}, trying public CDN`);
        this.onerror = function() {
            console.error(`[FALLBACK] Public CDN failed for ${airlineName}, using text`);
            this.onerror = null;
            this.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="80" height="24" viewBox="0 0 80 24" xmlns="http://www.w3.org/2000/svg">
                    <rect width="80" height="24" fill="#f0f4f8"/>
                    <text x="40" y="16" font-family="Arial" font-size="10" fill="#0066cc" text-anchor="middle">${airlineName.substring(0, 8)}</text>
                </svg>
            `)}`;
            this.style.opacity = '0.7';
        };
        this.src = `https://pics.avs.io/200/50/${AIRLINE_IATA_MAP[airlineName] || 'AI'}.png`;
        this.style.filter = 'brightness(0.9) contrast(1.1)';
    };
    
    img.onload = function() {
        console.log(`[SUCCESS] Loaded logo for ${airlineName}`);
    };
    
    return img;
}

// 3. REACT COMPONENT (if using React)
function AirlineLogo({ airlineName, className = "airline-logo" }) {
    const logoUrl = getAirlineLogoUrl(airlineName);
    const iataCode = AIRLINE_IATA_MAP[airlineName] || 'AI';
    
    return `
        <img 
            src="${logoUrl}"
            alt="${airlineName}"
            className="${className}"
            style="width:80px;height:24px;object-fit:contain;"
            onerror="console.error('AirHex failed for ${airlineName}'); this.onerror=null; this.src='https://pics.avs.io/200/50/${iataCode}.png'; this.style.filter='brightness(0.9) contrast(1.1)';"
            onload="console.log('Loaded logo for ${airlineName}');"
        />
    `;
}

// 4. HTML USAGE
// <div id="logo-container"></div>
// document.getElementById('logo-container').appendChild(createAirlineLogoImg('Air India'));

// 5. DEBUG FUNCTION
function debugAirlineLogos() {
    Object.entries(AIRLINE_IATA_MAP).forEach(([name, code]) => {
        const url = getAirlineLogoUrl(name);
        console.log(`[DEBUG] ${name}: ${code} → ${url}`);
    });
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AIRLINE_IATA_MAP,
        getAirlineLogoUrl,
        createAirlineLogoImg,
        AirlineLogo,
        debugAirlineLogos
    };
}
