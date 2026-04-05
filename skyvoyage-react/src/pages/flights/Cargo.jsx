import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { Package, Truck, Globe } from 'lucide-react';

const Cargo = () => {
    return (
        <PageLayout title="Cargo Services" category="Flights" icon={Package}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', marginBottom: '6rem' }}>
                <div className="glass-card" style={{ padding: '3.5rem', background: 'rgba(5, 13, 28, 0.4)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                        Bridging Markets with Speed.
                    </h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                        SkyVoyage Cargo is a global leader in air freight, offering temperature-controlled, high-security, and time-critical logistics solutions. We connect your business to the world’s largest economic hubs.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            "Priority Pharma: Safe transport for life-saving medications.",
                            "SkySafe: High-security handling for luxury goods and electronics.",
                            "Live Animal Transport: Expert veterinary-supervised travel.",
                            "Digital Waybills and Real-Time Freight Tracking."
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: '20px', fontSize: '1.05rem', color: 'var(--text)' }}>
                                <div style={{ minWidth: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '10px' }} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glass-card" style={{ padding: '2.5rem', height: 'fit-content' }}>
                    <Truck size={28} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                    <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Get a Quote</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Ready to ship? Contact our cargo specialists for a tailored logistics solution.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>CONTACT CARGO HUB</button>
                </div>
            </div>
        </PageLayout>
    );
};

export default Cargo;
