import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

const Privacy = () => {
    return (
        <PageLayout title="Privacy Policy" category="Support" icon={Shield}>
            <div className="glass-card" style={{ padding: '3.5rem', background: 'rgba(5, 13, 28, 0.4)', marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                    Your Data, Your Control.
                </h3>
                <div style={{ display: 'grid', gap: '3rem' }}>
                    {[
                        { icon: Eye, title: "Data Transparency", desc: "We are clear about what data we collect (name, PNR, payment info) and why we need it for your travel." },
                        { icon: Lock, title: "Military-Grade Security", desc: "All personal and financial data is encrypted using AES-256 and stored in secure hubs." },
                        { icon: FileText, title: "GDPR & CCPA Compliance", desc: "You have the right to access, rectify, or delete your data at any time through our portal." }
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ minWidth: '40px', height: '40px', background: 'rgba(197,160,89,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justify_content: 'center', color: 'var(--primary)' }}>
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 800, marginBottom: '5px' }}>{item.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                Last Updated: October 2026. SkyVoyage Airlines is committed to protecting your global travel privacy.
            </p>
        </PageLayout>
    );
};

export default Privacy;
