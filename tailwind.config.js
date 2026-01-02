/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Force class-based toggling
    theme: {
        extend: {
            fontFamily: {
                sans: ['"TT Firs Neue"', 'sans-serif'],
            },
            colors: {
                orange: '#E65800',
                purple: '#6667AB',
                blue: '#0CC0DF',
                green: '#41C280',
                pink: '#FAB8D6',
            }
        },
    },
    plugins: [],
}
