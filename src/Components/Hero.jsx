import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full grid grid-cols-1 lg:grid-cols-2 border-b border-black">
      {/* LEFT SIDE - Video with text */}
      <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[650px] lg:min-h-[700px] flex items-center justify-center lg:justify-start">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/public/images/Web-Image.png"
          autoPlay
          loop
          muted
          playsInline
          poster="https://wonder-theme-wellness.myshopify.com/cdn/shop/files/main-image-wellness-desktop-new.jpg?v=1737546402&width=2000"
        />

        {/* Overlay Content */}
        <div
          className="
            relative z-10 px-6 lg:px-11 
            flex flex-col items-center text-center
            lg:items-start lg:text-left
            pb-10 lg:pb-14
          "
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl tracking-wide font-black md:mb-4 sm:mb-1">
            Complete Care for the Complete You
          </h1>
          <p className="text-sm md:text-base text-gray-800 md:mb-7 sm:mb-5 mb-5 tracking-wide max-w-2xl">
            From your morning routine to your nightly wind-down, The Purna brings you pure, effective essentials inspired by Ayurveda and crafted for modern wellness.
          </p>
          <a
            href="#products"
            className="inline-block px-8 sm:mt-4 py-3 mt-4 sm:py-3 lg:py-5 border border-black tracking-widest text-gray-900 text-sm sm:text-sm md:text-base font-bold uppercase rounded-xl bg-white hover:bg-black hover:text-white transition"
          >
            Explore Our Essentials
          </a>
        </div>
      </div>

      {/* RIGHT SIDE - Product Image (only desktop) */}
      <div className="hidden lg:block relative h-full">
        <img
          src="/public/images/Web-Image.png"
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
