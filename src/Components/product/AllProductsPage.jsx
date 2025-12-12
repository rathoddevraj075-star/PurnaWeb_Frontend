import React, { useMemo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Lenis from 'lenis';
import { productService, categoryService } from '../../services/api';

const AllProductsPage = () => {
    const containerRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Fetch categories and products
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    categoryService.getCategories(),
                    productService.getProducts()
                ]);

                const fetchedCategories = categoriesRes.data || [];
                const fetchedProducts = productsRes.data || [];

                // Build category data with product info
                const categoriesWithProducts = fetchedCategories.map(cat => {
                    const catProducts = fetchedProducts.filter(p =>
                        p.category?._id === cat._id || p.category === cat._id
                    );
                    return {
                        ...cat,
                        count: catProducts.length,
                        image: catProducts[0]?.images?.[0]?.url || cat.image || "",
                        theme: catProducts[0]?.themeColor || "#000"
                    };
                });

                setCategories(categoriesWithProducts);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Parallax Header Logic
    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 500], [0, 200]);
    const headerOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center min-h-screen bg-white">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                        <span className="text-neutral-500 text-sm uppercase tracking-widest">Loading Collections...</span>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

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
                    {categories.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-neutral-500">No collections available yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((cat, index) => (
                                <Link key={cat._id || cat.slug} to={`/collections/${cat.slug}/immersive`} className="group block relative h-[60vh] overflow-hidden rounded-[2rem]">
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
                                                    <span className="text-white/60 text-sm tracking-widest uppercase mb-2 block">Collection</span>
                                                    <h2 className="text-4xl text-white leading-none mb-2">{cat.name}</h2>
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
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProductsPage;
