/**
 * SKYVOYAGE — Shared Page Template System
 * Provides consistent navbar, footer, and styling across all sub-pages.
 * This avoids code duplication and ensures brand consistency.
 */

/* ============================================
 * CENTRALIZED ROUTE MAP (Single Source of Truth)
 * ============================================ */
const ROUTES = {
    // Home
    'home':              '/skyvoyage-complete.html',
    
    // Flights
    'flights-oneway':    '/pages/flights/one-way.html',
    'flights-roundtrip': '/pages/flights/round-trip.html',
    'flights-multicity': '/pages/flights/multi-city.html',
    'flights-charter':   '/pages/flights/charter.html',
    'flights-status':    '/pages/flights/status.html',
    'flights-intl':      '/pages/flights/international.html',
    'flights-domestic':  '/pages/flights/domestic.html',

    // Booking Hub
    'booking':           '/pages/booking/index.html',
    'booking-manage':    '/pages/booking/manage.html',
    'booking-checkin':   '/pages/booking/check-in.html',
    'booking-reschedule':'/pages/booking/reschedule.html',
    'booking-meals':     '/pages/booking/meals.html',
    'booking-assist':    '/pages/booking/special-assistance.html',
    'booking-baggage':   '/pages/booking/add-baggage.html',
    'booking-seats':     '/pages/booking/seats.html',

    // Member Offers
    'offers':            '/pages/offers/index.html',
    'offers-student':    '/pages/offers/student.html',
    'offers-senior':     '/pages/offers/senior.html',
    'offers-armed':      '/pages/offers/armed-forces.html',
    'offers-festive':    '/pages/offers/festive.html',

    // Help & Support
    'help':              '/pages/help/index.html',
    'help-baggage':      '/pages/help/baggage.html',
    'help-refund':       '/pages/help/refund.html',
    'help-assist':       '/pages/help/special-assistance.html',
    'help-privacy':      '/pages/help/privacy.html',

    // Flight Services (Footer)
    'svc-intl':          '/pages/flights/international.html',
    'svc-domestic':      '/pages/flights/domestic.html',
    'svc-status':        '/pages/flights/status.html',
    'svc-checkin':       '/pages/booking/check-in.html',
    'svc-cargo':         '/pages/services/cargo.html',

    // Fallback
    'coming-soon':       '/pages/coming-soon.html'
};


/* ============================================
 * DEBOUNCE / RAPID-CLICK PROTECTION
 * ============================================ */
let _isNavigating = false;
const DEBOUNCE_MS = 500;

/**
 * Universal Navigation Handler
 * Opens the target page in a new window with rapid-click protection.
 * @param {string} pageKey - A key from the ROUTES map
 */
function openPage(pageKey) {
    // Rapid-click guard
    if (_isNavigating) return;
    _isNavigating = true;
    setTimeout(() => { _isNavigating = false; }, DEBOUNCE_MS);

    const url = ROUTES[pageKey];
    if (url) {
        window.open(url, '_blank');
    } else {
        console.warn(`[SkyVoyage] Route not found for key: "${pageKey}". Opening Coming Soon.`);
        window.open(ROUTES['coming-soon'], '_blank');
    }
}


/* ============================================
 * NAVBAR COMPONENT
 * ============================================ */
