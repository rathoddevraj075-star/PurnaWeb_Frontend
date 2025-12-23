import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function PhilosophySection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  // Smooth scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Mouse tracking for interactive elements
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  // Advanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const headerVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.8
      }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.1
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const titleVariants = {
    hidden: { y: 30, opacity: 0, rotateX: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.15
      }
    }
  };

  const subtitleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14,
        delay: 0.25
      }
    }
  };

  const cardVariants = {
    hidden: (custom) => ({
      y: 60,
      opacity: 0,
      scale: 0.9,
      rotateX: 10,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        delay: custom * 0.12
      }
    }),
    visible: (custom) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: custom * 0.12,
        mass: 0.7
      }
    }),
    hover: (custom) => ({
      y: -12,
      scale: 1.03,
      rotateX: -5,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 20,
        mass: 0.5
      }
    })
  };

  // Floating particles animation
  const particleVariants = {
    animate: (custom) => ({
      y: [0, custom.yOffset, 0],
      x: [0, custom.xOffset, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
      transition: {
        duration: custom.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: custom.delay
      }
    })
  };

  // Interactive glow effect based on mouse position
  const glowVariants = {
    animate: (custom) => ({
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.15, 1],
      x: [0, custom.x * 20, 0],
      y: [0, custom.y * 20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  const philosophyItems = [
    {
      number: "01",
      title: "Holistic Wellness",
      description: "We embrace a holistic approach, nurturing your mind, body, and spirit through pure, intentional formulations.",
      icon: "🌿",
      color: "from-emerald-500 via-teal-500 to-cyan-600",
      accent: "text-emerald-600",
      glow: "from-emerald-400/20 to-cyan-400/10"
    },
    {
      number: "02",
      title: "Ayurvedic Wisdom",
      description: "Rooted in ancient Ayurvedic principles, our products honor timeless traditions for modern balanced living.",
      icon: "🪷",
      color: "from-amber-500 via-orange-500 to-red-600",
      accent: "text-orange-600",
      glow: "from-amber-400/20 to-orange-400/10"
    },
    {
      number: "03",
      title: "Conscious Living",
      description: "Mindful choices for a sustainable future. Every product crafted with purpose, every choice made with care.",
      icon: "✨",
      color: "from-purple-500 via-pink-500 to-rose-600",
      accent: "text-purple-600",
      glow: "from-purple-400/20 to-rose-400/10"
    }
  ];

  // Parallax transforms
  const yBadge = useTransform(smoothScroll, [0, 1], ["0%", "-15%"]);
  const yTitle = useTransform(smoothScroll, [0, 1], ["0%", "-10%"]);
  const opacityGlow = useTransform(smoothScroll, [0, 0.5, 1], [0.3, 0.6, 0.3]);

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FCF8F2] py-28 md:py-40 lg:py-52"
      onMouseMove={handleMouseMove}
    >
      {/* Ultra-Modern Background System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-amber-200/30 via-orange-300/20 to-amber-100/10 rounded-full blur-3xl"
          variants={glowVariants}
          animate="animate"
          custom={{ x: mousePosition.x, y: mousePosition.y }}
          style={{ opacity: opacityGlow }}
        />
        
        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/25 via-teal-300/15 to-cyan-100/10 rounded-full blur-3xl"
          variants={glowVariants}
          animate="animate"
          custom={{ x: -mousePosition.x, y: -mousePosition.y }}
          style={{ animationDelay: "1.5s", opacity: opacityGlow }}
        />

        {/* Floating particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-[1px]"
          variants={particleVariants}
          animate="animate"
          custom={{ yOffset: -20, xOffset: 10, duration: 4, delay: 0 }}
        />
        
        <motion.div
          className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-[1px]"
          variants={particleVariants}
          animate="animate"
          custom={{ yOffset: 15, xOffset: -8, duration: 5, delay: 0.5 }}
        />

        <motion.div
          className="absolute top-1/2 right-1/4 w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-[1px]"
          variants={particleVariants}
          animate="animate"
          custom={{ yOffset: -12, xOffset: 15, duration: 6, delay: 1 }}
        />

        {/* Geometric overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl px-6 mx-auto relative z-10">
        {/* Ultra-Modern Header */}
        <motion.div
          className="text-center mb-24 md:mb-36"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
        >
          {/* Animated Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-xl rounded-full border border-amber-200/40 shadow-lg shadow-amber-500/10 mb-8"
            variants={badgeVariants}
            initial="hidden"
            animate={["visible", "pulse"]}
            style={{ y: yBadge }}
          >
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
            <span className="text-sm font-semibold text-amber-800 tracking-[0.2em] uppercase">Our Philosophy</span>
          </motion.div>

          {/* Main Title with 3D Effect */}
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-black text-[#0F0F0F] leading-[0.95] mb-6 tracking-tight"
            variants={titleVariants}
            style={{ 
              y: yTitle,
              textShadow: "0 2px 0 rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.08)"
            }}
          >
            {/* <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900">
              Wellness Is
            </span> */}
            {/* <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
              A Flow
            </span> */}
          </motion.h2>

          {/* Subtitle with gradient underline */}
          <motion.div
            className="relative inline-block"
            variants={subtitleVariants}
          >
            <motion.p className="text-lg md:text-2xl text-neutral-700 max-w-3xl mx-auto leading-relaxed font-medium px-4">
              At PurnaRoutine, wellness isn't a moment — it's a continuous flow. A daily ritual that begins when you wake up and stays with you till night.
            </motion.p>
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Ultra-Modern Philosophy Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          onMouseMove={handleMouseMove}
        >
          {philosophyItems.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
              className="group relative perspective-1000"
            >
              {/* Card Container */}
              <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-200/30 shadow-xl shadow-amber-500/5 p-8 md:p-10 h-full transform-gpu">
                
                {/* Animated Gradient Border */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-3xl`}
                  initial={false}
                  whileHover={{ opacity: 0.25 }}
                />

                {/* Background Pattern with Hover Effect */}
                <motion.div
                  className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-500"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0px)`,
                    backgroundSize: "16px 16px"
                  }}
                  initial={{ opacity: 0.02 }}
                  whileHover={{ opacity: 0.1 }}
                />

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">
                  
                  {/* Floating Number Badge */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white font-bold text-lg mb-6 shadow-lg shadow-neutral-900/20 ${item.accent}`}
                    animate={{
                      y: [0, -4, 0],
                      rotate: [0, 2, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    {item.number}
                  </motion.div>

                  {/* Interactive Icon */}
                  <motion.div
                    className="text-5xl mb-5 filter drop-shadow-lg"
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 12,
                      y: -4
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 15 
                    }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Title with Gradient Hover */}
                  <motion.h3
                    className="text-2xl md:text-3xl font-black text-[#151515] mb-4 leading-tight"
                    whileHover={{
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      backgroundImage: `linear-gradient(to right, ${item.color.includes('emerald') ? '#059669' : item.color.includes('amber') ? '#D97706' : '#9333EA'}, ${item.color.includes('emerald') ? '#0891B2' : item.color.includes('amber') ? '#EA580C' : '#DB2777'})`,
                      color: "transparent"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-neutral-600 leading-relaxed text-base md:text-lg flex-grow"
                    whileHover={{ color: "#374151" }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.description}
                  </motion.p>

                  {/* Animated Progress Line */}
                  <motion.div
                    className={`mt-6 h-1.5 w-full bg-gradient-to-r ${item.color} rounded-full overflow-hidden`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.3 + index * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <motion.div
                      className="h-full bg-white/30 w-full"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5 + index * 0.2
                      }}
                    />
                  </motion.div>
                </div>

                {/* Interactive Glow Effect */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-br ${item.glow} opacity-0 blur-2xl transition-opacity duration-500 rounded-4xl`}
                  initial={false}
                  whileHover={{ opacity: 0.4 }}
                />

                {/* Corner Accent */}
                <motion.div
                  className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${item.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  whileHover={{ scale: 1.5 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Signature Element */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.3 
          }}
        >
          <div className="relative inline-flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-xl rounded-full border border-amber-200/40 shadow-2xl shadow-amber-500/10">
            <span className="text-sm md:text-base font-semibold text-neutral-700">Crafted with intention</span>
            
            <motion.div
              className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <span className="text-sm md:text-base font-semibold text-neutral-700">Rooted in tradition</span>

            {/* Decorative corner elements */}
            <motion.div
              className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full opacity-60"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-60"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}