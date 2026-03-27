// This is the advanced portal dashboard code with all required features

'use client';

import React from 'react';
import { Dashboard, Leads, Appointments, Sidebar } from './components';

const PortalPage = () => {
    return (
        <div className="portal-container">
            <Sidebar />
            <main>
                <Dashboard />
                <Leads />
                <Appointments />
            </main>
        </div>
    );
};

export default PortalPage;