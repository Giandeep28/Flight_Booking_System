import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PageLayout } from './components/PageLayout';
import { NotFound } from './pages/NotFound';

// Flight Services Pages
import International from './pages/flights/International';
import Domestic from './pages/flights/Domestic';
import FlightStatus from './pages/flights/FlightStatus';
import CheckIn from './pages/flights/CheckIn';
import Cargo from './pages/flights/Cargo';

// Support Pages
import HelpDesk from './pages/support/HelpDesk';
import Baggage from './pages/support/Baggage';
import Refund from './pages/support/Refund';
import Assistance from './pages/support/Assistance';
import Privacy from './pages/support/Privacy';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />
            
            {/* Flight Services Routes */}
            <Route path="/flights/international" element={
              <PageLayout 
                title="International Routes"
                subtitle="Explore our global network connecting 150+ destinations worldwide"
                icon="fas fa-globe-americas"
              >
                <International />
              </PageLayout>
            } />
            
            <Route path="/flights/domestic" element={
              <PageLayout 
                title="Domestic Routes"
                subtitle="Connect seamlessly across India with our extensive domestic network"
                icon="fas fa-plane-departure"
              >
                <Domestic />
              </PageLayout>
            } />
            
            <Route path="/flights/status" element={
              <PageLayout 
                title="Flight Status"
                subtitle="Track real-time flight status and updates"
                icon="fas fa-clock"
              >
                <FlightStatus />
              </PageLayout>
            } />
            
            <Route path="/flights/checkin" element={
              <PageLayout 
                title="Web Check-In"
                subtitle="Check-in online and skip the queue at the airport"
                icon="fas fa-ticket-alt"
              >
                <CheckIn />
              </PageLayout>
            } />
            
            <Route path="/flights/cargo" element={
              <PageLayout 
                title="Cargo Services"
                subtitle="Reliable cargo solutions for all your shipping needs"
                icon="fas fa-box"
              >
                <Cargo />
              </PageLayout>
            } />
            
            {/* Support Routes */}
            <Route path="/support/help-desk" element={
              <PageLayout 
                title="Help Desk"
                subtitle="24/7 customer support for all your travel needs"
                icon="fas fa-headset"
              >
                <HelpDesk />
              </PageLayout>
            } />
            
            <Route path="/support/baggage" element={
              <PageLayout 
                title="Baggage Information"
                subtitle="Complete guide to baggage policies and allowances"
                icon="fas fa-suitcase"
              >
                <Baggage />
              </PageLayout>
            } />
            
            <Route path="/support/refund" element={
              <PageLayout 
                title="Refund Policy"
                subtitle="Transparent refund and cancellation policies"
                icon="fas fa-undo"
              >
                <Refund />
              </PageLayout>
            } />
            
            <Route path="/support/assistance" element={
              <PageLayout 
                title="Special Assistance"
                subtitle="Dedicated support for passengers with special needs"
                icon="fas fa-wheelchair"
              >
                <Assistance />
              </PageLayout>
            } />
            
            <Route path="/support/privacy" element={
              <PageLayout 
                title="Privacy Policy"
                subtitle="Your privacy and data protection is our priority"
                icon="fas fa-shield-alt"
              >
                <Privacy />
              </PageLayout>
            } />
            
            {/* 404 Route */}
            <Route path="/404" element={<NotFound />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
