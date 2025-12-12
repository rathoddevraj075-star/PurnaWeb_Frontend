import React, { useState } from "react";
import { newsletterService } from "../services/api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await newsletterService.subscribe(email, "footer");
      setStatus({ type: "success", message: response.message || "Thank you for subscribing!" });
      setEmail("");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-3xl md:text-[45px] text-gray-900 mb-4">
            JOIN OUR CIRCLE & SAVE!
          </h2>

          <p className="text-gray-700 mb-6">
            Sign up now for 10% off your first order – because you deserve it!
          </p>

          <form onSubmit={handleSubmit} className="flex items-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-l-xl border bg-white border-black focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-3 rounded-r-xl text-sm uppercase hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Subscribe"}
            </button>
          </form>

          {/* Status Message */}
          {status.message && (
            <p
              className={`mt-4 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"
                }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Newsletter;
