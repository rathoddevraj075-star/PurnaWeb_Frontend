// ProductPageContent.jsx - Marvis-Style Premium Product Page
"use client";

import AnnoucementBar from "../AnnoucementBar";
import { useState, useRef, useEffect } from "react";
import { Plus, Minus, ChevronLeft, ChevronRight, CheckCircle, Star, ArrowRight } from "lucide-react";
import Navbar from "../Navbar";
import FAQSection from "./FAQSection";
import SectionTestimonials from "./SectionTestimonials";
import FeatureBanner from "./FeatureBanner";
import SectionNewsletter from "./SectionNewsLetter";
import Footer from "../Footer";
import SectionHero from "./SectionHero";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const M = motion;

/* ========== PREMIUM PRODUCT HERO SECTION ========== */
function ProductHero({ product, imageIndex, setImageIndex }) {
  const [openPanels, setOpenPanels] = useState(() => new Set());
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, [product.id]);

  function togglePanel(idx) {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const nextSlide = () => setImageIndex((prev) => (prev + 1) % product.images.length);
  const prevSlide = () => setImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));

  // Render accordion content
  function renderAccordionContent(content) {
    if (Array.isArray(content)) {
      return (
        <ul className="space-y-3">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2 shrink-0"></span>
              <span className="text-white/80 text-sm leading-relaxed">
                {typeof item === "string" ? item : (
                  <><span className="text-white font-medium">{item.title || item.name}:</span> {item.description || item.text || ""}</>
                )}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    if (typeof content === "string") return <p className="text-white/80 text-sm leading-relaxed">{content}</p>;
    return <pre className="whitespace-pre-wrap text-white/80 text-sm">{JSON.stringify(content, null, 2)}</pre>;
  }

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: product.themeColor }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full opacity-10 bg-white blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-5 bg-black blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col lg:flex-row min-h-screen pt-20 lg:pt-28 pb-12 lg:pb-20 gap-8 lg:gap-16">

          {/* LEFT SIDE - Visual Gallery */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
            {/* Thumbnail strip - Desktop only */}
            <div className="hidden lg:flex flex-col gap-4 order-1">
              {product.images.map((img, i) => (
                <M.button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`relative w-16 h-16 xl:w-20 xl:h-20 rounded-xl overflow-hidden transition-all duration-300 ${i === imageIndex
                    ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110"
                    : "opacity-60 hover:opacity-100"
                    }`}
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileHover={{ scale: i === imageIndex ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2" />
                </M.button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1 flex items-center justify-center order-2 w-full max-w-xl lg:max-w-2xl xl:max-w-3xl">
              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 sm:left-4 z-20 p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={24} />
              </button>

              <AnimatePresence mode="wait">
                <M.img
                  key={imageIndex}
                  src={product.images[imageIndex]}
                  alt={product.name}
                  className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] h-auto object-contain drop-shadow-2xl"
                  initial={isFirstRender.current ? false : { opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
              </AnimatePresence>

              <button
                onClick={nextSlide}
                className="absolute right-0 sm:right-4 z-20 p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight size={24} />
              </button>

              {/* Mobile thumbnail dots */}
              <div className="lg:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === imageIndex ? "bg-white scale-125" : "bg-white/40"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Product Info */}
          <div className="flex-1 flex flex-col justify-center text-white max-w-xl mx-auto lg:mx-0 lg:max-w-lg xl:max-w-xl mt-12 lg:mt-0">
            {/* Category tag */}
            <M.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block text-xs tracking-[0.3em] uppercase opacity-70 mb-4"
            >
              {product.category || "Plant-Based Wellness"}
            </M.span>

            {/* Product name */}
            <M.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4"
            >
              {product.name}
            </M.h1>

            {/* Tagline */}
            {product.tagline && (
              <M.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg sm:text-xl text-white/80 italic mb-6"
              >
                {product.tagline}
              </M.p>
            )}

            {/* Tags */}
            <M.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 text-xs tracking-wide uppercase bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </M.div>

            {/* CTA */}
            <M.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-10"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium text-sm tracking-wide hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
              >
                <span>CONTACT TO PURCHASE</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Trust badge */}
              <div className="flex items-center gap-2 mt-6 text-sm opacity-70">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span>10,000+ Happy Customers</span>
              </div>
            </M.div>

            {/* Accordion */}
            <M.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="border-t border-white/20"
            >
              {Object.entries(product.accordion || {}).map(([title, content], idx) => {
                const isOpen = openPanels.has(idx);
                return (
                  <div key={title} className="border-b border-white/20">
                    <button
                      className="flex items-center justify-between w-full py-5 text-left group"
                      onClick={() => togglePanel(idx)}
                    >
                      <span className="text-sm tracking-[0.15em] uppercase font-medium group-hover:opacity-70 transition-opacity">
                        {title}
                      </span>
                      <M.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Plus size={18} />
                      </M.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <M.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6">
                            {renderAccordionContent(content)}
                          </div>
                        </M.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </M.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== KEY BENEFITS SECTION ========== */
function KeyBenefitsSection({ benefits, themeColor }) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <M.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3 block">Why Choose Us</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-neutral-900">Key Benefits</h2>
          <div className="w-16 h-1 mx-auto mt-6" style={{ backgroundColor: themeColor }}></div>
        </M.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((benefit, index) => (
            <M.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 sm:p-8 bg-white rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:shadow-xl transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${themeColor}15` }}
              >
                <CheckCircle size={24} style={{ color: themeColor }} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{benefit}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Scientifically formulated to deliver visible results.
              </p>
            </M.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== HERO INGREDIENT SECTION ========== */
function HeroIngredientSection({ ingredient, themeColor }) {
  if (!ingredient) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image side */}
          <M.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              {/* Decorative circles */}
              <div
                className="absolute inset-0 rounded-full blur-3xl transform scale-125 opacity-20"
                style={{ backgroundColor: themeColor }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full border-2 opacity-20"
                style={{ borderColor: themeColor }}
              ></div>
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
              />
            </div>
          </M.div>

          {/* Text side */}
          <M.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <span
              className="text-xs tracking-[0.3em] uppercase mb-3 block"
              style={{ color: themeColor }}
            >
              Hero Ingredient
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-neutral-900 mb-6">
              {ingredient.name}
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              {ingredient.description}
            </p>
            <div
              className="inline-block px-6 py-3 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
            >
              Powered by Nature
            </div>
          </M.div>
        </div>
      </div>
    </section>
  );
}

/* ========== USAGE SECTION ========== */
function UsageSection({ howToUse, suitableFor, themeColor }) {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* How to Use */}
          <M.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 sm:p-10 lg:p-12 rounded-3xl shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: themeColor }}
              >
                1
              </div>
              <h3 className="text-xl sm:text-2xl text-neutral-900">How to Use</h3>
            </div>
            <ul className="space-y-5">
              {howToUse?.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
                    style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-neutral-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ul>
          </M.div>

          {/* Suitable For */}
          <M.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 sm:p-10 lg:p-12 rounded-3xl shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: themeColor }}
              >
                2
              </div>
              <h3 className="text-xl sm:text-2xl text-neutral-900">Suitable For</h3>
            </div>
            <ul className="space-y-4">
              {suitableFor?.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                  style={{ backgroundColor: `${themeColor}08` }}
                >
                  <CheckCircle size={20} style={{ color: themeColor }} />
                  <span className="font-medium text-neutral-800">{item}</span>
                </li>
              ))}
            </ul>
          </M.div>
        </div>
      </div>
    </section>
  );
}

/* ========== CROSS SELL SECTION ========== */
function CrossSellSection({ crossSellProducts, themeColor }) {
  // CrossSell products should be passed directly or fetched via API
  // If no products are provided, don't render the section
  if (!crossSellProducts || crossSellProducts.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <M.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3 block">Recommended</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-neutral-900">Complete Your Routine</h2>
          <p className="text-neutral-600 mt-4 max-w-md mx-auto">Pair with these essentials for maximum benefits.</p>
        </M.div>

        {/* Scrollable products */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
          {crossSellProducts.map((product, index) => {
            const imageUrl = product.images?.[0]?.url || product.images?.[0] || '';
            return (
              <M.div
                key={product._id || product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-72 sm:w-auto"
              >
                <Link to={`/products/${product.slug}`} className="group block">
                  <div
                    className="relative rounded-2xl p-8 mb-6 overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl"
                    style={{ backgroundColor: `${product.themeColor || themeColor}15` }}
                  >
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-48 sm:h-56 object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <ArrowRight size={18} className="text-neutral-900" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-[var(--color-orange)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2">{product.shortDescription || product.description}</p>
                </Link>
              </M.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ========== SCROLLING BANNER SECTION ========== */
function ScrollingBanner({ product }) {
  if (!product.scrollingBanner) return null;

  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
      <img
        src={product.scrollingBanner.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
        {/* Scrolling text */}
        <div className="overflow-hidden whitespace-nowrap w-full mb-8">
          <M.div
            className="text-white uppercase text-[8vw] sm:text-[6vw] lg:text-[5vw] tracking-wider inline-block"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {product.scrollingBanner.text} {product.scrollingBanner.text} {product.scrollingBanner.text}
          </M.div>
        </div>

        <Link
          to={product.scrollingBanner.ctaLink || "/science"}
          className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium text-sm tracking-wide hover:bg-white/90 transition-all"
        >
          <span>{product.scrollingBanner.ctaText}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

/* ========== MAIN PRODUCT PAGE ========== */
export default function ProductPageContent({ product }) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [product.id]);

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AnnoucementBar />
      <Navbar />

      {/* Hero Section */}
      <ProductHero
        product={product}
        imageIndex={imageIndex}
        setImageIndex={setImageIndex}
      />

      {/* Content Sections */}
      <KeyBenefitsSection benefits={product.keyBenefits} themeColor={product.themeColor} />
      <HeroIngredientSection ingredient={product.heroIngredient} themeColor={product.themeColor} />
      <UsageSection howToUse={product.howToUse} suitableFor={product.suitableFor} themeColor={product.themeColor} />
      <CrossSellSection crossSellProducts={[]} themeColor={product.themeColor} />
      <ScrollingBanner product={product} />

      {/* Other Sections */}
      <FAQSection />
      <SectionHero themeColor={product.themeColor} />
      <SectionTestimonials testimonials={product.testimonials} themeColor={product.themeColor} />
      <FeatureBanner />
      <SectionNewsletter themeColor={product.themeColor} />
      <Footer />
    </>
  );
}
