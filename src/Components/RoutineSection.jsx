import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Sun, CloudSun, Moon, Stars, CheckCircle } from "lucide-react";

const routineSteps = [
    {
        id: "morning",
        time: "6:00 AM",
        label: "Morning Ritual",
        title: "Wake Up & Refresh",
        description: "Start fresh with oral care and gentle cleansers. Awaken your senses and prepare for the day with intention.",
        color: "#FFFBF0", // Warm Cream
        accent: "#F59E0B", // Amber
        text: "#78350F", // Amber-900
        icon: Sun,
        visualColor: "from-orange-400 to-yellow-300"
    },
    {
        id: "midday",
        time: "12:00 PM",
        label: "Midday Boost",
        title: "Stay Active & Vibrant",
        description: "Stay active with refreshing hygiene essentials. Keep your energy high and your spirit lifted throughout the day.",
        color: "#F0FDFA", // Azure White
        accent: "#0D9488", // Teal
        text: "#134E4A", // Teal-900
        icon: CloudSun,
        visualColor: "from-teal-400 to-cyan-300"
    },
    {
        id: "evening",
        time: "6:00 PM",
        label: "Evening Reset",
        title: "Wash Away The Day",
        description: "Wash off the day with nourishing care. Transition from the busyness of the outside world to the comfort of home.",
        color: "#EEF2FF", // Indigo White
        accent: "#4F46E5", // Indigo
        text: "#312E81", // Indigo-900
        icon: Moon,
        visualColor: "from-indigo-400 to-purple-300"
    },
    {
        id: "night",
        time: "10:00 PM",
        label: "Nightly Nourishment",
        title: "Rest & Restore",
        description: "Calm your senses with restorative routines. Prepare your body and mind for deep, rejuvenating sleep.",
        color: "#F5F3FF", // Violet White
        accent: "#7C3AED", // Violet
        text: "#4C1D95", // Violet-900
        icon: Stars,
        visualColor: "from-violet-500 to-fuchsia-400"
    },
];

const RoutineSection = () => {
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth progress for background interpolation
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const backgroundColor = useTransform(
        smoothProgress,
        [0, 0.33, 0.66, 1],
        ["#FFFBF0", "#F0FDFA", "#EEF2FF", "#F5F3FF"]
    );

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            if (latest < 0.25) setActiveIndex(0);
            else if (latest < 0.5) setActiveIndex(1);
            else if (latest < 0.75) setActiveIndex(2);
            else setActiveIndex(3);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    const activeStep = routineSteps[activeIndex];

    return (
        <motion.section
            ref={containerRef}
            className="relative h-[400vh]" // 4 screens worth of scroll
            style={{ backgroundColor }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row items-center justify-center p-6 md:p-12 lg:p-24 perspective-1000">

                {/* Background Decor - Dynamic Gradient Orb */}
                <motion.div
                    className={`absolute rounded-full blur-[120px] opacity-40 z-0 transition-colors duration-1000 bg-gradient-to-br ${activeStep.visualColor}`}
                    initial={false}
                    animate={{
                        scale: [1, 1.2, 1],
                        x: activeIndex % 2 === 0 ? "-20%" : "20%",
                        y: activeIndex % 2 === 0 ? "-10%" : "10%",
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: "60vw", height: "60vw" }}
                />

                {/* Left Panel: Text Content */}
                <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center items-start space-y-8 md:pr-16">
                    <motion.div
                        key={`label-${activeIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border"
                            style={{
                                borderColor: activeStep.accent,
                                color: activeStep.accent,
                                backgroundColor: `${activeStep.accent}10`
                            }}
                        >
                            <activeStep.icon size={14} />
                            {activeStep.time}
                        </span>
                    </motion.div>

                    <motion.div
                        key={`content-${activeIndex}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-6"
                    >
                        <h2
                            className="text-5xl md:text-7xl font-serif leading-none"
                            style={{ color: activeStep.text }}
                        >
                            {activeStep.title}
                        </h2>
                        <p
                            className="text-lg md:text-xl font-light leading-relaxed max-w-md"
                            style={{ color: `${activeStep.text}CC` }} // 80% opacity
                        >
                            {activeStep.description}
                        </p>
                    </motion.div>

                    {/* Progress Indicators */}
                    <div className="flex gap-3 mt-12">
                        {routineSteps.map((step, idx) => (
                            <motion.button
                                key={step.id}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-12" : "w-3"}`}
                                style={{ backgroundColor: idx === activeIndex ? step.accent : `${activeStep.text}20` }}
                                onClick={() => {
                                    // Optional: Scroll to section (would require more complex logic, skipping for now to keep it scroll-driven)
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Panel: Dynamic Visual */}
                <div className="relative z-10 w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center mt-12 md:mt-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep.id}
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 1.1, rotate: 10 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative w-full max-w-md aspect-[4/5] md:aspect-square flex items-center justify-center"
                        >
                            {/* Card Container */}
                            <div className="relative w-full h-full bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl overflow-hidden flex items-center justify-center group">

                                {/* Inner Gradient Mesh */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${activeStep.visualColor} opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />

                                {/* Icon / Illustration */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 2, 0]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 p-8"
                                >
                                    <activeStep.icon size={80} strokeWidth={1} style={{ color: activeStep.accent }} />
                                    <h3
                                        className="text-2xl font-serif italic opacity-60"
                                        style={{ color: activeStep.text }}
                                    >
                                        {activeStep.label}
                                    </h3>
                                </motion.div>

                                {/* Decorative Elements */}
                                <div className="absolute bottom-8 right-8">
                                    <CheckCircle size={32} className="text-white/60 drop-shadow-md" />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </motion.section>
    );
};

export default RoutineSection;
