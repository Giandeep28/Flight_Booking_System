import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="view container"
            style={{ textAlign: 'center', paddingTop: '10rem', paddingBottom: '10rem' }}
        >
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '2rem', background: 'rgba(255,100,100,0.1)', borderRadius: '30px', color: '#FF6B6B' }}>
                    <AlertCircle size={80} strokeWidth={1} />
                </div>
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: 950, marginBottom: '1.5rem' }}>404 - LOST IN THE <span style={{ color: 'var(--primary)' }}>CLOUDS.</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                The destination you are looking for does not exist or has been moved. Let's get you back on course.
            </p>
            <Link to="/" className="btn btn-primary" style={{ padding: '1.2rem 3rem' }}>
                <ArrowLeft size={18} /> BACK TO HOME
            </Link>
        </motion.div>
    );
};

export default NotFound;