function renderNavbar(activePage) {
    return `
    <header id="sv-header">
        <nav class="container">
            <a href="/skyvoyage-complete.html" class="logo">
                <div class="logo-icon">✈️</div>
                <span>SKYVOYAGE</span>
            </a>
            
            <ul class="nav-links">
                <li class="nav-item">
                    <a href="#" class="${activePage === 'flights' ? 'active' : ''}">Flights <i class="fas fa-chevron-down" style="font-size: 0.6rem; margin-left: 5px;"></i></a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Flight Services</h4>
                                <ul class="mega-links">
                                    <li><a href="#" onclick="openPage('flights-oneway'); return false;"><i class="fas fa-plane-departure"></i> One-Way Flights</a></li>
                                    <li><a href="#" onclick="openPage('flights-roundtrip'); return false;"><i class="fas fa-sync-alt"></i> Round-Trip Flights</a></li>
                                    <li><a href="#" onclick="openPage('flights-multicity'); return false;"><i class="fas fa-random"></i> Multi-City Routes</a></li>
                                    <li><a href="#" onclick="openPage('flights-charter'); return false;"><i class="fas fa-users-viewfinder"></i> Charter Special</a></li>
                                </ul>
                            </div>
                            <div class="mega-col">
                                <h4>Domestic Routes</h4>
                                <ul class="mega-links">
                                    <li><a href="#" onclick="openPage('flights-domestic'); return false;"><i class="fas fa-city"></i> Delhi to Mumbai</a></li>
                                    <li><a href="#" onclick="openPage('flights-domestic'); return false;"><i class="fas fa-city"></i> Bengaluru to Delhi</a></li>
                                    <li><a href="#" onclick="openPage('flights-domestic'); return false;"><i class="fas fa-city"></i> Mumbai to Goa</a></li>
                                    <li><a href="#" onclick="openPage('flights-domestic'); return false;"><i class="fas fa-city"></i> Chennai to Kolkata</a></li>
                                </ul>
                            </div>
                            <div class="mega-col">
                                <h4>International Hubs</h4>
                                <ul class="mega-links">
                                    <li><a href="#" onclick="openPage('flights-intl'); return false;"><i class="fas fa-globe"></i> London Heathrow</a></li>
                                    <li><a href="#" onclick="openPage('flights-intl'); return false;"><i class="fas fa-globe"></i> Dubai International</a></li>
                                    <li><a href="#" onclick="openPage('flights-intl'); return false;"><i class="fas fa-globe"></i> Singapore Changi</a></li>
                                    <li><a href="#" onclick="openPage('flights-intl'); return false;"><i class="fas fa-globe"></i> New York JFK</a></li>
                                </ul>
                            </div>
                            <div class="mega-col" style="background: rgba(197, 160, 89, 0.05); padding: 2rem; border-radius: 16px;">
                                <h4>SKYPRIORITY</h4>
                                <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.5rem;">Unlock premium lounge access and priority boarding with our loyalty tier.</p>
                                <button class="btn btn-primary" style="width: 100%;" onclick="openPage('coming-soon')">UPGRADE NOW</button>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="${activePage === 'booking' ? 'active' : ''}">Booking Hub <i class="fas fa-chevron-down" style="font-size: 0.6rem; margin-left: 5px;"></i></a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Manage Travel</h4>
                                <ul class="mega-links">
                                    <li><a href="#" onclick="openPage('booking-manage'); return false;"><i class="fas fa-search"></i> Check Booking PNR</a></li>
                                    <li><a href="#" onclick="openPage('booking-checkin'); return false;"><i class="fas fa-user-check"></i> Online Check-In</a></li>
                                    <li><a href="#" onclick="openPage('booking-reschedule'); return false;"><i class="fas fa-calendar-alt"></i> Reschedule Flight</a></li>
                                </ul>
                            </div>
                            <div class="mega-col">
                                <h4>Service Requests</h4>
                                <ul class="mega-links">
                                    <li><a href="#" onclick="openPage('booking-meals'); return false;"><i class="fas fa-utensils"></i> Meal Preferences</a></li>
                                    <li><a href="#" onclick="openPage('booking-assist'); return false;"><i class="fas fa-wheelchair"></i> Special Assistance</a></li>
                                    <li><a href="#" onclick="openPage('booking-baggage'); return false;"><i class="fas fa-suitcase"></i> Add Baggage</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="${activePage === 'offers' ? 'active' : ''}">Member Offers <i class="fas fa-chevron-down" style="font-size: 0.6rem; margin-left: 5px;"></i></a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Special Discounts</h4>
                                <ul class="mega-links">
                                    <li><a href="#" onclick="openPage('offers-student'); return false;"><i class="fas fa-user-graduate"></i> Student Fare</a></li>
                                    <li><a href="#" onclick="openPage('offers-senior'); return false;"><i class="fas fa-user-friends"></i> Senior Citizen</a></li>
                                    <li><a href="#" onclick="openPage('offers-armed'); return false;"><i class="fas fa-shield-alt"></i> Armed Forces</a></li>
                                    <li><a href="#" onclick="openPage('offers-festive'); return false;"><i class="fas fa-gift"></i> Festive Sale</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li><a href="#" onclick="openPage('help'); return false;" class="${activePage === 'help' ? 'active' : ''}">Help Desk</a></li>
            </ul>

            <div class="nav-actions">
                <button class="btn btn-primary" style="padding: 0.7rem 2rem;" onclick="openPage('home')">HOME</button>
            </div>
        </nav>
    </header>`;
}


/* ============================================
 * FOOTER COMPONENT
 * ============================================ */
