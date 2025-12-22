import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const WITTY_MESSAGES = [
    "Polishing enamel...",
    "Formulating serums...",
    "Lathering pure soaps...",
    "Squeezing freshness...",
    "Calculated glow...",
    "Refreshing routine...",
    "Balancing pH levels...",
    "Extracting essences..."
];

const PageTransition = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setIsLoading(true);
        window.scrollTo(0, 0);
        setMessage(WITTY_MESSAGES[Math.floor(Math.random() * WITTY_MESSAGES.length)]);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="loader"
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111111] text-[#F3F3F3]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
                >
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Elegant Rotating Star/Sparkle instead of spinner */}
                        <motion.div
                            animate={{ rotate: 180, scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="mb-8 opacity-80"
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
                            </svg>
                        </motion.div>

                        {/* Main Witty Message - Large & Typographic */}
                        <div className="overflow-hidden h-16 md:h-24 flex items-center">
                            <motion.h2
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                exit={{ y: -100 }}
                                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                                className="text-3xl md:text-5xl font-bold tracking-tight uppercase font-['TT_Firs_Neue'] text-center mix-blend-difference"
                            >
                                {message}
                            </motion.h2>
                        </div>

                        {/* Minimalist Progress Line */}
                        <div className="mt-8 w-48 h-[1px] bg-white/10 overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                            />
                        </div>

                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-[-60px] text-[10px] uppercase tracking-[0.4em] text-white/40"
                        >
                            Purna Routine
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PageTransition;
