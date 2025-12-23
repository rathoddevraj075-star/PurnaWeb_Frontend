import React from "react";
import { motion } from "framer-motion";

export default function PhilosophySection() {
  const philosophyItems = [
    {
      number: "01",
      title: "Complete Ritual ",
      description: "Essentials designed for every moment of your day.",
      color: "bg-emerald-900",
      text: "text-emerald-50",
      border: "border-emerald-900/10"
    },
    {
      number: "02",
      title: "Natural Formulations",
      description: "Gentle, effective ingredients inspired by Ayurvedic wisdom.",
      color: "bg-amber-900",
      text: "text-amber-50",
      border: "border-amber-900/10"
    },
    {
      number: "03",
      title: "Modern Wellness",
      description: "Clean design, contemporary feel, everyday comfort.",
      color: "bg-rose-900",
      text: "text-rose-50",
      border: "border-rose-900/10"
    }
  ];

  return (
    <section className="bg-[#Fdfbf7] py-24 md:py-40 relative border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        {/* Header - Swiss Style Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 border-t border-neutral-900/10 pt-12">
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-[7rem] font-serif leading-[0.9] text-neutral-900 tracking-tight"
            >
              Care That <br />
              <span className="italic text-neutral-400">Feels Complete</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-end pb-4">
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-800 leading-relaxed max-w-md ml-auto text-right font-medium"
            >
              At The Purna, we believe wellness is not a moment — it's a flow. A daily ritual that begins when you wake up and stays with you till night. Our products are crafted to complete every part of your routine with purity, intention, and care.
            </motion.p>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-neutral-200">
          {philosophyItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative border-r border-b border-neutral-200 p-8 md:p-12 lg:p-16 h-[50vh] min-h-[400px] flex flex-col justify-between hover:bg-white transition-colors duration-500"
            >
              {/* Number */}
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold tracking-widest uppercase text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  ( {item.number} )
                </span>
                <div className={`w-2 h-2 rounded-full ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6 group-hover:translate-x-2 transition-transform duration-500">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-lg leading-relaxed max-w-xs group-hover:text-neutral-800 transition-colors">
                  {item.description}
                </p>
              </div>

              {/* Hover Line */}
              <div className={`absolute bottom-0 left-0 h-1 bg-neutral-900 w-0 group-hover:w-full transition-all duration-500 ease-out`} />
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-neutral-200/50 text-xs font-mono text-neutral-400 uppercase tracking-widest">
          <span>Est. 2024</span>
          <span>Purna Routine</span>
        </div>

      </div>
    </section>
  );
}