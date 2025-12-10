import React from "react";

export default function SectionNewsletter({ themeColor = "#55acea" }) {
  return (
    <section
      className="w-full py-16 px-4 border-b border-black"
      style={{ backgroundColor: themeColor }}
    >
      <div className="max-w-3xl mx-auto text-center text-white">
        {/* Heading */}
        <h2 className="text-2xl md:text-2xl uppercase tracking-wide mb-4">
          Join Our Circle &amp; Save!
        </h2>

        {/* Subtext */}
        <p className="text-sm md:text-sm mb-3 opacity-90">
          Sign up now for 10% off your first order – because you deserve it!
        </p>

        {/* Newsletter Form */}
        <form
          method="post"
          action="/contact#contact_form"
          className="flex flex-col sm:flex-row items-center justify-center max-w-sm mx-auto"
        >
          <input
            type="email"
            name="contact[email]"
            placeholder="Email"
            required
            className="flex-1 w-full px-4 py-2 rounded-l-md bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white font-semibold px-6 py-3 rounded-r-md hover:bg-gray-800 transition w-full sm:w-auto mt-3 sm:mt-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
