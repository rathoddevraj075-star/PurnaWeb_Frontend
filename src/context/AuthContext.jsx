import { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = authService.getCurrentUser();
                if (storedUser && authService.isAuthenticated()) {
                    // Verify token is still valid by fetching profile
                    try {
                        const response = await userService.getProfile();
                        setUser(response.data);
                    } catch (err) {
                        // Token invalid, clear storage
                        authService.logout();
                        setUser(null);
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const response = await authService.login({ email, password });

            if (response.require2FA) {
                return { success: true, require2FA: true, email: response.email };
            }

            setUser(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please try again.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const verify2FA = async (email, token) => {
        setError(null);
        setLoading(true);
        try {
            const response = await authService.verify2FA({ email, token });
            setUser(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Invalid 2FA code.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setError(null);
        setLoading(true);
        try {
            const response = await authService.register(userData);
            setUser(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };

    const updateProfile = async (userData) => {
        setError(null);
        try {
            const response = await userService.updateProfile(userData);
            setUser(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Update failed. Please try again.';
            setError(message);
            return { success: false, error: message };
        }
    };

    const updatePassword = async (passwordData) => {
        setError(null);
        try {
            const response = await authService.updatePassword(passwordData);
            return { success: true, message: response.message };
        } catch (err) {
            const message = err.response?.data?.message || 'Password update failed.';
            setError(message);
            return { success: false, error: message };
        }
    };

    const setup2FA = async () => {
        try {
            return await authService.setup2FA();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to setup 2FA');
            return { success: false };
        }
    };

    const verify2FASetup = async (token) => {
        try {
            const res = await authService.verify2FASetup(token);
            if (res.success) {
                // Refresh user data to show 2FA as enabled
                const profileRes = await userService.getProfile();
                setUser(profileRes.data);
            }
            return res;
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
            return { success: false };
        }
    };

    const disable2FA = async (password) => {
        try {
            const res = await authService.disable2FA(password);
            if (res.success) {
                const profileRes = await userService.getProfile();
                setUser(profileRes.data);
            }
            return res;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to disable 2FA');
            return { success: false };
        }
    };

    const clearError = () => setError(null);

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        verify2FA,
        setup2FA,
        verify2FASetup,
        disable2FA,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
