"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Calendar } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { blogService } from "../services/api";

export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogService.getBlogs({ limit: 3 });
        setBlogs(response.data || []);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return null;
  if (!blogs.length) return null;

  return (
    <section className="bg-[#FFFBF0] py-24 md:py-32 overflow-hidden border-t border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <span className="text-amber-600 font-mono text-xs tracking-widest uppercase mb-4 block">Blogs</span>
            <h2 className="text-4xl md:text-6xl font-serif text-neutral-900 leading-none">
              Stories of <br />
              <span className="text-neutral-400 italic">Wellness & Ritual.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/blog" className="group flex items-center gap-2 text-neutral-900 border-b border-neutral-300 pb-1 hover:border-neutral-900 transition-colors">
              <span className="uppercase tracking-widest text-xs">Read All Stories</span>
              <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* --- DESKTOP: Magazine Grid --- */}
        <div className="hidden lg:grid grid-cols-3 gap-x-8 gap-y-12">
          {blogs.map((post, index) => (
            <JournalCard key={post._id} post={post} index={index} />
          ))}
        </div>

        {/* --- MOBILE: Horizontal Snap Scroll --- */}
        {/* --- MOBILE: Touch Slider (Swiper) --- */}
        <div className="lg:hidden -mx-6 px-6">
          <Swiper
            spaceBetween={24}
            slidesPerView={1.2}
            className="w-full !overflow-visible"
            grabCursor={true}
          >
            {blogs.map((post, index) => (
              <SwiperSlide key={post._id} className="h-auto">
                <JournalCard post={post} index={index} isMobile />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}

function JournalCard({ post, index, isMobile }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col h-full cursor-pointer"
    >
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden rounded-[2rem] mb-6 relative aspect-[4/5]">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <span className="text-4xl opacity-20 font-serif">Aa</span>
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-neutral-900">
          {formatDate(post.publishedAt || post.createdAt)}
        </div>
      </Link>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-amber-600 text-[10px] font-bold tracking-[0.2em] uppercase">
            {post.category?.name || 'Editorial'}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 leading-tight mb-4 group-hover:underline decoration-1 underline-offset-4">
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 flex-1">
          {post.excerpt}
        </p>

        <Link
          to={`/blog/${post.slug}`}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 group/link"
        >
          Read Story
          <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
