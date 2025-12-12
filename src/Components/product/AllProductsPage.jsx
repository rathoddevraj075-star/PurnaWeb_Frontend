import React, { useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { products } from "../data/product";
import Lenis from 'lenis';

const AllProductsPage = () => {
    const containerRef = useRef(null);

    // Initialize Lenis Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Extract unique categories with metadata
    const categories = useMemo(() => {
        const uniqueCats = [...new Set(products.map((p) => p.category).filter(Boolean))];
        return uniqueCats.map(cat => {
            const catProducts = products.filter(p => p.category === cat);
            return {
                name: cat,
                count: catProducts.length,
                image: catProducts[0]?.images[0] || "",
                theme: catProducts[0]?.themeColor || "#000"
            };
        });
    }, []);

    // Parallax Header Logic
    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 500], [0, 200]);
    const headerOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    return (
        <>
            <Navbar />

            <div className="bg-white min-h-screen" ref={containerRef}>

                {/* 1. Parallax Hero Header */}
                <div className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-neutral-900 text-white">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616401784845-180886c90b96?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />

                    <motion.div
                        style={{ y: headerY, opacity: headerOpacity }}
                        className="relative z-10 text-center px-4"
                    >
                        <h1 className="text-[10vw] sm:text-[5rem] font-black uppercase tracking-tighter leading-[0.9] mb-4">
                            Collections
                        </h1>
                        <p className="text-lg sm:text-xl text-neutral-300 font-light max-w-xl mx-auto">
                            Explore our curated ranges.
                        </p>
                    </motion.div>
                </div>

                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-20 lg:py-32">
                    {/* Category Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, index) => (
                            <Link key={cat.name} to={`/collections/${cat.name.toLowerCase().replace(/\s+/g, '-')}/immersive`} className="group block relative h-[60vh] overflow-hidden rounded-[2rem]">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative w-full h-full"
                                >
                                    <div className="absolute inset-0 bg-neutral-200" style={{ backgroundColor: cat.theme }}>
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-white/60 text-sm font-bold tracking-widest uppercase mb-2 block">Collection</span>
                                                <h2 className="text-4xl text-white font-bold leading-none mb-2">{cat.name}</h2>
                                                <p className="text-white/80">{cat.count} Products</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                                                <ArrowUpRight size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProductsPage;
