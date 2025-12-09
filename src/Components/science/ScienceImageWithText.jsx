import React from "react";

const ScienceImageWithText = () => {
  return (
    <>
    <section className="w-full bg-white">
      <div className="relative grid lg:grid-cols-2 items-center">
        {/* Image */}
        <div className="w-full h-full">
          <picture>
            {/* Mobile Image */}
            <source
              media="(max-width:768px)"
              srcSet="https://wonder-theme-wellness.myshopify.com/cdn/shop/files/blog-post-1c.jpg?v=1737287596&width=750"
            />
            {/* Desktop Image */}
            <img
              src="https://wonder-theme-wellness.myshopify.com/cdn/shop/files/blog-post-1c.jpg?v=1737287596&width=2000"
              alt="Supplements for a Thriving You"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </picture>
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center px-6 md:px-[8rem] md:mt-[1rem] py-12 lg:py-20">
          <h2 className="text-2xl md:text-xl font-extrabold mb-4">
            SUPPLEMENTS FOR A THRIVING YOU
          </h2>
          <p className="text-base md:text-md text-gray-800">
            At Wellness, we believe that true vitality starts from within.
            That’s why we create high-quality, natural supplements designed to
            support your well-being, enhance your energy, and help you thrive
            every day.
            <br />
            Our mission is to empower you to feel your best by providing
            products that are rooted in science and inspired by nature. We
            carefully select premium, responsibly sourced ingredients to ensure
            every formula delivers maximum benefits without compromise.
          </p>
        </div>
      </div>
    </section>

    <section className="w-full bg-white border-b border-black">
      <div className="relative grid lg:grid-cols-2 items-center">
        {/* Text Content (left on desktop) */}
        <div className="order-2 lg:order-1 flex flex-col justify-center px-6 md:px-[8rem] py-12 lg:py-20">
          <h2 className="text-2xl md:text-xl font-extrabold mb-4">
            INNOVATING WELLNESS, EMPOWERING LIVES
          </h2>
          <p className="text-base md:text-md text-gray-800">
            At Wellness Inc., we combine cutting-edge innovation with the power
            of nature to create products that truly make a difference. Trusted by
            countless satisfied customers, our commitment to quality and
            well-being has made us a leader in redefining health. Join the
            growing community that thrives with Wellness Inc. and experience the
            future of vitality today.
          </p>
        </div>

        {/* Image (right on desktop) */}
        <div className="order-1 lg:order-2 w-full h-full">
          <picture>
            {/* Mobile */}
            <source
              media="(max-width:768px)"
              srcSet="https://wonder-theme-wellness.myshopify.com/cdn/shop/files/capsule-wellness-main.jpg?v=1737474567&width=750"
            />
            {/* Desktop */}
            <img
              src="https://wonder-theme-wellness.myshopify.com/cdn/shop/files/capsule-wellness-main.jpg?v=1737474567&width=2000"
              alt="Innovating Wellness, Empowering Lives"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </picture>
        </div>
      </div>
    </section>
    </>
  );
};

export default ScienceImageWithText;
