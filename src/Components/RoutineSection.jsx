import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sun, CloudSun, Moon, Stars, CheckCircle2, ArrowDown } from "lucide-react";

export default function RoutineSection() {
    const containerRef = useRef(null);

    const steps = [
        {
            id: "morning",
            time: "6:00 AM",
            label: "Morning Ritual",
            title: "Wake Up & Refresh",
            description: "Start fresh with oral care and gentle cleansers. Awaken your senses and prepare for the day with intention.",
            icon: Sun,
            bg: "bg-[#FFFBF0]",
            accent: "text-amber-600",
            border: "border-amber-900/10",
            gradient: "from-orange-100 to-amber-50",
            visualGradient: "from-orange-400 to-amber-300"
        },
        {
            id: "midday",
            time: "12:00 PM",
            label: "Midday Boost",
            title: "Stay Active & Vibrant",
            description: "Stay active with refreshing hygiene essentials. Keep your energy high and your spirit lifted throughout the day.",
            icon: CloudSun,
            bg: "bg-[#F0FDFA]",
            accent: "text-teal-700",
            border: "border-teal-900/10",
            gradient: "from-teal-100 to-emerald-50",
            visualGradient: "from-teal-400 to-cyan-300"
        },
        {
            id: "evening",
            time: "6:00 PM",
            label: "Evening Reset",
            title: "Wash Away The Day",
            description: "Wash off the day with nourishing care. Transition from the busyness of the outside world to the comfort of home.",
            icon: Moon,
            bg: "bg-[#EEF2FF]",
            accent: "text-indigo-700",
            border: "border-indigo-900/10",
            gradient: "from-indigo-100 to-violet-50",
            visualGradient: "from-indigo-400 to-purple-400"
        },
        {
            id: "night",
            time: "10:00 PM",
            label: "Nightly Nourishment",
            title: "Rest & Restore",
            description: "Calm your senses with restorative routines. Prepare your body and mind for deep, rejuvenating sleep.",
            icon: Stars,
            bg: "bg-[#F5F3FF]",
            accent: "text-violet-800",
            border: "border-violet-900/10",
            gradient: "from-violet-100 to-fuchsia-50",
            visualGradient: "from-violet-500 to-fuchsia-400"
        }
    ];

    return (
        <section ref={containerRef} className="relative bg-[#FFFBF0]">
            {/* Scroll Hint */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
                <span className="text-[10px] font-mono tracking-widest uppercase">The Routine</span>
                <ArrowDown size={14} className="animate-bounce" />
            </div>

            <div className="flex flex-col">
                {steps.map((step, index) => (
                    <RoutineCard key={step.id} step={step} index={index} total={steps.length} />
                ))}
            </div>

            {/* Spacer for final aesthetic scroll */}
            <div className="h-[20vh] bg-[#F5F3FF]" />
        </section>
    );
}

function RoutineCard({ step, index, total }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Subtle transformations for the card as it scrolls away
    // Instead of causing a re-render, this uses CSS variables/transforms directly on GPU
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

    return (
        <motion.div
            ref={ref}
            style={{
                zIndex: index + 10,
                // Only apply transform effects on desktop to keep mobile absolute 60fps simple
            }}
            className={`sticky top-0 w-full min-h-screen flex items-center justify-center overflow-hidden border-t-2 border-white/40 ${step.bg}`}
        >
            <motion.div
                style={{ scale, opacity, y }}
                className="w-full h-full absolute inset-0 pointer-events-none hidden lg:block"
            />

            <div className="relative w-full max-w-[1440px] px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center h-full py-20 lg:py-0">

                {/* Content Side */}
                <div className="flex flex-col justify-center order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <div className={`p-2 rounded-full ${step.bg} border border-black/5`}>
                            <step.icon size={20} className={step.accent} />
                        </div>
                        <span className={`text-sm font-bold tracking-widest uppercase ${step.accent} opacity-80`}>
                            {step.label}
                        </span>
                        <span className="h-px w-10 bg-black/10" />
                        <span className="font-mono text-sm opacity-50">{step.time}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] text-neutral-900 mb-8 tracking-tight`}
                    >
                        {step.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-md"
                    >
                        {step.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 flex items-center gap-2 text-sm font-medium opacity-40 uppercase tracking-widest"
                    >
                        Step 0{index + 1} / 0{total}
                    </motion.div>
                </div>

                {/* Visual Side */}
                <div className="relative order-1 lg:order-2 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full aspect-square max-w-lg"
                    >
                        {/* Optimized Gradient Blob - No Blur Filter, just Gradient */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${step.visualGradient} opacity-20 animate-pulse-slow`} />

                        {/* Glass Card */}
                        <div className="absolute inset-4 md:inset-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-2xl overflow-hidden flex items-center justify-center">

                            {/* Inner Content */}
                            <div className="text-center p-12">
                                <step.icon size={120} strokeWidth={0.5} className={`${step.accent} opacity-80 mb-6 mx-auto`} />
                                <div className="font-serif italic text-3xl opacity-40">
                                    {step.label}
                                </div>
                            </div>

                            {/* Decorative */}
                            <div className="absolute top-6 right-6 opacity-30">
                                <CheckCircle2 size={32} />
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
}
