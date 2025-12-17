import React from "react";
import { motion } from "framer-motion";
import AnnoucementBar from "../AnnoucementBar";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Newsletter from "../NewsLetter";

const values = [
  {
    title: "Vocal for Local",
    text: "Working closely with Indian farmers, manufacturers & suppliers.",
    icon: "🇮🇳",
  },
  {
    title: "Ingredient Transparency",
    text: "Safe, clear, trustworthy formulas.",
    icon: "🔍",
  },
  {
    title: "Everyday Accessibility",
    text: "Rituals built for every home and every routine.",
    icon: "🏠",
  },
  {
    title: "Holistic Wellness",
    text: "A complete approach to personal care.",
    icon: "🌿",
  },
];

const About = () => {
  return (
    <div className="bg-[#FCF8F2] min-h-screen w-full selection:bg-orange-100 selection:text-orange-900">
      <AnnoucementBar />
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 md:pt-48 md:pb-32 px-4 md:px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] md:w-[120%] md:h-[120%] bg-gradient-to-r from-orange-100/40 to-rose-100/40 blur-[100px] -z-10 rounded-full animate-pulse-slow"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="inline-block text-[#d9634c] tracking-[0.25em] uppercase mb-4 md:mb-6 text-xs md:text-sm border border-[var(--color-orange)]/20 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
              About PurnaRoutine
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-[#151515] leading-[1.1] md:leading-[1.1] mb-6 md:mb-8 tracking-tight">
              Rooted in Wholeness. <br className="hidden sm:block" />
              <span className="italic font-light text-gray-600 block sm:inline mt-2 sm:mt-0 relative">
                Designed for Life.
                <svg className="absolute -bottom-2 left-0 w-full h-2 md:h-4 text-[var(--color-orange)]/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="max-w-xl md:max-w-2xl mx-auto text-base md:text-xl text-gray-600 leading-relaxed px-4">
              We bring together Ayurvedic-inspired wisdom and modern simplicity to create daily rituals that feel complete.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story & Purpose - Split Layout */}
      <section className="py-16 md:py-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* Left Column: The Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            <div className="relative pl-6 md:pl-0">
              <span className="hidden md:block text-[8rem] md:text-[10rem] font-serif text-orange-100/40 absolute -top-20 -left-16 select-none -z-10 pointer-events-none">01</span>
              <h2 className="text-3xl md:text-5xl font-serif mb-6 md:mb-8 text-[#151515]">The Meaning of "Purna"</h2>
              <div className="h-1 w-20 bg-[#d9634c] mb-6 md:mb-8 rounded-full"></div>
              <p className="text-lg md:text-xl text-gray-800 font-medium italic mb-6 leading-relaxed">
                “Purna” means complete — whole, fulfilled, balanced.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                This philosophy guides everything we create. True wellness isn’t about a single product; it’s about the small, consistent rituals that shape your day.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                We curate essentials that support you from the moment you wake until you rest your head at night.
              </p>
            </div>
          </motion.div>

          {/* Right Column: The Purpose */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-1 lg:order-2"
          >
            <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-orange-50 h-full flex flex-col justify-center relative overflow-hidden group hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.1)] transition-all duration-500">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="relative z-10 text-left">
                <span className="inline-block text-xs tracking-widest text-[#151515]/40 uppercase mb-4 border border-[#151515]/10 px-3 py-1 rounded-md">Our Mission</span>
                <h3 className="text-2xl md:text-4xl font-serif mb-4 md:mb-6 text-[#151515]">Simplifying Wellness</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
                  We started PurnaRoutine to demystify Ayurveda for the modern generation. To create a brand that feels natural, safe, and trustworthy—without the complexity.
                </p>
                <p className="text-base md:text-lg font-medium text-[#151515] border-l-2 border-[#d9634c] pl-4">
                  Our goal: To make daily self-care effortless and meaningful for every Indian household.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Routine Link Visual Section - Parallax style */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden relative bg-[#1F4D2B] text-white shadow-2xl transform hover:scale-[1.01] transition-transform duration-700">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367563-12123d8d3247?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F4D2B]/90 via-[#1F4D2B]/40 to-transparent"></div>

          <div className="relative z-10 py-16 px-6 md:py-28 md:px-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif mb-6 tracking-tight">Wellness that flows with you.</h2>
              <p className="text-base sm:text-lg md:text-2xl font-light text-gray-100 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed">
                Discover "PurnaRoutine" — a curated rhythm of care designed to support your body and mind from sunrise to sunset.
              </p>
              <a href="/routine" className="inline-flex items-center gap-2 bg-white text-[#1F4D2B] px-8 py-3 md:px-10 md:py-4 rounded-full text-sm md:text-base tracking-wide hover:bg-orange-50 transition-all transform hover:-translate-y-1 duration-300 shadow-lg hover:shadow-xl">
                EXPLORE THE ROUTINE
                <span className="text-lg">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 px-4 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-[#d9634c] tracking-[0.2em] uppercase text-xs md:text-sm">Our Ethos</span>
            <h2 className="text-3xl md:text-6xl font-serif mt-4 text-[#151515]">Guided by Conscious Care</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group p-6 md:p-8 rounded-2xl bg-[#FCF8F2] hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col items-center text-center"
              >
                <div className="text-4xl md:text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0">{value.icon}</div>
                <h3 className="text-lg md:text-xl mb-3 font-serif text-[#151515]">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Final Statement */}
      <section className="py-20 md:py-32 px-6 bg-[#FCF8F2] text-center border-t border-gray-200/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl md:text-5xl font-serif text-gray-400 italic leading-tight">
            "We believe that when you feel whole,<br className="hidden md:block" /> you can give your best to the world."
          </h2>
        </motion.div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default About;
