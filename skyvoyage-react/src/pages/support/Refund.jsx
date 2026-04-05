import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { RotateCcw, ShieldCheck, Clock } from 'lucide-react';

const Refund = () => {
    return (
        <PageLayout title="Refund Policy" category="Support" icon={RotateCcw}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', marginBottom: '6rem' }}>
                <div className="glass-card" style={{ padding: '3.5rem', background: 'rgba(5, 13, 28, 0.4)' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                        Transparent Cancellations.
                    </h3>
                    <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
                        {[
                            { title: "24-Hour Zero Penalty", desc: "No cancellation fee if canceled within 24 hours of booking for flights departing in at least 7 days." },
                            { title: "Flex-Fare Benefits", desc: "Change or cancel your flight up to 2 hours before departure with only the fare difference." },
                            { title: "Automated Refunds", desc: "Refunds for eligible tickets are processed automatically within 7-10 business days." }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <ShieldCheck size={20} color="var(--secondary)" style={{ marginTop: '5px' }} />
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '5px' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(5, 13, 28, 0.6)' }}>
                    <Clock size={28} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                    <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Check Status</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Already requested a refund? Track your transaction status in real-time.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>TRACK REFUND</button>
                </div>
            </div>
        </PageLayout>
    );
};

export default Refund;
