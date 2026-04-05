import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { Briefcase, Info, AlertTriangle } from 'lucide-react';

const Baggage = () => {
    return (
        <PageLayout title="Baggage Information" category="Support" icon={Briefcase}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', marginBottom: '6rem' }}>
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                        Travel Light or Large.
                    </h3>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Info size={18} color="var(--primary)" /> Standard Allowances
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <p style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '5px' }}>CABIN BAGGAGE</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 950 }}>7 KG</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Included in all fares</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '5px' }}>CHECK-IN BAGGAGE</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 950 }}>15 - 40 KG</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Based on cabin class</p>
                            </div>
                        </div>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            "Pre-book extra baggage and save up to 30% vs airport rates.",
                            "Special allowance for sports equipment and musical instruments.",
                            "Strict prohibition on power banks and spare lithium batteries in check-in.",
                            "Real-time baggage status tracking via SkyVoyage RFID app."
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', gap: '20px', fontSize: '1.05rem', color: 'var(--text)' }}>
                                <div style={{ minWidth: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '10px' }} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(255, 100, 100, 0.05)', border: '1px solid rgba(255, 100, 100, 0.1)' }}>
                    <AlertTriangle size={28} color="#FF6B6B" style={{ marginBottom: '1.5rem' }} />
                    <h4 style={{ fontWeight: 800, marginBottom: '1rem', color: '#FF6B6B' }}>Restricted Items</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Ensure your baggage complies with safety regulations. Review prohibited flammable and electronic materials.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>VIEW PROHIBITED LIST</button>
                </div>
            </div>
        </PageLayout>
    );
};

export default Baggage;
