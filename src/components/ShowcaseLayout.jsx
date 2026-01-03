import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { productService } from "../services/api";

const CATEGORIES = [
    {
        id: "oral-care",
        name: "Oral Care",
        description: "Clean, fresh, daily-safe formulations for a confident smile.",
        keyword: "oral"
    },
    {
        id: "body-care",
        name: "Body Care",
        description: "Gentle cleansers and nourishes for every skin type.",
        keyword: "body"
    },
    {
        id: "hair-care",
        name: "Hair Care",
        description: "Balanced, natural routines for soft, healthy hair.",
        keyword: "hair"
    },
    {
        id: "face-care",
        name: "Face Care",
        description: "Daily refresh, glow, and clarity.",
        keyword: "face"
    },
    {
        id: "self-care",
        name: "Self-Care Add-ons",
        description: "Everyday essentials for complete wellness.",
        keyword: "kit"
    }
];

export default function ShowcaseLayout() {
    const [categoryProducts, setCategoryProducts] = useState({});
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax Transforms for Columns
    const yCol1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]); // Fast Up
    const yCol2 = useTransform(scrollYProgress, [0, 1], ["10%", "-5%"]); // Slow Anchored
    const yCol3 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]); // Medium Up

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getProducts({ limit: 50 });
                const products = response.data || [];

                const productData = {};
                CATEGORIES.forEach(cat => {
                    const match = products.find(p =>
                        (p.category?.name || '').toLowerCase().includes(cat.keyword) ||
                        (p.name || '').toLowerCase().includes(cat.keyword) ||
                        (p.description || '').toLowerCase().includes(cat.keyword)
                    );
                    productData[cat.id] = match ? {
                        name: match.name,
                        slug: match.slug || match._id,
                        image: match.images?.[0]?.url || match.images?.[0] || '',
                        description: match.shortDescription || match.description?.substring(0, 80) || cat.description
                    } : null;
                    // Fallback
                    if (!productData[cat.id]) {
                        const random = products.find(p => !Object.values(productData).map(pd => pd?.image).includes(p.images?.[0]?.url));
                        if (random) {
                            productData[cat.id] = {
                                name: random.name,
                                slug: random.slug || random._id,
                                image: random.images?.[0]?.url || random.images?.[0] || '',
                                description: random.shortDescription || random.description?.substring(0, 80) || cat.description
                            };
                        }
                    }
                });
                setCategoryProducts(productData);
            } catch (error) {
                console.error("Failed to load category products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section ref={containerRef} className="bg-[#FFFBF0] py-24 md:py-40 relative overflow-hidden min-h-[50vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-neutral-300 border-t-neutral-900 rounded-full" />
            </section>
        );
    }

    return (
        <section ref={containerRef} className="bg-[#FFFBF0] py-24 md:py-40 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1 px] h-full bg-neutral-200 hidden md:block" />

            <div className="max-w-[1440px] mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-24 md:mb-40">
                    <span className="text-amber-600 font-mono text-xs tracking-widest uppercase mb-6 block">Collection</span>
                    <h2 className="text-5xl md:text-8xl font-serif text-neutral-900 leading-[0.9]">
                        Curated <br />
                        <span className="italic text-neutral-400">Essentials.</span>
                    </h2>
                    <div className="mt-8">
                        <Link to="/categories" className="inline-flex items-center gap-2 border-b border-black pb-1 hover:opacity-60 transition-opacity uppercase tracking-widest text-xs font-bold">
                            View All Products <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* --- DESKTOP: Parallax Masonry --- */}
                <div className="hidden lg:grid grid-cols-3 gap-6 xl:gap-8 min-h-[200vh] items-start pb-32">

                    {/* Column 1 (Fast) */}
                    <motion.div style={{ y: yCol1 }} className="flex flex-col gap-16 xl:gap-20 pt-12">
                        <CategoryCard category={CATEGORIES[0]} product={categoryProducts[CATEGORIES[0].id]} />
                        <CategoryCard category={CATEGORIES[3]} product={categoryProducts[CATEGORIES[3].id]} />
                    </motion.div>

                    {/* Column 2 (Slow/Center) */}
                    <motion.div style={{ y: yCol2 }} className="flex flex-col gap-16 xl:gap-20 pt-48">
                        <CategoryCard category={CATEGORIES[1]} product={categoryProducts[CATEGORIES[1].id]} shape="rounded-full" isCenter />
                    </motion.div>

                    {/* Column 3 (Medium) */}
                    <motion.div style={{ y: yCol3 }} className="flex flex-col gap-16 xl:gap-20">
                        <CategoryCard category={CATEGORIES[2]} product={categoryProducts[CATEGORIES[2].id]} />
                        <CategoryCard category={CATEGORIES[4]} product={categoryProducts[CATEGORIES[4].id]} />
                    </motion.div>

                </div>

                {/* --- MOBILE: Alternating Feed --- */}
                <div className="lg:hidden flex flex-col gap-24">
                    {CATEGORIES.map((cat, index) => (
                        <div key={cat.id} className={`flex flex-col gap-6 ${index % 2 === 0 ? '' : 'items-end text-right'}`}>
                            <div className="w-[85%] aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-xl bg-white">
                                {categoryProducts[cat.id]?.image && (
                                    <img src={categoryProducts[cat.id].image} alt={categoryProducts[cat.id]?.name || cat.name} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="w-[85%]">
                                <span className="text-xs font-mono text-amber-600 mb-2 block tracking-widest uppercase">0{index + 1}</span>
                                <h3 className="text-4xl font-serif text-neutral-900 mb-3 leading-none">{categoryProducts[cat.id]?.name || cat.name}</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed mb-4">{categoryProducts[cat.id]?.description || cat.description}</p>
                                <Link to={categoryProducts[cat.id]?.slug ? `/products/${categoryProducts[cat.id].slug}` : `/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-1">
                                    View Product <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

function CategoryCard({ category, product, shape = "rounded-[3rem]", isCenter = false }) {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
    const productSlug = product?.slug;
    const displayName = product?.name || category.name;
    const displayDesc = product?.description || category.description;
    const image = product?.image;

    // Link to product page if product exists, otherwise fallback to category
    const linkTo = productSlug ? `/products/${productSlug}` : `/categories/${categorySlug}`;

    return (
        <div className="group w-full cursor-pointer">
            <Link
                to={linkTo}
                className={`block relative w-full ${isCenter ? 'aspect-square border-4 border-neutral-100' : 'aspect-[4/5]'} ${shape} overflow-hidden bg-white shadow-lg mb-6`}
            >
                {image ? (
                    <img
                        src={image}
                        alt={displayName}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-100" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest">
                        View Product
                    </div>
                </div>
            </Link>

            <div className="text-center px-2">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-neutral-900 mb-2 leading-tight line-clamp-2">
                    {displayName}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-[220px] mx-auto line-clamp-3">
                    {displayDesc}
                </p>
            </div>
        </div>
    )
}
