"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { blogPosts } from "./blog/blogData";

const BlogSection = () => {
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
            {blogPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <article className="flex flex-col">
                  <a href={`/journal/${post.slug}`} className="overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                  </a>
                  <div className="mt-4 flex-1 flex flex-col ">
                    <span className="text-xs uppercase tracking-wider text-gray-500">
                      {post.date}
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
          {blogPosts.map((post) => (
            <article key={post.id} className="flex flex-col bg-white">
              <a href={`/journal/${post.slug}`} className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
                />
              </a>
              <div className="mt-4 flex-1 flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  {post.date}
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


// import React from "react";

// const blogPosts = [
//   {
//     id: 1,
//     date: "January 20, 2025",
//     title: "The Power of Omega-3: Why You Need It in Your Diet",
//     excerpt:
//       "Omega-3 fatty acids are essential fats that play a critical role in maintaining overall health. Unlike some nutrients that your body can produce, Omega-3s must come from your diet or...",
//     image:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/articles/blog-omega-3_e3b19c2b-6d4c-47c5-a629-f009b208824a.jpg?v=1743089410",
//     link: "/blogs/news/the-power-of-omega-3-why-you-need-it-in-your-diet",
//   },
//   {
//     id: 2,
//     date: "January 19, 2025",
//     title: "Feel Better Every Day: Supplements for a Happier, Healthier You",
//     excerpt:
//       "Life can be demanding, and feeling your best every day can sometimes feel like a challenge. But what if there was a simple way to boost your energy, mood, and...",
//     image:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/articles/blog-post-2.jpg?v=1737279075",
//     link: "/blogs/news/feel-better-every-day-supplements-for-a-happier-healthier-you",
//   },
//   {
//     id: 3,
//     date: "January 19, 2025",
//     title: "The Science Behind Quality: Inside Our Supplement Laboratory",
//     excerpt:
//       "When it comes to supplements, quality is everything. That’s why we’ve made it our mission to ensure every product you purchase meets the highest standards of safety and efficacy. At...",
//     image:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/articles/blog-post-1c.jpg?v=1737287602",
//     link: "/blogs/news/the-science-behind-quality-inside-our-supplement-laboratory",
//   },
// ];

// const BlogSection = () => {
//   return (
//     <div>
//       <section className="bg-[#fafafa] py-16 border-t border-b">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid md:grid-cols-3 gap-8">
//           {blogPosts.map((post) => (
//             <article key={post.id} className="flex flex-col">
//               {/* Blog Image */}
//               <a href={post.link} className="overflow-hidden">
//                 <img
//                   src={post.image}
//                   alt={post.title}
//                   className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
//                 />
//               </a>

//               {/* Blog Content */}
//               <div className="mt-4 flex-1 flex flex-col">
//                 <span className="text-xs uppercase tracking-wider text-gray-500">
//                   {post.date}
//                 </span>
//                 <h3 className="mt-2 text-lg font-semibold leading-snug">
//                   <a href={post.link} className="hover:underline">
//                     {post.title}
//                   </a>
//                 </h3>
//                 <p className="mt-2 text-gray-600 text-sm flex-1">{post.excerpt}</p>
//                 <div className="mt-4">
//                   <a
//                     href={post.link}
//                     className="text-sm font-semibold uppercase tracking-wide border-b border-black pb-0.5 hover:border-gray-500 transition-colors"
//                   >
//                     Read More
//                   </a>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>

//     </div>
    
//   );
// };

// export default BlogSection;
