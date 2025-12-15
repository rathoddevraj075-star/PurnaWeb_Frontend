import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import AnnoucementBar from "../AnnoucementBar";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { blogService } from "../../services/api";

const BlogDetailPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchBlog();
        fetchRelatedPosts();
    }, [slug]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await blogService.getBlogBySlug(slug);
            setPost(response.data);
        } catch (err) {
            console.error('Failed to fetch blog:', err);
            setError('Blog post not found');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedPosts = async () => {
        try {
            const response = await blogService.getBlogs({ limit: 4 });
            setRelatedPosts((response.data || []).filter(p => p.slug !== slug).slice(0, 3));
        } catch (err) {
            console.error('Failed to fetch related posts:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FCF8F2] flex flex-col">
                <AnnoucementBar />
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--color-orange)] rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    // Error / Not Found State
    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#FCF8F2] flex flex-col">
                <AnnoucementBar />
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="text-4xl font-serif mb-4">Post Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
                    <Link to="/journal" className="underline hover:text-[var(--color-orange)]">Back to Journal</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#FCF8F2] min-h-screen selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden scrollbar-hide">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-[var(--color-orange)] origin-left z-[100]"
                style={{ scaleX }}
            />

            <AnnoucementBar />
            <Navbar />

            <article className="relative">
                {/* Header / Hero */}
                <header className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-3 text-xs md:text-sm tracking-[0.25em] uppercase text-gray-500 mb-8 border border-gray-300 rounded-full px-4 py-2 bg-white/50 backdrop-blur-sm">
                            <span className="text-[var(--color-orange)]">{formatDate(post.publishedAt || post.createdAt)}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="capitalize">{post.category || 'Wellness'}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#151515] leading-[1.1] mb-10 tracking-tight">
                            {post.title}
                        </h1>

                        {/* Author or Category Tag */}
                        {post.author && (
                            <div className="flex justify-center items-center gap-4 text-sm font-medium text-gray-500">
                                <span className="uppercase tracking-widest">By {post.author.name || 'The Purna Team'}</span>
                            </div>
                        )}
                    </motion.div>
                </header>

                {/* Featured Image - Parallax Effect */}
                {post.featuredImage && (
                    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mb-20 md:mb-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl relative group"
                        >
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-in-out"
                            />
                            <div className="absolute inset-0 bg-black/10"></div>
                        </motion.div>
                    </div>
                )}

                {/* Content Layout */}
                <div className="max-w-4xl mx-auto px-6 mb-32 relative">

                    {/* Main Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="prose prose-lg md:prose-xl prose-neutral 
                                prose-headings:font-serif prose-headings:text-[#151515] prose-headings:tracking-tight prose-headings:mt-12 prose-headings:mb-6
                                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                                prose-a:text-[var(--color-orange)] prose-a:no-underline prose-a:border-b prose-a:border-[var(--color-orange)] hover:prose-a:bg-orange-50 
                                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
                                prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-orange)] prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-serif prose-blockquote:text-gray-800 prose-blockquote:bg-transparent prose-blockquote:my-10
                                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:mb-2 prose-li:text-gray-600
                                [&>.lead]:text-2xl [&>.lead]:font-medium [&>.lead]:text-gray-800 [&>.lead]:mb-10 [&>.lead]:leading-snug
                                [&>.drop-cap]:first-letter:text-7xl [&>.drop-cap]:first-letter:text-[#151515] [&>.drop-cap]:first-letter:float-left [&>.drop-cap]:first-letter:mr-4 [&>.drop-cap]:first-letter:leading-[0.8]"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex flex-wrap gap-3">
                                    {post.tags.map((tag, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back Link */}
                        <div className="mt-16 pt-10 border-t border-gray-200 flex justify-between items-center">
                            <Link to="/journal" className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase hover:text-[var(--color-orange)] transition-colors group">
                                <span className="w-8 h-[1px] bg-black group-hover:bg-[var(--color-orange)] transition-colors"></span>
                                Back to Journal
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Enhanced 'Read Next' Section */}
                {relatedPosts.length > 0 && (
                    <div className="bg-white py-24 px-6 border-t border-gray-100">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-between items-end mb-16">
                                <div>
                                    <span className="text-[var(--color-orange)] tracking-[0.2em] uppercase text-sm block mb-4">Curated for you</span>
                                    <h3 className="text-4xl md:text-5xl font-serif text-[#151515]">Continue Reading</h3>
                                </div>
                                <Link to="/journal" className="hidden md:inline-block text-sm underline decoration-gray-300 underline-offset-8 hover:text-[var(--color-orange)] hover:decoration-[var(--color-orange)] transition-all">
                                    View All Stories
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {relatedPosts.map((related, idx) => (
                                    <motion.div
                                        key={related._id || related.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Link to={`/journal/${related.slug}`} className="group block h-full flex flex-col">
                                            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-100 relative">
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                                {related.featuredImage ? (
                                                    <img
                                                        src={related.featuredImage}
                                                        alt={related.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                                                        <span className="text-5xl text-orange-300">📝</span>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs uppercase tracking-widest border border-white/50 px-3 py-1 rounded-full backdrop-blur-sm bg-white/10">
                                                    Read Story
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <span className="text-xs text-gray-400 uppercase tracking-widest mb-3">{formatDate(related.publishedAt || related.createdAt)}</span>
                                                <h4 className="font-serif text-2xl text-[#151515] group-hover:text-[var(--color-orange)] transition-colors mb-3 leading-tight">{related.title}</h4>
                                                <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">{related.excerpt}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </article>

            <Footer />
        </div>
    );
};

export default BlogDetailPage;
