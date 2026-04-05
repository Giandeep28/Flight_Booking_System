import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { Clock, Search, MapPin, Plane } from 'lucide-react';

const FlightStatus = () => {
    return (
        <PageLayout title="Live Flight Status" category="Flights" icon={Clock}>
            <div className="glass-card" style={{ padding: '3.5rem', marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                    Track Your Journey.
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '1.5rem' }}>
                    <div className="input-group">
                        <span className="input-label">Flight Number</span>
                        <input className="input-field" placeholder="e.g. SV 102" />
                    </div>
                    <div className="input-group">
                        <span className="input-label">Date</span>
                        <input className="input-field" type="date" />
                    </div>
                    <button className="btn btn-primary" style={{ height: '62px', marginTop: '28px', justifyContent: 'center' }}>
                        CHECK STATUS
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                {[
                    { label: "On-Time Performance", value: "98.4%", color: "var(--secondary)" },
                    { label: "Active Flights", value: "142", color: "var(--primary)" },
                    { label: "Avg. Delay", value: "4 mins", color: "var(--text-muted)" }
                ].map((stat, i) => (
                    <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                            {stat.label}
                        </span>
                        <span style={{ fontSize: '2rem', fontWeight: 950, color: stat.color }}>{stat.value}</span>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
};

export default FlightStatus;
