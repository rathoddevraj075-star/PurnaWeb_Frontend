// ProductPageContent.jsx
"use client";

import AnnoucementBar from "../AnnoucementBar";
import { useState, useRef, useEffect } from "react";
import { Plus, Minus, ChevronLeft, ChevronRight, CheckCircle, Star } from "lucide-react";
import Navbar from "../Navbar";
import FAQSection from "./FAQSection";
import SectionTestimonials from "./SectionTestimonials";
import FeatureBanner from "./FeatureBanner";
import SectionNewsletter from "./SectionNewsLetter";
import Footer from "../Footer";
import SectionHero from "./SectionHero";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "../data/product";

const M = motion;

/* -------------------- SECTION: Key Benefits -------------------- */
function KeyBenefitsSection({ benefits }) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-16 bg-[#FCF8F2] border-t border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl uppercase tracking-wide mb-4">
            Key Benefits
          </h2>
          <div className="w-20 h-1 bg-[var(--color-orange)] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[var(--color-orange)]/10 p-3 rounded-full text-[var(--color-orange)]">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2">{benefit}</h3>
                <p className="text-neutral-600 text-sm">Scientifically formulated to deliver visible results.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- SECTION: Hero Ingredient -------------------- */
function HeroIngredientSection({ ingredient }) {
  if (!ingredient) return null;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-orange)]/10 rounded-full blur-3xl transform scale-150"></div>
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="text-[var(--color-orange)] tracking-widest uppercase text-sm mb-2 block">
              Hero Ingredient
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              {ingredient.name}
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              {ingredient.description}
            </p>
            <div className="inline-block px-6 py-3 bg-[#FDF8F0] rounded-lg border border-[var(--color-orange)]/20 text-[var(--color-orange)] font-medium">
              Powered by Nature
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- SECTION: Usage & Suitability -------------------- */
function UsageSection({ howToUse, suitableFor }) {
  return (
    <section className="py-20 bg-[#F9F9F9] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* How to Use */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm">
          <h3 className="text-2xl mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
            How to Use
          </h3>
          <ul className="space-y-4">
            {howToUse?.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 bg-[var(--color-orange)] rounded-full mt-2.5"></div>
                <p className="text-neutral-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Suitable For */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm">
          <h3 className="text-2xl mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">2</span>
            Suitable For
          </h3>
          <ul className="space-y-4">
            {suitableFor?.map((item, i) => (
              <li key={i} className="flex items-center gap-4 p-4 bg-[#FDF8F0] rounded-xl">
                <CheckCircle size={20} className="text-[var(--color-orange)]" />
                <span className="font-medium text-neutral-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------- SECTION: Cross Sell -------------------- */
function CrossSellSection({ crossSellIds }) {
  if (!crossSellIds || crossSellIds.length === 0) return null;

  const crossSellProducts = products.filter(p => crossSellIds.includes(p.id));

  return (
    <section className="py-20 bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">Complete Your Routine</h2>
          <p className="text-neutral-600">Pair with these essentials for maximum benefits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {crossSellProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="group block">
              <div className="bg-[#FDF8F0] rounded-2xl p-8 mb-6 relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-2">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-contain mix-blend-multiply"
                />
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={20} />
                </div>
              </div>
              <h3 className="text-xl mb-2 group-hover:text-[var(--color-orange)] transition-colors">{product.name}</h3>
              <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="text-lg">${product.price.toFixed(2)}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- SECTION: Scrolling Banner -------------------- */
function ScrollingBanner({ product }) {
  if (!product.scrollingBanner) return null;

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden border-b border-black">
      <img
        src={product.scrollingBanner.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
        <div className="overflow-hidden whitespace-nowrap w-full">
          <M.div
            className="text-white font-extrabold uppercase text-[6vw] tracking-wide inline-block"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {product.scrollingBanner.text} • {product.scrollingBanner.text} •{" "}
            {product.scrollingBanner.text} •
          </M.div>
        </div>

        <a
          href={product.scrollingBanner.ctaLink || "/science"}
          className="mt-8 px-8 py-4 bg-white text-black rounded-full hover:bg-[var(--color-orange)] hover:text-white transition-all transform hover:scale-105"
        >
          {product.scrollingBanner.ctaText}
        </a>
      </div>
    </section>
  );
}

/* -------------------- MAIN PRODUCT PAGE -------------------- */
export default function ProductPageContent({ product }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSupplement, setSelectedSupplement] = useState(
    product.supplements?.[0]?.name || ""
  );
  const [openPanels, setOpenPanels] = useState(() => new Set());

  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
    setImageIndex(0); // Reset image on product change
    setOpenPanels(new Set()); // Reset accordion
  }, [product.id]);

  const nextSlide = () =>
    setImageIndex((prev) => (prev + 1) % product.images.length);
  const prevSlide = () =>
    setImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  function togglePanel(idx) {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  // Helper to render accordion content
  function renderAccordionContent(title, content) {
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside space-y-2">
          {content.map((item, i) => (
            <li key={i} className="text-sm text-white/90">
              {typeof item === "string" ? item : (
                <><strong>{item.title || item.name}:</strong> {item.description || item.text || ""}</>
              )}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof content === "string") return <p className="text-white/90">{content}</p>;
    return <pre className="whitespace-pre-wrap text-white/90">{JSON.stringify(content, null, 2)}</pre>;
  }

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AnnoucementBar />
      <Navbar />

      {/* Product Hero */}
      <div
        className="lg:min-h-[90vh] flex flex-col lg:flex-row items-center lg:items-start justify-center px-6 lg:px-20 gap-10 pt-24 pb-20"
        style={{ backgroundColor: product.themeColor }}
      >
        {/* LEFT: Thumbnails */}
        <div className="hidden lg:flex flex-col gap-6 lg:mt-10 lg:pl-10 cursor-pointer">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setImageIndex(i)}
              className={`lg:w-20 lg:h-20 object-contain rounded-xl cursor-pointer border-2 transition 
          ${i === imageIndex ? "border-white" : "border-transparent bg-white/10"}`}
            />
          ))}
        </div>

        {/* CENTER: Main Image */}
        <div className="relative group flex-1 flex justify-center items-center">
          {imageIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 z-20 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <M.img
            key={imageIndex}
            src={product.images[imageIndex]}
            alt={product.name}
            className="w-[280px] sm:w-[400px] lg:w-[500px] xl:w-[600px] object-contain drop-shadow-2xl"
            initial={isFirstRender.current ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {imageIndex < product.images.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-0 z-20 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex-1 space-y-6 lg:pr-10 mt-10 lg:mt-0 text-white max-w-xl">
          <div>
            <h3 className="uppercase tracking-widest text-xs mb-2 opacity-80">Plant-Based Wellness</h3>
            <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight mb-3">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-lg lg:text-xl font-medium text-white/90 italic">
                {product.tagline}
              </p>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {product.tags.map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-base leading-relaxed opacity-90">
            {product.description}
          </p>

          {/* Supplement Selector */}
          {product.supplements?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/20">
              <p className="font-medium text-sm">
                Target Area: <span className="">{selectedSupplement}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.supplements.map((supp) => (
                  <button
                    key={supp.name}
                    onClick={() => setSelectedSupplement(supp.name)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedSupplement === supp.name
                      ? "bg-white text-[var(--color-orange)] scale-110 shadow-lg"
                      : "bg-white/20 hover:bg-white/30"
                      }`}
                    title={supp.name}
                  >
                    <img src={supp.icon} alt={supp.name} className="w-6 h-6 object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price + Cart */}
          <div className="pt-6 space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl">${product.price.toFixed(2)}</span>
              <span className="text-sm opacity-70">Tax included</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-white/10 rounded-xl border border-white/20 overflow-hidden w-full sm:w-auto">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-4 hover:bg-white/10 transition"><Minus size={18} /></button>
                <span className="px-6">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-4 hover:bg-white/10 transition"><Plus size={18} /></button>
              </div>

              <button className="flex-1 bg-white text-black tracking-widest px-8 py-4 rounded-xl text-sm hover:bg-neutral-200 transition-colors shadow-lg">
                ADD TO CART
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm opacity-80 justify-center sm:justify-start">
              <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              <span>10,000+ Happy Customers</span>
            </div>
          </div>

          {/* Accordion */}
          <div className="divide-y divide-white/20 border-t border-white/20 mt-8">
            {Object.entries(product.accordion || {}).map(([title, content], idx) => {
              const isOpen = openPanels.has(idx);
              return (
                <div key={title} className="py-4">
                  <button
                    className="flex items-center justify-between w-full cursor-pointer uppercase tracking-wide text-sm hover:opacity-80 transition"
                    onClick={() => togglePanel(idx)}
                  >
                    <span>{title}</span>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pb-2 text-sm leading-relaxed">
                          {renderAccordionContent(title, content)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            )}
          </div>
        </div>
      </div>

      <KeyBenefitsSection benefits={product.keyBenefits} />
      <HeroIngredientSection ingredient={product.heroIngredient} />
      <UsageSection howToUse={product.howToUse} suitableFor={product.suitableFor} />
      <CrossSellSection crossSellIds={product.crossSell} />
      <ScrollingBanner product={product} />

      <FAQSection />
      <SectionHero themeColor={product.themeColor} />
      <SectionTestimonials
        testimonials={product.testimonials}
        themeColor={product.themeColor}
      />
      <FeatureBanner />
      <SectionNewsletter themeColor={product.themeColor} />
      <Footer />
    </>
  );
}

// import AnnoucementBar from "../AnnoucementBar";
// import { useState, useRef, useEffect } from "react";
// import { Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
// import Navbar from "../Navbar";
// import FAQSection from "./FAQSection";
// import SectionTestimonials from "./SectionTestimonials";
// import FeatureBanner from "./FeatureBanner";
// import SectionNewsletter from "./SectionNewsLetter";
// import Footer from "../Footer";
// import SectionHero from "./SectionHero";
// import { motion } from "framer-motion";

// /* -------------------- SECTION 1: Benefits -------------------- */
// const features = [
//   {
//     icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nogmo-2.png?v=1737037297&width=1000",
//     title: "Non-GMO",
//     text: "We carefully evaluate every ingredient, ensuring they are non-GMO.",
//   },
//   {
//     icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/eng-ico.png?v=1737042253&width=1000",
//     title: "Engineered for Effectiveness",
//     text: "Our formulations are crafted to maximize potency and absorption.",
//   },
//   {
//     icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/vegan-2.png?v=1737037101&width=1000",
//     title: "Vegan",
//     text: "We ensure the highest standards with 100% vegan, cruelty-free formulations.",
//   },
//   {
//     icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/quality.png?v=1737037585&width=1000",
//     title: "Quality Ingredients",
//     text: "We're dedicated to using scientifically backed, high-quality natural ingredients.",
//   },
//   {
//     icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/lab.png?v=1737037643&width=1000",
//     title: "Third-Party Tested",
//     text: "We hold ourselves and our ingredients to the highest standards.",
//   },
//   {
//     icon: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nometal-2.png?v=1737037996&width=1000",
//     title: "No Heavy Metals",
//     text: "We guarantee the highest purity, ensuring our products are free from heavy metals.",
//   },
// ];

// function BenefitsSection({ product }) {
//   return (
//     <section className="py-16 bg-[#FCF8F2] border-t border-b border-black">
//       <div className="max-w-7xl mx-auto px-6 text-center">
//         <h2 className="text-2xl md:text-3xl font-semibold mb-12">
//           Science-Driven Confidence Boost
//         </h2>

//         {/* ✅ Desktop */}
//         <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-center">
//           <div className="flex flex-col space-y-12">
//             {features.slice(0, 3).map((f, i) => (
//               <Feature key={i} {...f} smallText />
//             ))}
//           </div>

//           {/* Dynamic Video */}
//           <div className="flex justify-center">
//             <video
//               playsInline
//               autoPlay
//               loop
//               muted
//               preload="metadata"
//               className="w-130 max-w-md lg:max-w-2xl rounded-xl"
//               src={product.featuresVideo.src}
//               poster={product.featuresVideo.poster}
//             />
//           </div>

//           <div className="flex flex-col space-y-12">
//             {features.slice(3).map((f, i) => (
//               <Feature key={i} {...f} smallText />
//             ))}
//           </div>
//         </div>

//         {/* ✅ Mobile */}
//         <div className="md:hidden flex flex-col items-center">
//           <div className="flex justify-center mb-8">
//             <video
//               playsInline
//               autoPlay
//               loop
//               muted
//               preload="metadata"
//               className="w-full max-w-xs sm:max-w-sm rounded-xl shadow-md"
//               src={product.featuresVideo.src}
//               poster={product.featuresVideo.poster}
//             />
//           </div>

//           <div className="grid grid-cols-1 gap-8">
//             {features.map((f, i) => (
//               <Feature key={i} {...f} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function Feature({ icon, title, text, smallText }) {
//   return (
//     <div className="flex flex-col items-center text-center space-y-3 ">
//       <img src={icon} alt={title} className="w-14 h-14 object-contain" />
//       <div>
//         <h3 className="font-semibold text-base">{title}</h3>
//         <p
//           className={`text-gray-600 ${
//             smallText ? "text-xs md:text-sm" : "text-sm"
//           }`}
//         >
//           {text}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* -------------------- SECTION 2: Scrolling Banner -------------------- */
// function ScrollingBanner({ product }) {
//   return (
//     <section className="relative w-full h-[80vh] overflow-hidden  border-b border-black">
//       {/* Dynamic Background Image */}
//       <img
//         src={product.scrollingBanner.image}
//         alt={product.name}
//         className="w-full h-full object-cover"
//       />

//       {/* Overlay Content */}
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         {/* Dynamic Scrolling Text */}
//         <div className="overflow-hidden whitespace-nowrap w-full">
//           <motion.div
//             className="text-white font-extrabold uppercase text-[6vw] tracking-wide inline-block"
//             animate={{ x: ["0%", "-100%"] }}
//             transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
//           >
//             {product.scrollingBanner.text} • {product.scrollingBanner.text} •{" "}
//             {product.scrollingBanner.text} •
//           </motion.div>
//         </div>

//         {/* Dynamic CTA */}
//         <a
//           href="/science"
//           className="mt-6 px-6 py-3 border border-black bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white transition"
//         >
//           {product.scrollingBanner.ctaText}
//         </a>
//       </div>
//     </section>
//   );
// }

// /* -------------------- MAIN PRODUCT PAGE -------------------- */
// export default function ProductPageContent({ product }) {
//   const [index, setIndex] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedSupplement, setSelectedSupplement] = useState(
//     product.supplements?.[0]?.name || ""
//   );
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggle = (idx) => {
//     setOpenIndex(openIndex === idx ? null : idx);
//   };

//   const isFirstRender = useRef(true);

//   useEffect(() => {
//     isFirstRender.current = false;
//   }, []);

//   const nextSlide = () => {
//     setIndex((prev) => (prev + 1) % product.images.length);
//   };

//   const prevSlide = () => {
//     setIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
//   };

//   return (
//     <>
//       <AnnoucementBar />
//       <Navbar />

//       {/* Product Hero */}
//       <div
//         className="lg:h-[78vh] text-white flex flex-col lg:flex-row p-6 lg:p-14 gap-8 border-t border-black"
//         style={{ backgroundColor: product.themeColor }}
//       >
//         {/* LEFT: Images */}
//         <div className="relative flex items-center justify-center lg:left-40 lg:w-1/2 group">
//           {/* Prev Button */}
//           {index > 0 && (
//             <button
//               onClick={prevSlide}
//               className="absolute lg:left-42 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
//             >
//               <ChevronLeft size={24} />
//             </button>
//           )}

//           {/* Main Image */}
//           <div className="flex justify-center w-full overflow-hidden">
//             <motion.img
//               key={index}
//               src={product.images[index]}
//               alt={product.name}
//               className="w-72 lg:w-[550px] h-auto object-contain drop-shadow-xl"
//               initial={isFirstRender.current ? false : { opacity: 0, x: 100 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={isFirstRender.current ? false : { opacity: 0, x: -100 }}
//               transition={{ duration: 0.5, ease: "easeInOut" }}
//             />
//           </div>

//           {/* Next Button */}
//           {index < product.images.length - 1 && (
//             <button
//               onClick={nextSlide}
//               className="absolute lg:right-42 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
//             >
//               <ChevronRight size={24} />
//             </button>
//           )}

//           {/* Thumbnails */}
//           <div className="absolute lg:left-25 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
//             {product.images.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 onClick={() => setIndex(i)}
//                 className={`w-16 h-16 rounded-lg cursor-pointer border transition ${
//                   i === index ? "border-white" : "border-transparent"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: Info */}
//         <div className="lg:w-1/2 space-y-2">
//           <h3 className="uppercase tracking-wide text-sm">Plant-Based</h3>
//           <h1 className="text-3xl lg:text-4xl font-extrabold w-125">
//             {product.name}
//           </h1>

//           {/* Tags */}
//           <div className="flex gap-3 flex-wrap">
//             {product.tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="border border-white text-white px-2 rounded-full text-sm"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>

//           <p className="text-lg leading-relaxed">{product.description}</p>

//           {/* Supplement Selector */}
//           {product.supplements?.length > 0 && (
//             <div className="space-y-3">
//               <p className="font-semibold">
//                 Choose Supplement:{" "}
//                 <span className="font-normal">{selectedSupplement}</span>
//               </p>
//               <div className="flex gap-3 flex-wrap">
//                 {product.supplements.map((supp) => (
//                   <button
//                     key={supp.name}
//                     onClick={() => setSelectedSupplement(supp.name)}
//                     className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
//                       selectedSupplement === supp.name
//                         ? "border-white bg-white/20"
//                         : "border-transparent bg-white/10"
//                     }`}
//                   >
//                     <img src={supp.icon} alt={supp.name} className="w-6 h-6" />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Price + Cart */}
//           <div className="space-y-4">
//             <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
//             <div className="flex items-center gap-4">
//               {/* Quantity */}
//               <div className="flex items-center border rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
//                   className="p-2 bg-white/20"
//                 >
//                   <Minus size={16} />
//                 </button>
//                 <span className="px-4">{qty}</span>
//                 <button
//                   onClick={() => setQty(qty + 1)}
//                   className="p-2 bg-white/20"
//                 >
//                   <Plus size={16} />
//                 </button>
//               </div>

//               {/* Add to Cart */}
//               <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
//                 Add to Cart
//               </button>
//             </div>
//             <p className="text-sm text-white/80">
//               +10000 Happy Customers – Free shipping on US
//             </p>
//           </div>

//           {/* Accordion */}
//           <div className="divide-y divide-white/30 border-t border-b border-white/30">
//             {Object.entries(product.accordion).map(([title, content], idx) => (
//               <div key={title} className="py-4">
//                 {/* Header */}
//                 <button
//                   className="flex items-center justify-between w-full cursor-pointer text-lg font-semibold"
//                   onClick={() => toggle(idx)}
//                 >
//                   {title}
//                   {openIndex === idx ? (
//                     <Minus size={20} className="text-white" />
//                   ) : (
//                     <Plus size={20} className="text-white" />
//                   )}
//                 </button>

//                 {/* Content */}
//                 {openIndex === idx && (
//                   <div className="mt-3 text-white/80">
//                     {title === "Benefits" && Array.isArray(content) && (
//                       <ul className="list-disc list-inside space-y-2">
//                         {content.map((item, i) => (
//                           <li key={i}>
//                             <strong>{item.title}:</strong> {item.description}
//                           </li>
//                         ))}
//                       </ul>
//                     )}

//                     {title === "How to Take Supplement?" &&
//                       Array.isArray(content) && (
//                         <ol className="list-decimal list-inside space-y-2">
//                           {content.map((step, i) => (
//                             <li key={i}>{step.step}</li>
//                           ))}
//                         </ol>
//                       )}

//                     {title === "Ingredients" && Array.isArray(content) && (
//                       <ul className="list-disc list-inside space-y-2">
//                         {content.map((ing, i) => (
//                           <li key={i}>{ing.name}</li>
//                         ))}
//                       </ul>
//                     )}

//                     {title !== "Benefits" &&
//                       title !== "How to Take Supplement?" &&
//                       title !== "Ingredients" && <p>{content}</p>}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <BenefitsSection product={product} />
//       <ScrollingBanner product={product} />

//       <FAQSection />
//       <SectionHero themeColor={product.themeColor} />
//       <SectionTestimonials
//         testimonials={product.testimonials}
//         themeColor={product.themeColor}
//       />
//       <FeatureBanner />
//       <SectionNewsletter themeColor={product.themeColor} />
//       <Footer />
//     </>
//   );
// }
// //
