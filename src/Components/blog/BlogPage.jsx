import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "./blogData";
import AnnoucementBar from "../AnnoucementBar";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Newsletter from "../NewsLetter";

const BlogPage = () => {
    // Simple scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FCF8F2] min-h-screen selection:bg-orange-100 selection:text-orange-900">
            <AnnoucementBar />
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 text-center max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[var(--color-orange)] tracking-[0.2em] uppercase text-sm md:text-base">
                        The Journal
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mt-6 text-[#151515]">
                        Stories of <span className="italic font-light text-gray-600">Wholeness</span>
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Explore insights on Ayurveda, modern wellness, and the rituals that complete your day.
                    </p>
                </motion.div>
            </section>

            {/* Blog Grid */}
            <section className="px-6 pb-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="flex flex-col group cursor-pointer"
                        >
                            <Link to={`/journal/${post.slug}`} className="block overflow-hidden rounded-2xl mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                </div>
                            </Link>

                            <div className="flex flex-col flex-1">
                                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gray-400 mb-3 font-medium">
                                    <span>{post.date}</span>
                                    <span>Wellness</span>
                                </div>
                                <h2 className="text-2xl font-serif text-[#151515] leading-tight mb-4 group-hover:text-[var(--color-orange)] transition-colors duration-300">
                                    <Link to={`/journal/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="text-gray-600 line-clamp-3 mb-6 flex-1 text-base leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <Link to={`/journal/${post.slug}`} className="inline-flex items-center text-sm uppercase tracking-widest text-[#151515] hover:text-[var(--color-orange)] transition-colors group/link">
                                    Read Story
                                    <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            <Newsletter />
            <Footer />
        </div>
    );
};

export default BlogPage;
