import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { UserCheck, ShieldCheck, Ticket } from 'lucide-react';

const CheckIn = () => {
    return (
        <PageLayout title="Web Check-In" category="Flights" icon={UserCheck}>
            <div className="glass-card" style={{ padding: '3.5rem', marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                    Save Time at the Airport.
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 1.5fr 200px', gap: '1.5rem' }}>
                    <div className="input-group">
                        <span className="input-label">Booking PNR / Ticket</span>
                        <input className="input-field" placeholder="e.g. SKY123" />
                    </div>
                    <div className="input-group">
                        <span className="input-label">Last Name / Email</span>
                        <input className="input-field" placeholder="Enter traveler last name" />
                    </div>
                    <button className="btn btn-primary" style={{ height: '62px', marginTop: '28px', justifyContent: 'center' }}>
                        START CHECK-IN
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <ShieldCheck size={28} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
                    <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Zero-Touch Boarding</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Generate your digital boarding pass and save it to your Apple Wallet or Google Pay for a completely contactless experience.
                    </p>
                </div>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <Ticket size={28} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                    <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Preferred Seating</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Choose your seat, pre-book extra baggage, and select your meal preferences during the online check-in process.
                    </p>
                </div>
            </div>
        </PageLayout>
    );
};

export default CheckIn;
