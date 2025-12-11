import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroLayout = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // Parallax floating elements - adjusted for responsiveness
    // Using simple shapes or the original "blob" logic but cleaner
    const yFloat1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const yFloat2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    return (
        <section
            ref={ref}
            className="relative w-full min-h-[100dvh] overflow-hidden bg-[#FDF8F0] flex items-center justify-center border-b border-[#151515]/10"
        >
            {/* Background Texture/Gradient - Kept matching original cream theme */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FAB8D6] rounded-full blur-[100px] opacity-30 mix-blend-multiply animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#41C280] rounded-full blur-[100px] opacity-30 mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            {/* Main Title Layer - Marvis Scale, Purna Font */}
            <div className="relative z-20 text-center px-4 w-full max-w-[1600px] mx-auto mix-blend-normal flex flex-col items-center justify-center h-full">
                <motion.div
                    style={{ y: yText }}
                    className="relative w-full"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-[#E65800] text-xs sm:text-sm md:text-xl tracking-[0.3em] mb-6 uppercase">
                            Complete Care for the Complete You
                        </h2>
                        <h1 className="text-[#151515] text-[15vw] md:text-[16vw] lg:text-[18vw] leading-[0.85] tracking-tighter font-black scale-y-110">
                            THE <br className="hidden md:block" /> PURNA
                        </h1>
                        <p className="mt-8 text-[#151515]/60 text-sm sm:text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                            Ayurvedic essentials crafted for modern rituals.
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating Abstract Shapes - Purna Brand Colors */}
            <motion.div style={{ y: yFloat1 }} className="absolute top-[15%] left-[5%] w-[15vw] md:w-[10vw] z-10 pointer-events-none opacity-80 mix-blend-multiply">
                <div className="w-full aspect-square rounded-full border-2 border-[#E65800]"></div>
            </motion.div>

            <motion.div style={{ y: yFloat2 }} className="absolute bottom-[20%] right-[5%] w-[18vw] md:w-[12vw] z-10 pointer-events-none opacity-80 mix-blend-multiply">
                <div className="w-full aspect-square rounded-full bg-[#0CC0DF] blur-3xl opacity-40"></div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 text-[#151515]/40"
            >
                <div className="w-[1px] h-12 bg-current animate-bounce"></div>
            </motion.div>
        </section>
    );
};

export default HeroLayout;