function renderFooter() {
    return `
    <footer>
        <div class="container footer-grid">
            <div>
                <a href="/skyvoyage-complete.html" class="logo" style="margin-bottom: 2rem; display: flex;">
                    <div class="logo-icon">✈️</div>
                    <span style="font-size: 1.8rem; margin-left: 12px; font-weight: 950; letter-spacing: 2px;">SKYVOYAGE</span>
                </a>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.8; margin-bottom: 2rem;">Redefining the art of air travel with premium comfort and global connectivity. Fly the skies with elegance.</p>
                <div style="display: flex; gap: 15px;">
                    <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
            <div>
                <h4 class="footer-heading">FLIGHT SERVICES</h4>
                <ul class="footer-links">
                    <li><a href="#" onclick="openPage('svc-intl'); return false;">International Routes</a></li>
                    <li><a href="#" onclick="openPage('svc-domestic'); return false;">Domestic Hubs</a></li>
                    <li><a href="#" onclick="openPage('svc-status'); return false;">Flight Status</a></li>
                    <li><a href="#" onclick="openPage('svc-checkin'); return false;">Online Check-in</a></li>
                    <li><a href="#" onclick="openPage('svc-cargo'); return false;">Cargo Services</a></li>
                </ul>
            </div>
            <div>
                <h4 class="footer-heading">SUPPORT & HELP</h4>
                <ul class="footer-links">
                    <li><a href="#" onclick="openPage('help'); return false;">Help Desk</a></li>
                    <li><a href="#" onclick="openPage('help-baggage'); return false;">Baggage Info</a></li>
                    <li><a href="#" onclick="openPage('help-refund'); return false;">Refund Policy</a></li>
                    <li><a href="#" onclick="openPage('help-assist'); return false;">Special Assistance</a></li>
                    <li><a href="#" onclick="openPage('help-privacy'); return false;">Privacy Policy</a></li>
                </ul>
            </div>
            <div>
                <h4 class="footer-heading">SKY NEWSLETTER</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Join our elite list for early bird offers and member-only news.</p>
                <div style="display: flex; gap: 10px;">
                    <input type="email" placeholder="Email" class="newsletter-input">
                    <button class="btn btn-primary" style="padding: 0.7rem 1.2rem; border-radius: 10px;"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
        <div class="container" style="padding-top: 3rem; border-top: 1px solid var(--border); text-align: center;">
            <p style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">© 2026 SKYVOYAGE AIRLINES. ALL RIGHTS RESERVED. DESIGNED FOR EXCELLENCE.</p>
        </div>
    </footer>`;
}


/* ============================================
 * SHARED CSS FOR SUB-PAGES
 * ============================================ */
