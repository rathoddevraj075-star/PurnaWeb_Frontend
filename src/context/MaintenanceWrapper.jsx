/**
 * Maintenance Mode Wrapper - Checks for maintenance mode and displays accordingly
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MaintenancePage from '../Components/MaintenancePage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function MaintenanceWrapper({ children }) {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');
    const [siteName, setSiteName] = useState('Purna');
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Check if user is admin (accessing admin routes or has admin token)
    const isAdminUser = () => {
        const adminToken = localStorage.getItem('adminToken');
        const isAdminRoute = location.pathname.startsWith('/admin');
        return adminToken && isAdminRoute;
    };

    // Check maintenance status on load and route changes
    useEffect(() => {
        const checkMaintenanceStatus = async () => {
            try {
                const response = await fetch(`${API_BASE}/settings/status`);
                const data = await response.json();

                if (data.success && data.data) {
                    setIsMaintenanceMode(data.data.maintenanceMode);
                    setMaintenanceMessage(data.data.maintenanceMessage);
                    setSiteName(data.data.siteName);
                }
            } catch (error) {
                console.error('Failed to check maintenance status:', error);
                // On error, assume not in maintenance mode
                setIsMaintenanceMode(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkMaintenanceStatus();
    }, [location.pathname]);

    // Show loading only briefly on initial load
    if (isLoading) {
        return null; // Or a minimal loading spinner
    }

    // Admin routes always work, admin users bypass maintenance
    const isAdminRoute = location.pathname.startsWith('/admin');

    // If maintenance mode is ON and user is NOT on admin routes, show maintenance page
    if (isMaintenanceMode && !isAdminRoute) {
        return <MaintenancePage message={maintenanceMessage} siteName={siteName} />;
    }

    // Otherwise, render children normally
    return children;
}
