import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ServicePage } from './pages/ServicePage';
import { SupportPage } from './pages/SupportPage';

// Flight Services Routes
import InternationalRoutes from './pages/flights/InternationalRoutes';
import DomesticHubs from './pages/flights/DomesticHubs';
import FlightStatus from './pages/flights/FlightStatus';
import CheckIn from './pages/flights/CheckIn';
import CargoServices from './pages/flights/CargoServices';

// Support & Help Routes
import HelpDesk from './pages/support/HelpDesk';
import BaggageInfo from './pages/support/BaggageInfo';
import RefundPolicy from './pages/support/RefundPolicy';
import SpecialAssistance from './pages/support/SpecialAssistance';
import PrivacyPolicy from './pages/support/PrivacyPolicy';

// Page configurations for dynamic routing
const flightServices = [
  {
    path: 'international-routes',
    title: 'International Routes',
    description: 'Explore our global network connecting 150+ destinations worldwide',
    icon: 'fas fa-globe-americas',
    component: InternationalRoutes
  },
  {
    path: 'domestic-hubs',
    title: 'Domestic Hubs',
    description: 'Connect seamlessly across India with our extensive domestic network',
    icon: 'fas fa-plane-departure',
    component: DomesticHubs
  },
  {
    path: 'flight-status',
    title: 'Flight Status',
    description: 'Track real-time flight status and updates',
    icon: 'fas fa-clock',
    component: FlightStatus
  },
  {
    path: 'check-in',
    title: 'Check-In',
    description: 'Web check-in available 48 hours before departure',
    icon: 'fas fa-ticket-alt',
    component: CheckIn
  },
  {
    path: 'cargo-services',
    title: 'Cargo Services',
    description: 'Reliable cargo solutions for all your shipping needs',
    icon: 'fas fa-box',
    component: CargoServices
  }
];

const supportServices = [
  {
    path: 'help-desk',
    title: 'Help Desk',
    description: '24/7 customer support for all your travel needs',
    icon: 'fas fa-headset',
    component: HelpDesk
  },
  {
    path: 'baggage-info',
    title: 'Baggage Information',
    description: 'Complete guide to baggage policies and allowances',
    icon: 'fas fa-suitcase',
    component: BaggageInfo
  },
  {
    path: 'refund-policy',
    title: 'Refund Policy',
    description: 'Transparent refund and cancellation policies',
    icon: 'fas fa-undo',
    component: RefundPolicy
  },
  {
    path: 'special-assistance',
    title: 'Special Assistance',
    description: 'Dedicated support for passengers with special needs',
    icon: 'fas fa-wheelchair',
    component: SpecialAssistance
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'Your privacy and data protection is our priority',
    icon: 'fas fa-shield-alt',
    component: PrivacyPolicy
  }
];

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Flight Services Routes */}
            {flightServices.map((service) => (
              <Route
                key={service.path}
                path={`/${service.path}`}
                element={<ServicePage {...service} />}
              />
            ))}
            
            {/* Support & Help Routes */}
            {supportServices.map((service) => (
              <Route
                key={service.path}
                path={`/${service.path}`}
                element={<SupportPage {...service} />}
              />
            ))}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
