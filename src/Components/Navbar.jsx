"use client";
import { useState, useEffect } from "react";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Example products (replace with your Shopify data)
  // Example products (replace with your Shopify data)
  const products = [
    {
      id: "herbal-toothpaste",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop",
      title: "Herbal Toothpaste",
    },
    {
      id: "copper-tongue-cleaner",
      img: "https://images.unsplash.com/photo-1606208678220-44933923c5e2?q=80&w=1887&auto=format&fit=crop",
      title: "Tongue Cleaner",
    },
    {
      id: "neem-basil-soap",
      img: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=1887&auto=format&fit=crop",
      title: "Neem Soap",
    },
    {
      id: "kumkumadi-face-oil",
      img: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=1887&auto=format&fit=crop",
      title: "Face Oil",
    },
  ];

  return (
    <>
      {/* Navbar */}
      <header
        className={`w-full z-50 transition-all duration-500 border-b border-white/10
        bg-white/60 backdrop-blur-md shadow-sm 
        ${scrolled ? "fixed top-0 left-0" : "relative"}`}
      >
        {/* -------------------- 📱 Minimal Navbar -------------------- */}
        <div className="flex items-center justify-between px-6 py-2 max-[1196px]:flex min-[1197px]:hidden">
          {/* Left Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <button onClick={() => setSearchOpen(true)}>
              <Search size={22} />
            </button>
          </div>

          {/* Center Logo */}
          {/* Center Logo */}
          <a href="/" className="block">
            <img src="/images/logo-black.png" alt="The Purna" className="h-14 w-auto object-contain" />
          </a>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <a href="/account">
              <User size={22} />
            </a>
            <button onClick={() => setCartOpen(true)}>
              <ShoppingBag size={22} />
            </button>
          </div>
        </div>

        {/* -------------------- 💻 Full Navbar -------------------- */}
        <div className="hidden min-[1197px]:flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" className="logo-wrapper block">
            <img src="/images/logo-black.png" alt="THE PURNA" className="h-[4.5rem] w-auto object-contain" />
          </a>

          {/* Nav links */}
          <nav className="flex space-x-8 text-md font-bold">
            {["SHOP", "ABOUT", "ROUTINE", "JOURNAL", "SCIENCE", "FAQ", "CONTACT"].map((item) => (
              <a
                key={item}
                href={item === "SHOP" ? "/products" : `/${item.toLowerCase()}`}
                className="relative group text-black hover:text-gray-700 transition-colors"
              >
                {item}
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1.5px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            {/* <button className="flex items-center gap-1 text-sm font-medium hover:opacity-80">
              <img
                src="https://cdn.shopify.com/static/images/flags/us.svg"
                alt="USA"
                className="w-5 h-4"
              />
              USD ▼
            </button> */}
            {/* <button className="flex items-center gap-1 text-sm font-medium hover:opacity-80">
              EN ▼
            </button> */}
            <button
              className="p-1 rounded-full hover:bg-black/10"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={25} className="text-black/50" />
            </button>
            <a href="/account" className="p-1 rounded-full hover:bg-black/10">
              <User size={25} className="text-black/50" />
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1 rounded-full hover:bg-black/10"
            >
              <ShoppingBag size={25} className="text-black/50" />
            </button>
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
              <h2 className="text-lg font-bold">HELLO!</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col px-6 py-6 space-y-6 overflow-y-auto">
              {/* SHOP expandable */}
              <div>
                <button
                  onClick={() => setShopOpen(!shopOpen)}
                  className="w-full flex justify-between items-center text-lg font-semibold uppercase border-b pb-2"
                >
                  <span>SHOP</span>
                  <span className="text-xl">{shopOpen ? "—" : "+"}</span>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${shopOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="py-4">
                    <Swiper spaceBetween={20} slidesPerView={3}>
                      {products.map((p) => (
                        <SwiperSlide key={p.id}>
                          <div className="flex flex-col items-center">
                            <a href={`/products/${p.id}`} className="flex flex-col items-center group">
                              <img
                                src={p.img}
                                alt={p.title}
                                className="w-24 h-24 object-cover rounded-full group-hover:scale-105 transition-transform"
                              />
                              <p className="mt-2 text-sm text-center group-hover:text-[var(--color-orange)] transition-colors">{p.title}</p>
                            </a>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>

              {/* Other links */}
              {["ABOUT", "ROUTINE", "JOURNAL", "SCIENCE", "FAQ", "CONTACT"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-lg font-semibold uppercase border-b pb-2"
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
                {/* <button className="flex items-center gap-1">
                  <img
                    src="https://cdn.shopify.com/static/images/flags/us.svg"
                    alt="USA"
                    className="w-5 h-4"
                  />
                  USD ▼
                </button>
                <button>EN ▼</button> */}
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
        <div className="flex items-center justify-center w-full h-24 px-4 border-b relative">
          <div className="flex items-center w-full max-w-xl md:max-w-2xl bg-white border rounded-md px-3 py-2 shadow-sm">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="flex-1 px-3 text-sm bg-transparent focus:outline-none"
            />
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute right-6 top-6"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* 🛒 Cart Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-500 ${cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300
          ${cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setCartOpen(false)}
        ></div>

        {/* Cart Drawer */}
        <div
          className={`fixed top-0 right-0 h-full bg-white p-6 flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${cartOpen ? "translate-x-0" : "translate-x-full"}
          w-full max-[496px]:w-full min-[497px]:w-[400px]`}
        >
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-bold">YOUR CART</h2>
            <button onClick={() => setCartOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <ShoppingBag size={48} />
            <p className="text-sm font-medium">YOUR CART IS EMPTY</p>
            <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
              CONTINUE SHOPPING
            </button>
            <p className="text-xs text-center mt-6">
              HAVE AN ACCOUNT?{" "}
              <a href="/account" className="underline font-medium">
                Log in
              </a>{" "}
              to check out faster.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
