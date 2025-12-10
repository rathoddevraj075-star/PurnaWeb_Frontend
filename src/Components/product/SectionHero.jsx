// src/components/product/SectionHero.jsx
function SectionHero({ themeColor }) {
  return (
    <section
      className="text-white py-6"
      style={{ backgroundColor: themeColor }} // ✅ dynamic background
    >
      <div className="relative flex items-center justify-center text-center px-4">
        {/* Background video/image container (optional) */}
        <div className="absolute inset-0">
          {/* You can add <video> or <img> here if needed */}
        </div>

        {/* Overlay */}
        <div className="relative z-10 max-w-2xl">
          {/* Small Text */}
          <p className="text-base mb-2">What Our Customers Say</p>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl">
            +10000 Happy Customers
          </h2>
        </div>
      </div>
    </section>
  );
}

export default SectionHero;
