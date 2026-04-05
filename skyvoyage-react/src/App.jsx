import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home/Home';

// Flights Pages
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

// Error Pages
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    {/* Main Home Route */}
                    <Route index element={<Home />} />

                    {/* Flights Category - Nested Routes */}
                    <Route path="flights">
                        <Route path="international" element={<International />} />
                        <Route path="domestic" element={<Domestic />} />
                        <Route path="status" element={<FlightStatus />} />
                        <Route path="check-in" element={<CheckIn />} />
                        <Route path="cargo" element={<Cargo />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Route>

                    {/* Support Category - Nested Routes */}
                    <Route path="support">
                        <Route path="help-desk" element={<HelpDesk />} />
                        <Route path="baggage" element={<Baggage />} />
                        <Route path="refund" element={<Refund />} />
                        <Route path="assistance" element={<Assistance />} />
                        <Route path="privacy" element={<Privacy />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Route>

                    {/* Catch-all 404 Route */}
                    <Route path="404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
