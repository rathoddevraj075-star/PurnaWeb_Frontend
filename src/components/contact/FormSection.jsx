import { useState } from "react";
import { contactService } from "../../services/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await contactService.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || "General Inquiry",
        message: formData.message,
      });

      setStatus({
        type: "success",
        message: response.message || "Your message has been sent successfully!"
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#FCF8F2] py-12">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-lg md:text-xl tracking-wide mb-2 uppercase">
          Get in Touch with Us
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-10">
          Have questions or need assistance? Fill out the form below, and we'll
          get back to you as soon as possible!
        </p>

        {/* Status Message */}
        {status.message && (
          <div
            className={`mb-6 p-4 rounded-md ${status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Name + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                disabled={loading}
                className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none disabled:opacity-50"
              />
              <label
                htmlFor="name"
                className={`absolute left-3 bg-white px-1 text-gray-500 text-base transition-all duration-200
                  ${formData.name
                    ? "-top-2 text-sm text-black"
                    : "top-1/2 -translate-y-1/2 text-base text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black"}
                `}
              >
                Name
              </label>
            </div>

            {/* Phone */}
            <div className="relative">
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
                disabled={loading}
                className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none disabled:opacity-50"
              />
              <label
                htmlFor="phone"
                className={`absolute left-3 bg-white px-1 text-gray-500 text-base transition-all duration-200
                  ${formData.phone
                    ? "-top-2 text-sm text-black"
                    : "top-1/2 -translate-y-1/2 text-base text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black"}
                `}
              >
                Phone number
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
              disabled={loading}
              className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none disabled:opacity-50"
            />
            <label
              htmlFor="email"
              className={`absolute left-3 bg-white px-1 text-gray-500 text-base transition-all duration-200
                ${formData.email
                  ? "-top-2 text-sm text-black"
                  : "top-1/2 -translate-y-1/2 text-base text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black"}
              `}
            >
              Email*
            </label>
          </div>

          {/* Subject */}
          <div className="relative">
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
              className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none disabled:opacity-50"
            />
            <label
              htmlFor="subject"
              className={`absolute left-3 bg-white px-1 text-gray-500 text-base transition-all duration-200
                ${formData.subject
                  ? "-top-2 text-sm text-black"
                  : "top-1/2 -translate-y-1/2 text-base text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black"}
              `}
            >
              Subject
            </label>
          </div>

          {/* Message */}
          <div className="relative">
            <textarea
              name="message"
              id="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              placeholder=" "
              required
              disabled={loading}
              className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none disabled:opacity-50"
            ></textarea>
            <label
              htmlFor="message"
              className={`absolute left-3 bg-white px-1 text-gray-500 text-base transition-all duration-200
                ${formData.message
                  ? "-top-2 text-sm text-black"
                  : "top-6 text-base text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black"}
              `}
            >
              Message*
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>
      </div>
    </section>
  );
}
