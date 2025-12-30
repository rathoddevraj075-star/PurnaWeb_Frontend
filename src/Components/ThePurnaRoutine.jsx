import React from 'react';
import { motion } from 'framer-motion';

const RoutineSection = ({ title, description, step, color, align }) => {
    return (
        <div className={`flex flex-col md:flex-row items-center gap-12 py-24 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 space-y-6">
                <span className="text-sm tracking-[0.2em] text-gray-500 uppercase">{step}</span>
                <h2 className={`text-4xl md:text-5xl font-serif text-[${color}]`}>{title}</h2>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">{description}</p>
            </div>
            <div className="flex-1 w-full relative group">
                <div className="aspect-[4/5] bg-[#f4f1ea] rounded-full overflow-hidden relative">
                    {/* Placeholder for images - in a real app these would be actual images */}
                    <div className={`absolute inset-0 bg-${color}/10 mix-blend-multiply opacity-50`}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-serif italic text-2xl">
                        {title} Visualization
                    </div>
                </div>
                {/* Decorative circle */}
                <div className={`absolute -inset-4 border border-${color}/20 rounded-full scale-95 group-hover:scale-100 transition-transform duration-700 ease-out`}></div>
            </div>
        </div>
    );
};

const ThePurnaRoutine = () => {
    const sections = [
        {
            step: "Morning Ritual",
            title: "Wake Up & Refresh",
            description: "Start fresh with oral care and gentle cleansers. Awaken your senses and prepare for the day with intention.",
            color: "#D97706", // Amber
            align: "left"
        },
        {
            step: "Midday Freshness",
            title: "Stay Active & Vibrant",
            description: "Stay active with refreshing hygiene essentials. Keep your energy high and your spirit lifted throughout the day.",
            color: "#059669", // Emerald
            align: "right"
        },
        {
            step: "Evening Reset",
            title: "Wash Away The Day",
            description: "Wash off the day with nourishing care. Transition from the busyness of the outside world to the comfort of home.",
            color: "#4F46E5", // Indigo
            align: "left"
        },
        {
            step: "Nightly Nourishment",
            title: "Rest & Restore",
            description: "Calm your senses with restorative routines. Prepare your body and mind for deep, rejuvenating sleep.",
            color: "#7C3AED", // Violet
            align: "right"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FCF8F2] pt-32 pb-20 px-6 md:px-12 lg:px-24">

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto text-center mb-32 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-6xl md:text-8xl font-serif text-[var(--color-orange)] mb-8">
                        The Purna Routine
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 font-light italic max-w-2xl mx-auto">
                        "A Ritual That Completes Your Day"
                    </p>
                </motion.div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-orange-100/30 to-rose-100/30 blur-3xl -z-10 rounded-full"></div>
            </div>

            {/* Sections */}
            <div className="max-w-6xl mx-auto">
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                        <RoutineSection
                            step={section.step}
                            title={section.title}
                            description={section.description}
                            color={section.color}
                            align={section.align}
                        />
                        {index < sections.length - 1 && (
                            <div className="h-24 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-auto my-12"></div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Footer Call to Action */}
            <div className="text-center mt-32">
                <h3 className="text-3xl font-serif mb-8">Ready to start your routine?</h3>
                <a href="/products" className="inline-block border border-black px-12 py-4 uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
                    Explore Essentials
                </a>
            </div>

        </div>
    );
};

export default ThePurnaRoutine;
