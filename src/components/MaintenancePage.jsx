/**
 * Maintenance Page - "Digital Rejuvenation" Theme
 * A world-class, premium maintenance experience for PurnaRoutine.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function MaintenancePage({ message, siteName }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [progress, setProgress] = useState(0);

    // Simulate a "healing/rejuvenating" progress bar
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 2;
                return next > 95 ? 95 : next; // Cap at 95% until real reload
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => window.location.reload(), 1500);
    };

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center font-sans selection:bg-amber-500/30">

            {/* --- Animated Background Layers --- */}

            {/* 1. Deep Atmospheric Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-amber-900/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-orange-900/10 rounded-full blur-[150px]"
                />
            </div>

            {/* 2. Particle Dust (Stars/Prana) */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-amber-200/60 rounded-full"
                        style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [0, -100],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.5, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                    />
                ))}
            </div>

            {/* 3. Subtle Grain Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />


            {/* --- Main Content --- */}
            <div className="relative z-10 w-full max-w-2xl px-6">

                {/* Central Mandala/Orb Animation */}
                <div className="relative flex justify-center mb-16">
                    {/* Outer Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="w-64 h-64 border border-white/5 rounded-full border-dashed"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="w-48 h-48 border border-amber-500/10 rounded-full"
                        />
                    </div>

                    {/* Glowing Core */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="relative w-32 h-32"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-full blur-2xl opacity-40 animate-pulse-slow" />
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-2xl flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-amber-200 opacity-90" strokeWidth={1} />
                        </div>
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs tracking-[0.2em] uppercase font-medium mb-4">
                            System Rejuvenation
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 pb-2">
                            Elevating Your Experience.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-white/40 font-light max-w-md mx-auto leading-relaxed"
                    >
                        {message || "We are currently applying essential updates to enhance performance and serenity. PurnaRoutine will return momentarily."}
                    </motion.p>
                </div>

                {/* Status & Progress */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
                >
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </div>
                            <span className="text-white/80 font-mono text-sm tracking-wide">Maintenance in Progress</span>
                        </div>
                        <span className="text-white/40 font-mono text-xs">{Math.round(progress)}% Complete</span>
                    </div>

                    <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200"
                            style={{ width: `${progress}%` }}
                            transition={{ type: "spring", bounce: 0 }}
                        />
                        {/* Shine effect on bar */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="group relative px-8 py-3.5 bg-white text-black font-medium rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center justify-center gap-2">
                            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            {isRefreshing ? "Refreshing..." : "Check Availability"}
                        </span>
                    </button>

                    <a
                        href="mailto:support@purnaroutine.com"
                        className="px-8 py-3.5 text-white/60 hover:text-white font-medium text-sm transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        Contact Support <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>

            </div>

            {/* Footer Watermark */}
            <div className="absolute bottom-6 left-0 w-full text-center">
                <p className="text-white/10 text-[10px] uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} {siteName || 'PurnaRoutine'}
                </p>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
