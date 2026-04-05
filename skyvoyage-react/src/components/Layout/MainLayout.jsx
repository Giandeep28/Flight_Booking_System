import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <div className="app-wrapper">
            <Navbar />
            <main id="app">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
