// src/components/ui/SwiperNavButtons.jsx
import { useSwiper } from "swiper/react";

function SwiperNavButtons() {
  const swiper = useSwiper();

  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
      {/* Prev Button */}
      <button
        onClick={() => swiper.slidePrev()}
        className="bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={() => swiper.slideNext()}
        className="bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default SwiperNavButtons;
