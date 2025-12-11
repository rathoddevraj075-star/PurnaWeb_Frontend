import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Hero3D = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Parallax effects
    const yText = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
    const yBg = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
    const opacityHero = useTransform(smoothProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={ref}
            className="relative w-full min-h-[100dvh] overflow-hidden bg-[#FDF8F0] flex items-center justify-center z-0"
        >
            {/* Background Elements - Organic Blobs */}
            <motion.div
                style={{ y: yBg }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                {/* Top Left Blob */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-[#FAB8D6] rounded-full blur-[80px] md:blur-[120px] opacity-40 mix-blend-multiply animate-blob" />

                {/* Top Right Blob */}
                <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] bg-[#0CC0DF] rounded-full blur-[80px] md:blur-[120px] opacity-40 mix-blend-multiply animate-blob animation-delay-2000" />

                {/* Bottom Center Blob */}
                <div className="absolute bottom-[-10%] left-[20%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[#41C280] rounded-full blur-[80px] md:blur-[120px] opacity-40 mix-blend-multiply animate-blob animation-delay-4000" />
            </motion.div>

            {/* Floating 3D-like Shapes (Glassmorphism + Perspective) */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden perspective-1000">
                {/* Floating Circle - Left */}
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        rotateX: [0, 20, 0],
                        rotateY: [0, 20, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-[15%] left-[5%] w-16 h-16 md:w-32 md:h-32 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm shadow-xl"
                />

                {/* Floating Pill - Right */}
                <motion.div
                    animate={{
                        y: [0, 40, 0],
                        rotate: [15, 0, 15],
                        rotateZ: [10, -10, 10]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                    className="absolute bottom-[20%] right-[8%] w-20 h-32 md:w-32 md:h-48 rounded-full border border-white/30 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-md shadow-2xl"
                />
            </div>

            {/* Main Content */}
            <motion.div
                style={{ y: yText, opacity: opacityHero }}
                className="relative z-20 text-center px-4 md:px-6 max-w-[90rem] mx-auto w-full flex flex-col items-center justify-center h-full pt-20 pb-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-[#d9634c] text-sm md:text-base lg:text-xl tracking-[0.3em] mb-4 md:mb-6 uppercase font-semibold">
                        Complete Care for the Complete You
                    </h2>

                    <h1 className="text-[#151515] text-[15vw] md:text-[min(160px,18vw)] leading-[0.9] tracking-tighter mb-6 md:mb-10 selection:bg-[#d9634c] selection:text-white">
                        THE <br className="hidden md:block lg:hidden" /> PURNA
                    </h1>

                    <p className="text-[#6667AB] text-base md:text-xl lg:text-2xl max-w-xl md:max-w-2xl mx-auto font-medium leading-relaxed mb-8 md:mb-12 px-4">
                        Modern wellness essentials inspired by ancient wisdom. <br className="hidden md:block" /> Pure, effective, and crafted for your daily flow.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-4 bg-[#d9634c] text-white text-base md:text-lg font-medium rounded-full shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-1"
                        >
                            Explore Essentials
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-4 border-2 border-[#151515] text-[#151515] text-base md:text-lg font-medium rounded-full hover:bg-[#151515] hover:text-white transition-all"
                        >
                            Our Story
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#151515]/40 flex flex-col items-center gap-2 z-20"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#151515]/0 via-[#151515]/40 to-[#151515]/0"></div>
            </motion.div>
        </section>
    );
};

export default Hero3D;
