import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Default to dark mode for admin panel if no preference saved
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('admin-theme');
        return saved || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('admin-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {/* The actual class application happens in the layout wrapper via data attribute or class, 
                but we can also pass it down here if needed. 
                We are NOT touching document.documentElement to keep it scoped. */}
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
