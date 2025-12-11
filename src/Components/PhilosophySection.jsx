export default function PhilosophySection() {
  return (
    <section className="relative z-10 bg-[#FCF8F2] text-neutral-900 border-t border-black/10 py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Our Philosophy
          </h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            At The Purna, we believe wellness is not a moment — it's a flow. A daily ritual that begins when you wake up and stays with you till night. Our products are crafted to complete every part of your routine with purity, intention, and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="text-center p-8 bg-[#FCF8F2] rounded-2xl">
            <div className="w-16 h-16 bg-neutral-900 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-white text-2xl ">1</span>
            </div>
            <h3 className="text-xl mb-4">Holistic Wellness</h3>
            <p className="text-neutral-600 leading-relaxed">
              We embrace a holistic approach, nurturing your mind, body, and spirit.
            </p>
          </div>

          <div className="text-center p-8 bg-[#FCF8F2] rounded-2xl">
            <div className="w-16 h-16 bg-neutral-900 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-white text-2xl">2</span>
            </div>
            <h3 className="text-xl mb-4">Ayurvedic Wisdom</h3>
            <p className="text-neutral-600 leading-relaxed">
              Our products are rooted in ancient Ayurvedic principles for balanced living.
            </p>
          </div>

          <div className="text-center p-8 bg-[#FCF8F2] rounded-2xl">
            <div className="w-16 h-16 bg-neutral-900 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-white text-2xl">3</span>
            </div>
            <h3 className="text-xl mb-4">Conscious Living</h3>
            <p className="text-neutral-600 leading-relaxed">
              We encourage mindful choices that contribute to a sustainable and healthy lifestyle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}