function getSharedCSS() {
    return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
        --primary: #C5A059;
        --primary-dark: #A48446;
        --secondary: #10B981;
        --dark: #000814;
        --text: #F8FAFC;
        --text-muted: #94A3B8;
        --border: rgba(255, 255, 255, 0.08);
        --glass-bg: rgba(5, 13, 28, 0.6);
        --glass-border: rgba(255, 255, 255, 0.1);
        --glow-gold: 0 0 25px rgba(197, 160, 89, 0.25);
        --nav-height: 80px;
    }

    body {
        font-family: 'Inter', sans-serif;
        background: var(--dark);
        color: var(--text);
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
    }

    .container { max-width: 1280px; margin: 0 auto; padding: 0 20px; }

    /* Header */
    header { background: rgba(5, 13, 28, 0.92); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); position: sticky !important; top: 0; z-index: 1100 !important; height: var(--nav-height); }
    nav { display: flex; justify-content: space-between; align-items: center; height: 100%; position: relative !important; z-index: 1000 !important; }
    .logo { display: flex; align-items: center; gap: 12px; font-size: 1.6rem; font-weight: 900; color: var(--text); text-decoration: none; letter-spacing: 1.5px; }
    .logo-icon { width: 45px; height: 45px; background: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: var(--glow-gold); }
    .nav-links { display: flex; gap: 2.8rem; list-style: none; height: 100%; align-items: center; }
    .nav-item { height: 100%; display: flex; align-items: center; position: static !important; cursor: pointer; }
    .nav-links>li>a { color: var(--text-muted); text-decoration: none; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s; padding: 10px 0; }
    .nav-links>li>a:hover, .nav-links>li>a.active { color: var(--primary); }

    /* Mega Menu */
    .mega-menu {
        background-color: #ffffff !important;
        background: #ffffff !important;
        opacity: 0 !important;
        visibility: hidden;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        isolation: isolate !important;
        position: absolute !important;
        top: var(--nav-height) !important;
        left: 50% !important;
        transform: translateX(-50%) translateY(10px) !important;
        width: 1200px !important;
        max-width: 95vw !important;
        z-index: 9999 !important;
        padding: 3rem 2rem;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 0 0 16px 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
        border-top: 3px solid #b8972e !important;
    }
    .nav-item:hover .mega-menu { 
        opacity: 1 !important; 
        visibility: visible !important; 
        transform: translateX(-50%) translateY(0) !important; 
        pointer-events: auto !important;
    }
    .mega-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2.5rem; }
    .mega-col h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2.5px; color: #1f2937; margin-bottom: 1.5rem; font-weight: 900; }
    .mega-links { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
    .mega-links a { color: #1e293b; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: all 0.3s; display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; }
    .mega-links a:hover { background: rgba(197, 160, 89, 0.1); color: var(--primary); transform: translateX(6px); }
    .mega-links i { font-size: 0.85rem; color: var(--primary); }

    .btn { padding: 1rem 2rem; border-radius: 14px; border: none; font-weight: 800; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-decoration: none; display: inline-flex; align-items: center; gap: 10px; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; }
    .btn-primary { background: var(--primary); color: var(--dark); box-shadow: var(--glow-gold); }
    .btn-primary:hover { background: white; transform: translateY(-3px); }

    .section-tag { background: rgba(197, 160, 89, 0.1); color: var(--primary); padding: 5px 14px; border-radius: 6px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 1rem; }

    .glass-card { background: rgba(5, 13, 28, 0.8); border: 1px solid var(--border); border-radius: 24px; transition: all 0.4s ease; }
    .glass-card:hover { box-shadow: 0 20px 50px rgba(0,0,0,0.3); }

    .input-field { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 16px; width: 100%; color: white; font-weight: 700; font-size: 1.15rem; outline: none; transition: border-color 0.3s; font-family: 'Inter', sans-serif; }
    .input-field:focus { border-color: var(--primary); background: rgba(255,255,255,0.05); }
    .input-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; display: block; }

    /* Footer */
    footer { background: #01040a; padding: 6rem 0 3rem; border-top: 1px solid var(--border); margin-top: 6rem; }
    .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 4rem; margin-bottom: 4rem; }
    .footer-heading { font-weight: 900; margin-bottom: 2rem; font-size: 0.85rem; letter-spacing: 2px; color: var(--primary); }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
    .footer-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: all 0.3s; cursor: pointer; }
    .footer-links a:hover { color: var(--primary); padding-left: 6px; }
    .social-icon { width: 45px; height: 45px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); transition: all 0.3s; text-decoration: none; }
    .social-icon:hover { background: var(--primary); color: var(--dark); }
    .newsletter-input { flex:1; background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border); padding: 1rem; border-radius: 10px; color: white; font-family: 'Inter', sans-serif; outline: none; }

    /* Page Content Area */
    .page-content { min-height: 70vh; padding: 4rem 0; }
    .page-hero { padding: 5rem 0 3rem; text-align: center; position: relative; overflow: hidden; }
    .page-hero h1 { font-size: 3.5rem; font-weight: 950; margin-bottom: 1rem; }
    .page-hero p { color: var(--text-muted); font-size: 1.15rem; max-width: 600px; margin: 0 auto; }

    /* Breadcrumb */
    .breadcrumb { display: flex; align-items: center; gap: 8px; padding: 1.5rem 0; font-size: 0.85rem; color: var(--text-muted); }
    .breadcrumb a { color: var(--primary); text-decoration: none; font-weight: 700; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb span { opacity: 0.5; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--dark); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--primary); }

    /* Feature Cards */
    .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 3rem; }
    .feature-card { padding: 3rem 2rem; text-align: center; }
    .feature-card .icon { font-size: 2.5rem; color: var(--primary); margin-bottom: 2rem; }
    .feature-card h3 { font-weight: 900; margin-bottom: 1rem; font-size: 1.1rem; }
    .feature-card p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; }

    /* Info section */
    .info-section { padding: 4rem 0; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }

    @media (max-width: 768px) {
        .mega-menu { width: 95vw; }
        .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
        .page-hero h1 { font-size: 2.5rem; }
        .info-grid { grid-template-columns: 1fr; }
    }
    `;
}


/* ============================================
 * PAGE INITIALIZATION
 * ============================================ */
function initPage(activePage) {
    // Inject navbar
    const headerSlot = document.getElementById('navbar-slot');
    if (headerSlot) headerSlot.innerHTML = renderNavbar(activePage);

    // Inject footer
    const footerSlot = document.getElementById('footer-slot');
    if (footerSlot) footerSlot.innerHTML = renderFooter();
}
