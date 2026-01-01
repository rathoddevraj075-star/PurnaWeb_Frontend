import { motion as M } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function ScrollingBanner() {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.scrollWidth);
    }
  }, []);

  const scrollSpeed = 180;
  const duration = textWidth > 0 ? textWidth / scrollSpeed : 20;

  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] overflow-hidden border-b border-black">
      {/* Background Image */}
      <img
        src="/public/images/Web-image-2.png"
        alt="Running Woman"
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 sm:px-6">
        {/* Scrolling Text */}
        <div className="overflow-hidden whitespace-nowrap w-full">
          <M.div
            className="flex text-blue-400 font-extrabold uppercase text-[9vw] sm:text-[7vw] md:text-[6vw] tracking-wide"
            animate={{ x: [0, -textWidth] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: duration,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          >
            <div ref={textRef}>
              Complete Care for the Complete You • Complete Care for the Complete You • Complete Care for the Complete You •
            </div>
            <div>
              Complete Care for the Complete You • Complete Care for the Complete You • Complete Care for the Complete You •
            </div>
          </M.div>
        </div>

        {/* CTA Button */}
        <a
          href="/products/mens-multi"
          className="mt-6 sm:mt-10 px-5 py-3 text-xs sm:text-sm border tracking-[3px] border-black bg-white text-black font-semibold rounded-xl hover:bg-black hover:text-white transition"
        >
          BOOST ENERGY
        </a>
      </div>
    </section>
  );
}

// import { motion } from "framer-motion";

// export default function ScrollingBanner() {
//   return (
//     <div>
//       <section className="relative w-full h-[100vh] overflow-hidden border-b border-black">
//         {/* Background Image */}
//         <img
//           src="https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-banner-run-women.jpg?v=1736266855&width=2000"
//           alt="Running Woman"
//           className="w-full h-full object-cover"
//         />

//         {/* Overlay Content */}
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           {/* Scrolling Text */}
//           <div className="overflow-hidden whitespace-nowrap w-full">
//             <motion.div
//               className="text-white font-extrabold uppercase text-[7vw] tracking-wide inline-block"
//               animate={{ x: ["0%", "-100%"] }}
//               transition={{
//                 repeat: Infinity,
//                 duration: 25,
//                 ease: "linear",
//               }}
//             >
//               Your Wellness, Our Priority! • Your Wellness, Our Priority! • Your
//               Wellness, Our Priority! •
//             </motion.div>
//           </div>

//           {/* CTA Button */}
//           <a
//             href="/products/mens-multi"
//             className="px-6 text-[13px] py-5 border tracking-[3px] border-black bg-white text-black font-semibold rounded-xl hover:bg-black hover:text-white transition"
//           >
//             BOOST ENERGY
//           </a>
//         </div>
//       </section>
//     </div>
//   );
// }
