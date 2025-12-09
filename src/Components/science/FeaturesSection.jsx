import React from "react";

const features = [
  {
    icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/eng-ico.png?v=1737042253&width=1000",
    title: "ENGINEERED FOR EFFECTIVENESS",
    text: "Our formulations are crafted to maximize potency and absorption.",
  },
  {
    icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nogmo-2.png?v=1737037297&width=1000",
    title: "NON GMO",
    text: "We carefully evaluate every ingredient, ensuring they are non-GMO.",
  },
  {
    icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nometal-2.png?v=1737037996&width=1000",
    title: "NO HEAVY METALS",
    text: "We guarantee the highest purity, ensuring our products are free from heavy metals.",
  },
  {
    icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/lab.png?v=1737037643&width=1000",
    title: "THIRD-PARTY TESTED",
    text: "We hold ourselves and our ingredients to the highest standards.",
  },
  {
    icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/vegan-2.png?v=1737037101&width=1000",
    title: "VEGAN",
    text: "We ensure the highest standards with 100% vegan, cruelty-free formulations.",
  },
  {
    icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/quality.png?v=1737037585&width=1000",
    title: "QUALITY INGREDIENTS",
    text: "We're dedicated to using scientifically backed, high-quality natural ingredients.",
  },
];

function Feature({ icon, title, text, smallText }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2 lg:mb-20">
      <img src={icon} alt={title} className="w-14 h-14 object-contain" />
      <div>
        <h3 className="font-bold text-sm">{title}</h3>
        <p
          className={`text-black ${
            smallText ? "text-xs md:text-base  max-w-[210px]" : "text-sm"
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

const FeaturesSection = () => {
  return (
    <>
      <section
        id="science-rich-text"
        className="bg-[#fcf8f2] py-13  lg:ml-4"
        data-section-id="science-rich-text"
      >
        <div className="max-w-5xl mx-auto text-center px-4">
          {/* Top Heading */}
          <p className="text-sm font-medium text-gray-700 lg:mb-3">
            Wellness Inc.
          </p>

          {/* Main Rich Text with inline images */}
          <h3 className="text-lg md:text-4xl font-bold uppercase">
            Sustainable{" "}
            <img
              src="//wonder-theme-wellness.myshopify.com/cdn/shop/files/blog-post-3.jpg?v=1737287369&width=200"
              alt="Sustainability Illustration"
              className="inline-block w-8 h-8 sm:w-14 sm:h-14 rounded-full md:w-12 md:h-12 align-middle"
            />{" "}
            Solutions
            <br />
            for a Healthier{" "}
            <img
              src="//wonder-theme-wellness.myshopify.com/cdn/shop/files/relax-mobile-image.jpg?v=1737219992&width=200"
              alt="Relaxation Illustration"
              className="inline-block w-8 h-8 sm:w-14 sm:h-14 rounded-full md:w-12 md:h-12 align-middle"
            />{" "}
            Life.
          </h3>
        </div>
      </section>

      <section className="bg-[#FCF8F2] py-16 border-b border-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-3 gap-30 items-center">
          {/* Left features */}
          <div className="flex flex-col space-y-16">
            {features.slice(0, 3).map((f, i) => (
              <Feature key={i} {...f} />
            ))}
          </div>

          {/* Center video */}
          <div className="flex justify-center">
            <video
              playsInline
              autoPlay
              loop
              muted
              preload="metadata"
              className="w-[35rem] max-w-sm lg:max-w-3xl"
              src="https://wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/f087c0f71002463594892e68000dfe75/f087c0f71002463594892e68000dfe75.HD-720p-4.5Mbps-40573155.mp4?v=0"
              poster="//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/f087c0f71002463594892e68000dfe75.thumbnail.0000000000_600x.jpg?v=1736152625"
            />
          </div>

          {/* Right features */}
          <div className="flex flex-col space-y-16">
            {features.slice(3).map((f, i) => (
              <Feature key={i} {...f} />
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex flex-col items-center space-y-10">
          {/* Video */}
          <div className="w-full flex justify-center">
            <video
              playsInline
              autoPlay
              loop
              muted
              preload="metadata"
              className="w-full max-w-xs sm:max-w-sm"
              src="https://wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/f087c0f71002463594892e68000dfe75/f087c0f71002463594892e68000dfe75.HD-720p-4.5Mbps-40573155.mp4?v=0"
              poster="//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/f087c0f71002463594892e68000dfe75.thumbnail.0000000000_600x.jpg?v=1736152625"
            />
          </div>

          {/* Features stacked */}
          <div className="grid grid-cols-1 gap-10">
            {features.map((f, i) => (
              <Feature key={i} {...f} />
            ))}
          </div>
        </div>

        {/* CTA button */}
        <div className="mt-12 flex justify-center">
          <a
            href="/products/mens-multi"
            className="border border-black px-6 py-3 rounded-md text-sm font-semibold tracking-wide hover:bg-black hover:text-white transition"
          >
            CHECK PRODUCTS
          </a>
        </div>
      </div>
    </section>
    </>
  );
};

export default FeaturesSection;
