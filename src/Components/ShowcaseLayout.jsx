import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "./data/product";
import { ArrowRight } from "lucide-react";

const ShowcaseItem = ({ product, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const isEven = index % 2 === 0;

    // Smooth Parallax for image
    const yImg = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

    return (
        <section
            ref={ref}
            className="group relative min-h-[80vh] flex items-center py-24 border-b border-[#151515]/10 bg-[#FDF8F0] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col md:flex-row items-center gap-12 md:gap-24">

                {/* Image Side */}
                <div className={`flex-1 w-full flex justify-center items-center ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <motion.div style={{ y: yImg }} className="relative w-full max-w-md aspect-[4/5] bg-white rounded-t-[100px] rounded-b-[0px] overflow-hidden shadow-sm border border-[#151515]/5">
                        {/* Product Image */}
                        <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-b from-white to-[#FDF8F0]">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-contain grayscale-0 group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Content Side */}
                <div className={`flex-1 text-center ${isEven ? 'md:text-left md:order-2' : 'md:text-right md:order-1'}`}>
                    <span className="inline-block text-[#E65800] text-sm tracking-[0.2em] uppercase mb-4">
                        {product.category}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-[#151515] leading-[1] mb-6 tracking-tight">
                        {product.name}
                    </h2>
                    <p className="text-lg text-[#151515]/70 leading-relaxed mb-10 max-w-md mx-auto md:mx-0 inline-block">
                        {product.tagline}
                    </p>

                    <div className={`${isEven ? 'md:justify-start' : 'md:justify-end'} flex justify-center`}>
                        <Link
                            to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}/immersive`}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#151515] text-white rounded-full hover:bg-[#E65800] transition-colors duration-300"
                        >
                            <span className="font-medium tracking-wide text-sm uppercase">View Details</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

            </div>

            {/* Large Number Background */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'left-5' : 'right-5'} text-[20vw] font-black text-[#151515] opacity-[0.02] pointer-events-none leading-none select-none`}>
                0{index + 1}
            </div>
        </section>
    );
};

const ShowcaseLayout = () => {
    // Show top 3 products
    const showcaseProducts = products.slice(0, 3);

    return (
        <div className="relative">
            {showcaseProducts.map((product, index) => (
                <ShowcaseItem key={product.id} product={product} index={index} />
            ))}

            <div className="py-24 bg-[#151515] text-center">
                <h3 className="text-white text-3xl md:text-4xl mb-8 font-medium">Discover the full collection.</h3>
                <Link
                    to="/products"
                    className="inline-block px-10 py-5 border border-white text-white uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-300 rounded-full"
                >
                    Shop All
                </Link>
            </div>
        </div>
    );
};

export default ShowcaseLayout;
