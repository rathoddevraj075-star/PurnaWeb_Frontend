import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero3D = () => {
    const ref = useRef(null);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Mouse Interaction for "Connected Hero"
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Parallax effects for scroll
    const yText = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
    const yBg = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
    const opacityHero = useTransform(smoothProgress, [0, 0.8], [1, 0]);

    // Responsive Blob Movements (Secret Sauce ✨)
    const blob1X = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), { stiffness: 50, damping: 20 });
    const blob1Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), { stiffness: 50, damping: 20 });

    const blob2X = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), { stiffness: 40, damping: 20 });
    const blob2Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), { stiffness: 40, damping: 20 });

    const blob3X = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), { stiffness: 60, damping: 20 });
    const blob3Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), { stiffness: 60, damping: 20 });


    return (
        <section
            ref={ref}
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-[100dvh] overflow-hidden bg-[#e17100] flex items-center justify-center z-0"
        >
            {/* Background Elements - Organic Blobs Reacting to Mouse */}
            <motion.div
                style={{ y: yBg }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                {/* Top Left Blob */}
                <motion.div
                    style={{ x: blob1X, y: blob1Y }}
                    className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-[#ffb380] rounded-full blur-[80px] md:blur-[120px] opacity-30 mix-blend-screen animate-blob"
                />



                {/* Bottom Center Blob */}
                <motion.div
                    style={{ x: blob3X, y: blob3Y }}
                    className="absolute bottom-[-10%] left-[20%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[#ff9966] rounded-full blur-[80px] md:blur-[120px] opacity-30 mix-blend-screen animate-blob animation-delay-4000"
                />
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
                className="relative z-20 text-center px-4 md:px-6 max-w-[90rem] mx-auto w-full flex flex-col items-center justify-center h-full pt-0 pb-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Living Object Logo Section */}
                    <div className="flex flex-col items-center justify-center w-full mb-6 relative">
                        <motion.div
                            className="relative z-10"
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                                y: [0, -4, 0] // Very subtle floating/wobble
                            }}
                            transition={{
                                opacity: { duration: 1.5, ease: "easeOut" },
                                scale: {
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1],
                                    repeatType: "mirror",
                                    values: [1, 1.015, 1] // Micro-breathing
                                },
                                y: {
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    repeatType: "mirror"
                                }
                            }}
                        >
                            <img
                                src="/images/logo-black.png"
                                alt="PURNA"
                                className="w-[200px] md:w-[280px] h-auto object-contain invert brightness-0 pb-4"
                            />
                        </motion.div>

                        {/* Breathing Shadow */}
                        <motion.div
                            className="absolute -bottom-4 w-[180px] md:w-[250px] h-4 bg-white/10 rounded-[100%] blur-md"
                            animate={{
                                scale: [0.9, 1, 0.9],
                                opacity: [0.1, 0.15, 0.1]
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.5, 1]
                            }}
                        />
                    </div>

                    <h2 className="text-white text-3xl md:text-5xl font-serif font-light tracking-wide mb-6 leading-tight italic">
                        Complete Care for the Complete You
                    </h2>

                    <p className="text-white text-base md:text-xl max-w-xl md:max-w-2xl mx-auto font-medium leading-relaxed mb-6 md:mb-8 px-4">
                        From your morning routine to your nightly wind-down,  <br className="hidden md:block" /> The Purna brings you pure, effective essentials inspired by <br className="hidden md:block" />
                        Age Old Natural and crafted for modern wellness.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
                        <motion.button
                            onClick={() => navigate('/products')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-4 bg-[#151515] text-white text-base md:text-lg font-medium rounded-full shadow-xl hover:shadow-2xl hover:bg-white hover:text-[#e17100] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        >
                            Explore Essentials
                        </motion.button>
                        <motion.button
                            onClick={() => navigate('/about')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-4 border-[1.5px] border-white text-white text-base md:text-lg font-medium rounded-full hover:bg-white hover:text-[#e17100] transition-all duration-300 cursor-pointer"
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
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2 z-20"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/0"></div>
            </motion.div>
        </section>
    );
};

export default Hero3D;
