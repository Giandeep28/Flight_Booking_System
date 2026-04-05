import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { MapPin, Building, Navigation } from 'lucide-react';

const Domestic = () => {
    return (
        <PageLayout title="Domestic Hubs" category="Flights" icon={Building}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', marginBottom: '6rem' }}>
                <div className="glass-card" style={{ padding: '3.5rem', background: 'rgba(5, 13, 28, 0.4)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                        Connecting India.
                    </h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                        SkyVoyage operates 400+ daily flights across India. From metro-to-metro shuttles to hidden gems in the Northeast, we ensure you travel with luxury and punctuality.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            "Primary hubs at Delhi, Mumbai, Bengaluru, and Hyderabad.",
                            "Complimentary hot meals and extra legroom on all domestic routes.",
                            "Priority check-in and lounge access for Business and Premium Economy.",
                            "Industry-leading 98.7% on-time performance."
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: '20px', fontSize: '1.05rem', color: 'var(--text)' }}>
                                <div style={{ minWidth: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '10px' }} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </PageLayout>
    );
};

export default Domestic;
