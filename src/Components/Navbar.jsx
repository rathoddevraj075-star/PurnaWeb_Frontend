"use client";
import { useState, useEffect } from "react";
import { Menu, X, Search, User } from "lucide-react";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Categories for shop dropdown
  const categories = [
    {
      id: "oral-care",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop",
      title: "Oral Care",
    },
    {
      id: "skin-care",
      img: "https://images.unsplash.com/photo-1606208678220-44933923c5e2?q=80&w=1887&auto=format&fit=crop",
      title: "Skin Care",
    },
    {
      id: "body-care",
      img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=1887&auto=format&fit=crop",
      title: "Body Care",
    },
    {
      id: "hair-care",
      img: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=1887&auto=format&fit=crop",
      title: "Hair Care",
    },
  ];

  return (
    <>
      {/* Navbar */}
      <header
        className={`w-full z-50 transition-all duration-500 border-b border-white/10
        bg-white/60 backdrop-blur-md shadow-sm fixed top-0 left-0`}
      >
        {/* -------------------- 📱 Mobile Navbar -------------------- */}
        <div className="flex items-center justify-between px-4 py-2 lg:hidden">
          {/* Left Icons */}
          <div className="flex items-center space-x-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button onClick={() => setSearchOpen(true)} className="p-1">
              <Search size={18} />
            </button>
          </div>

          {/* Center Logo */}
          <a href="/" className="block">
            <span className="text-xl font-bold tracking-widest uppercase text-[#151515]">the purna</span>
          </a>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            <a href="/account" className="p-1">
              <User size={18} />
            </a>
          </div>
        </div>

        {/* -------------------- 💻 Desktop Navbar -------------------- */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3">
          {/* Logo */}
          <a href="/" className="logo-wrapper relative block h-12 flex items-center">
            <span className="text-2xl font-bold tracking-widest uppercase text-[#151515]">the purna</span>
          </a>

          {/* Nav links */}
          <nav className="flex space-x-6 xl:space-x-8 text-xs">
            {["SHOP", "ABOUT", "ROUTINE", "BLOGS", "FAQ", "CONTACT"].map((item) => (
              <a
                key={item}
                href={item === "SHOP" ? "/products" : `/${item.toLowerCase()}`}
                className="relative group text-black hover:text-gray-700 transition-colors font-medium tracking-wide"
              >
                {item}
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1.5px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-3">
            <button
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} className="text-black/60" />
            </button>
            <a href="/account" className="p-2 rounded-full hover:bg-black/5 transition-colors">
              <User size={18} className="text-black/60" />
            </a>
          </div>
        </div>
      </header>

      {/* 📱 Mobile Drawer Menu */}
      {menuOpen && (
        <>
          {/* Backdrop for ≥599px */}
          <div
            className="hidden min-[599px]:block fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Menu Drawer */}
          <div
            className={`fixed top-0 left-0 h-full bg-[#FCF8F2] z-50 shadow-xl transition duration-500 ease-in-out
            ${menuOpen ? "translate-x-0" : "-translate-x-full"}
            w-full max-[598px]:w-full min-[599px]:w-[350px]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-sm">HELLO!</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col px-6 py-6 space-y-6 overflow-y-auto">
              {/* SHOP expandable */}
              <div>
                <button
                  onClick={() => setShopOpen(!shopOpen)}
                  className="w-full flex justify-between items-center text-sm font-semibold uppercase border-b pb-2"
                >
                  <span>SHOP</span>
                  <span className="text-lg">{shopOpen ? "—" : "+"}</span>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${shopOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="py-4">
                    <Swiper spaceBetween={20} slidesPerView={3}>
                      {categories.map((cat) => (
                        <SwiperSlide key={cat.id}>
                          <div className="flex flex-col items-center">
                            <a href={`/collections/${cat.id}/immersive`} className="flex flex-col items-center group">
                              <img
                                src={cat.img}
                                alt={cat.title}
                                className="w-24 h-24 object-cover rounded-full group-hover:scale-105 transition-transform"
                              />
                              <p className="mt-2 text-sm text-center group-hover:text-[var(--color-orange)] transition-colors">{cat.title}</p>
                            </a>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>

              {/* Other links */}
              {["ABOUT", "ROUTINE", "BLOG", "SCIENCE", "FAQ", "CONTACT"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm font-semibold uppercase border-b pb-2"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full bg-black text-white p-6">
              <a href="/account" className="block mb-4 text-sm hover:underline">
                Log in
              </a>
              <div className="flex items-center space-x-6 text-sm">
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🔎 Search Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#fbfaf6] transition-transform duration-500 ease-in-out
        ${searchOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center w-full h-16 sm:h-20 md:h-24 px-4 border-b relative">
          {/* Close button - positioned properly for all screens */}
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>

          {/* Search input container - centered with proper margins */}
          <div className="flex items-center w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto pr-12 sm:pr-0">
            <div className="flex items-center w-full bg-white border rounded-full px-4 py-2.5 shadow-sm">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products, articles..."
                autoFocus
                className="flex-1 px-3 text-sm bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Optional: Search suggestions area */}
        {/* <div className="p-6 text-center text-gray-400 text-sm">
          Start typing to search...
        </div> */}
      </div>
    </>
  );
}
