import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * PageLayout Wrapper
 * Shared layout for all flight services and support pages
 * Includes breadcrumbs, icons, and consistent content styling
 */
const PageLayout = ({ title, category, icon: Icon, children }) => {
    const location = useLocation();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="view container"
        >
            {/* Breadcrumbs */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                    <Home size={14} /> Home
                </Link>
                <ChevronRight size={14} />
                <span style={{ textTransform: 'capitalize' }}>{category}</span>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{title}</span>
            </nav>

            {/* Page Header */}
            <div className="service-header" style={{ marginBottom: '4rem' }}>
                <div className="service-icon-box">
                    {Icon && <Icon size={40} strokeWidth={1.5} />}
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 950, marginBottom: '1rem', letterSpacing: '-1px' }}>
                    {title}
                </h1>
                <div style={{ width: '60px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
            </div>

            {/* Content Area */}
            <div className="page-content">
                {children}
            </div>
        </motion.div>
    );
};

export default PageLayout;
