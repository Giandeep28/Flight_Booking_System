import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { HelpCircle, Phone, MessageSquare, Mail } from 'lucide-react';

const HelpDesk = () => {
    return (
        <PageLayout title="SkyVoyage Help Desk" category="Support" icon={HelpCircle}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', marginBottom: '6rem' }}>
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                        How Can We Assist You?
                    </h3>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {[
                            { icon: Phone, title: "Call our 24/7 Helpline", value: "+1 800-SKY-VOYAGE", desc: "Immediate assistance for urgent travel changes." },
                            { icon: MessageSquare, title: "Chat with SKYBOT", value: "Live Chat", desc: "Instant AI-powered answers for PNR status and FAQs." },
                            { icon: Mail, title: "Email Support", value: "support@skyvoyage.com", desc: "Detailed inquiries and feedback." }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                                <div style={{ minWidth: '50px', height: '50px', background: 'rgba(197,160,89,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justify_content: 'center', color: 'var(--primary)' }}>
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 800, marginBottom: '5px' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--primary)', fontWeight: 900, marginBottom: '5px' }}>{item.value}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(197, 160, 89, 0.05)', border: '1px solid rgba(197, 160, 89, 0.1)', height: 'fit-content' }}>
                    <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '0.8rem', letterSpacing: '2px' }}>CORPORATE CONCIERGE</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Dedicated agents for business accounts and SkyPriority Platinum members.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>ACCESS VIP SUPPORT</button>
                </div>
            </div>
        </PageLayout>
    );
};

export default HelpDesk;
