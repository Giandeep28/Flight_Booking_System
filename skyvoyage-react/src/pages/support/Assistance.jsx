import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { Heart, Accessibility, ShieldCheck } from 'lucide-react';

const Assistance = () => {
    return (
        <PageLayout title="Special Assistance" category="Support" icon={Heart}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', marginBottom: '6rem' }}>
                <div className="glass-card" style={{ padding: '3.5rem', background: 'rgba(5, 13, 28, 0.4)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                        Dignity and Care for All.
                    </h3>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {[
                            { title: "Mobility Assistance", desc: "Wheelchair support from curb-to-gate and gate-to-cabin. Dedicated aisle chairs for aircraft boarding." },
                            { title: "Medical Needs", desc: "Support for medical equipment, portable oxygen concentrators, and specialized seating." },
                            { title: "Unaccompanied Minors", desc: "Full escort service for children traveling alone, ensuring safety from arrival to pickup." },
                            { title: "Sensory Friendly Travel", desc: "Quiet zones and specialized assistance for neurodivergent travelers." }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '20px' }}>
                                <Accessibility size={24} color="var(--primary)" style={{ marginTop: '5px' }} />
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '5px' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(197, 160, 89, 0.05)', border: '1px solid rgba(197, 160, 89, 0.1)', height: 'fit-content' }}>
                    <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '0.8rem', letterSpacing: '2px' }}>Request Support</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Specialized requests must be placed at least 48 hours before departure.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>REQUEST ASSISTANCE</button>
                </div>
            </div>
        </PageLayout>
    );
};

export default Assistance;
