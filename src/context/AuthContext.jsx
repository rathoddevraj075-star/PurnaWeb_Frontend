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
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
