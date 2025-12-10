import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero3D = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={ref}
            className="relative w-full h-screen overflow-hidden bg-[#FDF8F0] flex items-center justify-center"
        >
            {/* Background Elements */}
            <motion.div
                style={{ y: yBg }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FAB8D6] rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#0CC0DF] rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-[#41C280] rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-blob animation-delay-4000" />
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ y: yText }}
                >
                    <h2 className="text-[#d9634c] text-lg md:text-xl tracking-[0.2em] mb-4 uppercase">
                        Complete Care for the Complete You
                    </h2>
                    <h1 className="text-[#151515] text-6xl md:text-8xl lg:text-9xl leading-none tracking-tighter mb-6">
                        THE <br className="md:hidden" /> PURNA
                    </h1>
                    <p className="text-[#6667AB] text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                        From your morning routine to your nightly wind-down, The Purna brings you pure, effective essentials inspired by Ayurveda and crafted for modern wellness.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-[var(--color-orange)] text-white text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                            EXPLORE OUR ESSENTIALS
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 border-2 border-[#151515] text-[#151515] text-lg rounded-full hover:bg-[#151515] hover:text-white transition-all"
                        >
                            OUR STORY
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Floating 3D-like Elements (CSS/Motion) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Circle 1 */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-[20%] left-[10%] w-16 h-16 md:w-24 md:h-24 border-4 border-[var(--color-purple)] rounded-full opacity-60"
                />
                {/* Circle 2 */}
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -15, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                    className="absolute bottom-[30%] right-[15%] w-20 h-20 md:w-32 md:h-32 bg-[var(--color-blue)] rounded-full opacity-20 blur-sm"
                />
                {/* Pill Shape */}
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        rotate: [45, 60, 45],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                    className="absolute top-[15%] right-[20%] w-12 h-24 md:w-16 md:h-32 border-2 border-[var(--color-green)] rounded-full opacity-50"
                />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#151515]/50 flex flex-col items-center gap-2"
            >
                <span className="text-xs tracking-widest uppercase">Scroll</span>
                <div className="w-[1px] h-12 bg-[#151515]/20"></div>
            </motion.div>
        </section>
    );
};

export default Hero3D;
