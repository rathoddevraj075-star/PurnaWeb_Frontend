import React from "react";

const Newsletter = () => {
  return (
    <div>
      <section
        className="relative w-full h-[460px] md:h-[480px] flex items-center justify-center bg-cover bg-center border-b border-black"
        style={{
          backgroundImage:
            "url('https://wonder-theme-wellness.myshopify.com/cdn/shop/files/newsletter-image.jpg?v=1737192251&width=3080')",
        }}
      >
        <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-3xl w-full text-center">
          <h2 className="text-3xl md:text-[45px] font-bold text-gray-900 mb-4">
            JOIN OUR CIRCLE & SAVE!
          </h2>

          <p className="text-gray-700 mb-6">
            Sign up now for 10% off your first order – because you deserve it!
          </p>

          <form className="flex items-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Email"
              required
              className="flex-1 px-4 py-3 rounded-l-xl border bg-white border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-3 rounded-r-xl text-sm font-bold uppercase hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Newsletter;
