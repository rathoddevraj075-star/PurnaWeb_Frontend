import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

const STEPS = [
    {
        id: "01",
        time: "6 AM",
        title: "Oral Care Essentials",
        description: "Start fresh with safe, gentle, natural formulations.",
        image: "https://images.unsplash.com/photo-1555820585-c5ae44394b79?q=80&w=1000&auto=format&fit=crop",
        accent: "text-amber-600",
        bgAccent: "bg-amber-600"
    },
    {
        id: "02",
        time: "10 AM",
        title: "Body Care",
        description: "Stay energized with cleansing and nourishing essentials.",
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1000&auto=format&fit=crop",
        accent: "text-teal-600",
        bgAccent: "bg-teal-600"
    },
    {
        id: "03",
        time: "4 PM",
        title: "Hand & Hygiene",
        description: "Midday freshness that keeps you active and confident.",
        image: "https://images.unsplash.com/photo-1571781926291-280553da1e54?q=80&w=1000&auto=format&fit=crop",
        accent: "text-blue-600",
        bgAccent: "bg-blue-600"
    },
    {
        id: "04",
        time: "8 PM",
        title: "Hair & Skin Ritual",
        description: "Wash away the day with calm, herbal nourishment.",
        image: "https://images.unsplash.com/photo-1512290923902-8a9281aa0f46?q=80&w=1000&auto=format&fit=crop",
        accent: "text-indigo-600",
        bgAccent: "bg-indigo-600"
    },
    {
        id: "05",
        time: "10 PM",
        title: "Night Care",
        description: "End the day with products crafted for rest, repair, and renewal.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
        accent: "text-purple-600",
        bgAccent: "bg-purple-600"
    }
];

export default function RoutineSection() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="bg-[#FFFBF0] py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* Header - Compact */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
                    <div>
                        <span className="text-amber-600 font-mono text-xs tracking-widest uppercase mb-3 block">Daily Rituals</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 leading-tight">
                            Your Day, <br /> <span className="text-neutral-400 italic">Made Whole.</span>
                        </h2>
                    </div>
                    <p className="text-neutral-500 text-sm md:text-base max-w-md leading-relaxed">
                        From refreshing oral care to nurturing night-time rituals, experience wellness that completes your entire day.
                    </p>
                </div>

                {/* --- Desktop: Interactive Split --- */}
                <div className="hidden lg:grid grid-cols-12 gap-12 items-start min-h-[600px]">

                    {/* Left: List */}
                    <div className="col-span-5 flex flex-col justify-center h-full gap-2">
                        {STEPS.map((step, index) => (
                            <div
                                key={step.id}
                                onMouseEnter={() => setActiveStep(index)}
                                className={`group cursor-pointer relative pl-8 py-6 border-l-2 transition-all duration-300 ${activeStep === index ? 'border-neutral-900' : 'border-neutral-200'}`}
                            >
                                <div className={`text-xs font-mono font-bold tracking-widest uppercase mb-1 transition-colors ${activeStep === index ? step.accent : 'text-neutral-400'}`}>
                                    {step.time}
                                </div>
                                <h3 className={`text-3xl font-serif transition-colors ${activeStep === index ? 'text-neutral-900' : 'text-neutral-300 group-hover:text-neutral-400'}`}>
                                    {step.title}
                                </h3>
                                <div className={`overflow-hidden transition-all duration-500 ${activeStep === index ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-neutral-500 leading-relaxed text-sm">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Fixed Image Stage */}
                    <div className="col-span-7 relative h-[600px] rounded-[2rem] overflow-hidden bg-white shadow-xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={STEPS[activeStep].image}
                                    alt={STEPS[activeStep].title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                {/* Floating Badge */}
                                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${STEPS[activeStep].bgAccent}`} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">{STEPS[activeStep].title}</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* --- Mobile: Compact List --- */}
                <div className="lg:hidden flex flex-col gap-4">
                    {STEPS.map((step) => (
                        <div key={step.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-start gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                                <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-1 ${step.accent}`}>
                                    {step.time}
                                </div>
                                <h3 className="text-lg font-serif text-neutral-900 leading-tight mb-1">{step.title}</h3>
                                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
