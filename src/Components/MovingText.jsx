import React from "react";
import { motion as M } from "framer-motion";

const ScrollingTextBanner = () => {
  const text = "+10000 HAPPY CUSTOMERS";

  return (
    <section className="w-full overflow-hidden bg-[#FCF8F2] border-b border-gray-200">
      <div className="max-w-4xl mx-auto py-4 sm:py-3 md:py-6 flex items-center">

        <div className="relative flex whitespace-nowrap w-full">
          <M.div
            className="flex space-x-6 sm:space-x-10 md:space-x-16 text-xs sm:text-sm md:text-xl uppercase tracking-wide"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 60,
            }}
          >
            {Array(25)
              .fill(text)
              .map((item, i) => (
                <span key={i} className="text-gray-900">
                  {item}
                </span>
              ))}
          </M.div>
        </div>
      </div>
    </section>
  );
};

export default ScrollingTextBanner;
