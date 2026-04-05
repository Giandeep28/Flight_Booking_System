import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { Globe, Plane, MapPin } from 'lucide-react';

const International = () => {
    return (
        <PageLayout title="International Routes" category="Flights" icon={Globe}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', marginBottom: '6rem' }}>
                <div className="glass-card" style={{ padding: '3.5rem', background: 'rgba(5, 13, 28, 0.4)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                        Connecting the World.
                    </h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                        SkyVoyage operates direct and codeshare flights to over 150 global destinations. Our network is designed for seamless connectivity between the world's most iconic cities.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            "Double-daily flights to London Heathrow (LHR) and NYC (JFK).",
                            "Premium lie-flat beds on all long-haul 777 and A350 aircraft.",
                            "In-flight dining curated by Michelin-star chefs.",
                            "Seamless transfers at our global hubs in Singapore and Dubai."
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: '20px', fontSize: '1.05rem', color: 'var(--text)' }}>
                                <div style={{ minWidth: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '10px' }} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(197, 160, 89, 0.05)', border: '1px solid rgba(197, 160, 89, 0.1)' }}>
                        <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '0.8rem', letterSpacing: '2px' }}>SKYVOYAGE WORLD</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Book at least 30 days in advance and save up to 25% on international business class fares.
                        </p>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>EXPLORE NETWORK</button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default International;
