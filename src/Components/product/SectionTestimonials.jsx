// src/components/product/SectionTestimonials.jsx
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function SectionTestimonials({ testimonials = [], themeColor = "#55acea" }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  // After swiper instance & refs exist, wire up navigation + external pagination
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    // connect navigation buttons
    if (prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      // Destroy/init/update to ensure Swiper picks up the DOM nodes
      if (swiper.navigation) {
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }

    // connect external pagination (container with class .custom-pagination)
    const pager = document.querySelector(".custom-pagination");
    if (pager) {
      swiper.params.pagination.el = pager;
      if (swiper.pagination) {
        swiper.pagination.destroy();
        swiper.pagination.init();
        swiper.pagination.update();
      }
    }
  }, [testimonials]); // run whenever testimonials change / first mount

  return (
    <section className="relative py-4 border-b border-black" style={{ backgroundColor: themeColor }}>
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
          {/* Swiper area */}
          <div className="relative w-full md:flex-1">
            {/* Prev button (will be wired by useEffect) */}
            <button
              ref={prevRef}
              aria-label="Previous slide"
              className="absolute -left-14 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-3 z-20"
            >
              {/* chevron-left */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Next button */}
            <button
              ref={nextRef}
              aria-label="Next slide"
              className="absolute -right-14 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-3 z-20"
            >
              {/* chevron-right */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <Swiper
              modules={[Navigation, Autoplay,]}
              slidesPerView={1}
              loop
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              pagination={{ clickable: true, el: ".custom-pagination" }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="relative"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Image side */}
                    <div className="h-[420px] md:h-[420px] w-full">
                      <img src={t.image} alt={t.author} className="rounded-xl object-cover w-full h-full" />
                    </div>

                    {/* Card side */}
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center h-[355px]">
                      <div className="flex mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.459a1 1 0 00-1.175 0l-3.386 2.459c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        ))}
                      </div>

                      <p className="mt-2 text-lg text-gray-800 leading-relaxed">{t.text}</p>
                      <span className="mt-4 block font-semibold text-gray-700">- {t.author}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>


        </div>
      </div>
    </section>
  );
}
