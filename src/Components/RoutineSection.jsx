import React from "react";
import { motion } from "framer-motion";

const timelineEvents = [
    {
        time: "6 AM",
        title: "Oral Care Essentials",
        description: "Start fresh with safe, gentle, natural formulations.",
        icon: "🌅",
    },
    {
        time: "10 AM",
        title: "Body Care",
        description: "Stay energized with cleansing and nourishing essentials.",
        icon: "🚿",
    },
    {
        time: "4 PM",
        title: "Hand & Hygiene",
        description: "Midday freshness that keeps you active and confident.",
        icon: "👐",
    },
    {
        time: "8 PM",
        title: "Hair & Skin Ritual",
        description: "Wash away the day with calm, herbal nourishment.",
        icon: "🛁",
    },
    {
        time: "10 PM",
        title: "Night Care",
        description: "End the day with products crafted for rest, repair, and renewal.",
        icon: "🌙",
    },
];

const RoutineSection = () => {
    return (
        <section className="py-20 bg-[#FDF8F0] border-t overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
                        Your Day, Made Whole
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        From refreshing oral care to nurturing night-time rituals, experience wellness that completes your entire day.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-200 -translate-x-1/2"></div>

                    <div className="space-y-12 md:space-y-24">
                        {timelineEvents.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Content */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className={`md:max-w-md ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}>
                                        <span className="inline-block px-4 py-1 bg-[var(--color-orange)] text-white text-sm rounded-full mb-4">
                                            {event.time}
                                        </span>
                                        <h3 className="text-2xl mb-2">{event.title}</h3>
                                        <p className="text-neutral-600">{event.description}</p>
                                    </div>
                                </div>

                                {/* Icon/Marker */}
                                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white border-4 border-[var(--color-orange)] rounded-full text-3xl shadow-lg">
                                    {event.icon}
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="flex-1 hidden md:block"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoutineSection;
