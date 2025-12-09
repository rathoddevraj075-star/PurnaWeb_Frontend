import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <section className="bg-[#FCF8F2] py-12">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-lg md:text-xl font-bold tracking-wide mb-2 uppercase">
          Get in Touch with Us
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-10">
          Have questions or need assistance? Fill out the form below, and we’ll
          get back to you as soon as possible!
        </p>

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
                className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none"
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
                className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none"
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
              className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none"
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

          {/* Comment */}
          <div className="relative">
            <textarea
              name="comment"
              id="comment"
              rows="6"
              value={formData.comment}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full bg-white border border-black rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-0 focus:outline-none"
            ></textarea>
            <label
              htmlFor="comment"
              className={`absolute left-3 bg-white px-1 text-gray-500 text-base transition-all duration-200
                ${formData.comment
                  ? "-top-2 text-sm text-black"
                  : "top-6 text-base text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black"}
              `}
            >
              Comment
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full md:w-auto bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            SEND A FORM
          </button>
        </form>
      </div>
    </section>
  );
}

// import { useState } from "react";

// export default function FormSection() {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     comment: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Submitted:", formData);
//     // 🔗 Replace with API call or Shopify endpoint
//   };

//   return (
//     <>
//       <section className="relative py-12 md:py-20 bg-gray-100">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           {/* Title */}
//           <h2 className="text-3xl md:text-5xl font-bold mb-4">
//             Get in Touch with Us
//           </h2>

//           {/* Subtitle */}
//           <p className="text-lg md:text-xl text-gray-600">
//             Have questions or need assistance? Fill out the form below, and
//             we’ll get back to you as soon as possible!
//           </p>
//         </div>
//       </section>

//       <section className="py-16 bg-white">
//       <div className="max-w-3xl mx-auto px-6">
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6 bg-white p-8 shadow-lg rounded-lg"
//         >
//           {/* Name & Phone */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="relative">
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-1 focus:ring-black"
//               />
//               <label
//                 htmlFor="name"
//                 className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//               >
//                 Name
//               </label>
//             </div>

//             <div className="relative">
//               <input
//                 type="text"
//                 name="phone"
//                 id="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-1 focus:ring-black"
//               />
//               <label
//                 htmlFor="phone"
//                 className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//               >
//                 Phone number
//               </label>
//             </div>
//           </div>

//           {/* Email */}
//           <div className="relative">
//             <input
//               type="email"
//               name="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder=" "
//               required
//               className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-1 focus:ring-black"
//             />
//             <label
//               htmlFor="email"
//               className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//             >
//               Email*
//             </label>
//           </div>

//           {/* Comment */}
//           <div className="relative">
//             <textarea
//               name="comment"
//               id="comment"
//               rows="6"
//               value={formData.comment}
//               onChange={handleChange}
//               placeholder=" "
//               className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:border-black focus:ring-1 focus:ring-black"
//             ></textarea>
//             <label
//               htmlFor="comment"
//               className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
//             >
//               Comment
//             </label>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
//           >
//             Send a form
//           </button>
//         </form>
//       </div>
//     </section>
//     </>
//   );
// }
