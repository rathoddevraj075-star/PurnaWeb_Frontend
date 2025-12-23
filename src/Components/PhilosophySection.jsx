import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";

export default function PhilosophySection() {
  const sectionRef = useRef(null);

  // OPTIMIZATION: Use MotionValues for mouse tracking instead of React State
  // This prevents re-renders on every mouse move
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Update MotionValues directly
    mouseX.set(x);
    mouseY.set(y);
  };

  // Pre-calculated transforms to avoid inline function creation
  const glowX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const glowY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);
  const negGlowX = useTransform(smoothMouseX, [-0.5, 0.5], [20, -20]);
  const negGlowY = useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]);

  // Card Hover Tilt Effects
  const cardTiltX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const cardTiltY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

  // Optimized Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Faster stagger
        delayChildren: 0.05
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  // Reused Philosophy Items
  const philosophyItems = [
    {
      number: "01",
      title: "Holistic Wellness",
      description: "We embrace a holistic approach, nurturing your mind, body, and spirit through pure, intentional formulations.",
      icon: "🌿",
      color: "from-emerald-500 to-teal-500", // Simplified gradient
      accent: "text-emerald-600",
      glow: "from-emerald-400/20 to-teal-400/10"
    },
    {
      number: "02",
      title: "Ayurvedic Wisdom",
      description: "Rooted in ancient Ayurvedic principles, our products honor timeless traditions for modern balanced living.",
      icon: "🪷",
      color: "from-amber-500 to-orange-500",
      accent: "text-orange-600",
      glow: "from-amber-400/20 to-orange-400/10"
    },
    {
      number: "03",
      title: "Conscious Living",
      description: "Mindful choices for a sustainable future. Every product crafted with purpose, every choice made with care.",
      icon: "✨",
      color: "from-purple-500 to-rose-500",
      accent: "text-purple-600",
      glow: "from-purple-400/20 to-rose-400/10"
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FCF8F2] py-28 md:py-40" // Reduced padding slightly
      onMouseMove={handleMouseMove}
    >
      {/* BACKGROUND - Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu"> {/* transform-gpu forces hardware acceleration */}

        {/* Using MotionValues for transform - GPU optimized, no re-renders */}
        <motion.div
          style={{ x: glowX, y: glowY, opacity: 0.6 }}
          className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-gradient-to-br from-amber-200/30 to-orange-100/10 rounded-full blur-3xl" // Reduced size and simplified gradient
        />

        <motion.div
          style={{ x: negGlowX, y: negGlowY, opacity: 0.6 }}
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-200/25 to-teal-100/10 rounded-full blur-3xl"
        />

        {/* Geometric overlay - Static is fine */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl px-6 mx-auto relative z-10">

        {/* HEADER */}
        <motion.div
          className="text-center mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeInUp} className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-amber-200/40 text-sm font-semibold text-amber-800 tracking-widest uppercase shadow-sm">
              Our Philosophy
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-7xl font-black text-[#0F0F0F] leading-tight mb-6 tracking-tight"
            variants={fadeInUp}
          >
            Wellness In Flow
          </motion.h2>

          <motion.p
            className="text-lg md:text-2xl text-neutral-700 max-w-3xl mx-auto leading-relaxed font-medium"
            variants={fadeInUp}
          >
            At PurnaRoutine, wellness isn't a moment — it's a continuous flow. A daily ritual that begins when you wake up and stays with you till night.
          </motion.p>
        </motion.div>

        {/* CARDS */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {philosophyItems.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative group perspective-1000"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md border border-amber-100 shadow-xl shadow-amber-900/5 p-8 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-1">

                {/* Simplified Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative z-10 flex flex-col h-full items-start text-left">

                  {/* Number */}
                  <div className={`text-4xl font-black opacity-10 mb-4 ${item.accent}`}>
                    {item.number}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FOOTER */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 text-neutral-400 font-serif italic">
            <span className="h-px w-8 bg-neutral-300"></span>
            Crafted with intention
            <span className="h-px w-8 bg-neutral-300"></span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}