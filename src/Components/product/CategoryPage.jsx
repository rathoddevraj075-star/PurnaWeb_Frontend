import React, { useMemo, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { products } from "../data/product";
import Lenis from 'lenis';

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
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

    // Convert URL slug to category name
    const categoryName = useMemo(() => {
        if (!category) return "";
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, [category]);

    // Filter products by category
    const categoryProducts = useMemo(() => {
        return products.filter(p => p.category === categoryName);
    }, [categoryName]);

    // Get theme color from first product
    const themeColor = categoryProducts[0]?.themeColor || "#E65800";

    // Parallax Header Logic
    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 500], [0, 200]);
    const headerOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    if (!categoryProducts.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
                    <p className="text-neutral-600 mb-6">Could not find products for "{categoryName}"</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-black text-white px-6 py-3 rounded-full"
                    >
                        Back to Collections
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="bg-white min-h-screen" ref={containerRef}>

                {/* Hero Header */}
                <div
                    className="relative h-[60vh] flex items-center justify-center overflow-hidden text-white"
                    style={{ backgroundColor: themeColor }}
                >
                    <div className="absolute inset-0 bg-black/20" />

                    <motion.div
                        style={{ y: headerY, opacity: headerOpacity }}
                        className="relative z-10 text-center px-4"
                    >
                        <button
                            onClick={() => navigate('/products')}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm uppercase tracking-widest">All Collections</span>
                        </button>

                        <h1 className="text-[12vw] sm:text-[6rem] font-black uppercase tracking-tighter leading-[0.9] mb-4">
                            {categoryName}
                        </h1>
                        <p className="text-lg sm:text-xl text-white/80 font-light max-w-xl mx-auto">
                            {categoryProducts.length} products in this collection
                        </p>
                    </motion.div>

                    {/* Immersive View CTA */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                        <Link
                            to={`/collections/${category}/immersive`}
                            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-2xl"
                        >
                            <span>Enter Immersive View</span>
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-20 lg:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <Link to={`/products/${product.id}`} className="block">
                                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100 mb-6">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-xs uppercase tracking-widest text-neutral-400">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-[var(--color-orange)] transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-neutral-600 line-clamp-2">{product.tagline}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </>
    );
};

export default CategoryPage;
