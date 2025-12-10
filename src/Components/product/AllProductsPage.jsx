import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, ArrowUpRight, Plus } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { products } from "../data/product";

const AllProductsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
        return cats;
    }, []);

    // Filter products
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "All") return products;
        return products.filter((p) => p.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <>
            <Navbar />
            <div className="bg-[#FDF8F0] min-h-screen pt-24 pb-20">
                {/* Header Section */}
                <section className="text-center px-6 mb-16 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
                    >
                        All Essentials. <br className="hidden md:block" />
                        <span className="text-[var(--color-orange)]">One Complete Routine.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-neutral-600 max-w-2xl mx-auto"
                    >
                        Discover our full range of products crafted for your daily wellbeing.
                        From oral care to skin rejuvenation, we have you covered.
                    </motion.p>
                </section>

                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-32">
                            <h3 className="text-xl mb-6 flex items-center gap-2">
                                <Filter size={20} /> Filters
                            </h3>

                            <div className="space-y-2">
                                <p className="text-sm text-neutral-400 uppercase tracking-wider mb-3">Category</p>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === cat
                                            ? "bg-black text-white shadow-lg"
                                            : "hover:bg-white text-neutral-600 hover:text-black"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden flex justify-between items-center mb-6">
                        <span className="text-lg">{filteredProducts.length} Products</span>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm font-medium"
                        >
                            Filters <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* Mobile Filter Drawer */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsFilterOpen(false)} />
                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    className="fixed top-0 right-0 h-full w-80 bg-white z-50 p-6 shadow-2xl overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl">Filters</h3>
                                        <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm text-neutral-400 uppercase tracking-wider mb-3">Category</p>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === cat
                                                    ? "bg-black text-white"
                                                    : "bg-neutral-50 text-neutral-600"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                                >
                                    <Link to={`/products/${product.id}`} className="flex-1 flex flex-col">
                                        {/* Image */}
                                        <div className="relative h-64 bg-[#F5F5F5] overflow-hidden p-6 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-[var(--color-orange)]/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out origin-center" />
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="relative z-10 w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-black hover:bg-[var(--color-orange)] hover:text-white transition-colors">
                                                    <Plus size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-xs tracking-widest uppercase text-[var(--color-orange)]">
                                                    {product.category || "Essential"}
                                                </span>
                                                <span className="text-sm">${product.price}</span>
                                            </div>
                                            <h3 className="text-lg mb-2 text-neutral-900 group-hover:text-[var(--color-orange)] transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-neutral-500 text-sm mb-4 line-clamp-2 flex-1">
                                                {product.tagline || product.description}
                                            </p>

                                            <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-sm font-medium text-neutral-500 group-hover:text-black transition-colors">
                                                <span>View Details</span>
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl text-neutral-400">No products found in this category.</p>
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className="mt-4 text-[var(--color-orange)] hover:underline"
                                >
                                    View all products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProductsPage;
