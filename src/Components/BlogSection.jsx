"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { blogService } from "../services/api";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="bg-neutral-50 py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">From The Purna Journal</h2>
            <p className="text-base md:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover insights, tips, and stories about complete wellness from morning to night.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-neutral-900 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null; // Don't show section if no blogs
  }

  return (
    <section className="bg-neutral-50 py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">From The Purna Journal</h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover insights, tips, and stories about complete wellness from morning to night.
          </p>
        </div>
        {/* ✅ Mobile Slider */}
        <div className="block md:hidden ">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
          >
            {blogs.map((post) => (
              <SwiperSlide key={post._id || post.id}>
                <article className="flex flex-col">
                  <a href={`/journal/${post.slug}`} className="overflow-hidden">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                        <span className="text-4xl text-orange-300">📝</span>
                      </div>
                    )}
                  </a>
                  <div className="mt-4 flex-1 flex flex-col ">
                    <span className="text-xs uppercase tracking-wider text-gray-500">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold leading-snug">
                      <a href={`/journal/${post.slug}`} className="hover:underline">
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-4">
                      <a
                        href={`/journal/${post.slug}`}
                        className="text-sm font-semibold uppercase tracking-wide border-b border-black pb-0.5 hover:border-gray-500 transition-colors"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ✅ Desktop 3-Column Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <article key={post._id || post.id} className="flex flex-col bg-white">
              <a href={`/journal/${post.slug}`} className="overflow-hidden">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                    <span className="text-5xl text-orange-300">📝</span>
                  </div>
                )}
              </a>
              <div className="mt-4 flex-1 flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <h3 className="mt-2 text-lg font-semibold leading-snug">
                  <a href={`/journal/${post.slug}`} className="hover:underline">
                    {post.title}
                  </a>
                </h3>
                <p className="mt-2 text-gray-600 text-sm flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-4">
                  <a
                    href={`/journal/${post.slug}`}
                    className="text-sm font-semibold uppercase tracking-wide border-b border-black pb-0.5 hover:border-gray-500 transition-colors"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ✅ Explore More CTA */}
        <div className="text-center mt-16">
          <a
            href="/journal"
            className="inline-block bg-neutral-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors duration-300"
          >
            Explore More
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
