import React from "react";

const features = [
  {
    icon: "🌿",
    title: "Safe, natural-inspired ingredients",
    text: "Carefully selected ingredients inspired by Ayurvedic wisdom.",
  },
  {
    icon: "🇮🇳",
    title: "Designed for everyday Indian routines",
    text: "Crafted specifically for Indian lifestyles and daily needs.",
  },
  {
    icon: "☀️",
    title: "Morning-to-night complete care",
    text: "Comprehensive wellness solutions for your entire day.",
  },
  {
    icon: "🏭",
    title: "Conscious, responsible manufacturing",
    text: "Ethical production processes with environmental consciousness.",
  },
  {
    icon: "🤝",
    title: "Vocal for Local brand ecosystem",
    text: "Supporting local communities and Indian craftsmanship.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-white border-b border-black">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-normal mb-12">
          Why The Purna?
        </h2>


        <div className="hidden md:flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {features.map((f, i) => (
              <Feature key={i} {...f} />
            ))}
          </div>

          <div className="flex justify-center">
            <video
              playsInline
              autoPlay
              loop
              muted
              preload="metadata"
              className="w-full max-w-md lg:max-w-lg"
              src="/public/videos/Capsule Video (3).mp4"
              poster="//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/f087c0f71002463594892e68000dfe75.thumbnail.0000000000_600x.jpg?v=1736152625"
            />
          </div>
        </div>


        <div className="md:hidden flex flex-col items-center">

          <div className="flex justify-center mb-8">
            <video
              playsInline
              autoPlay
              loop
              muted
              preload="metadata"
              className=" w-full max-w-xs sm:max-w-sm"
              src="//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/f087c0f71002463594892e68000dfe75/f087c0f71002463594892e68000dfe75.HD-720p-4.5Mbps-40573155.mp4?v=0"
              poster="//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/f087c0f71002463594892e68000dfe75.thumbnail.0000000000_600x.jpg?v=1736152625"
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-8">
            {features.map((f, i) => (
              <Feature key={i} {...f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, text, smallText }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="text-4xl mb-2">{icon}</div>
      <div>
        <h3 className="text-lg md:text-xl lg:text-2xl mb-2">{title}</h3>
        <p
          className={`text-gray-600 ${smallText ? "text-xs md:text-base lg:text-lg" : "text-sm"
            }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
