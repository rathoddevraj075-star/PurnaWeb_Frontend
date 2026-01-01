"use client";

export default function AboutSection() {
  return (
    <section
      id="about-section"
      className="bg-[#FCF8F2] text-neutral-900 border-t border-b border-black py-16 md:py-20 lg:py-24"
    >
      <div className="max-w-7xl px-6 mx-auto">
        {/* Philosophy Section */}
        {/* <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Care That Feels Complete
          </h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            At PurnaRoutine, we believe wellness is not a moment — it's a flow. A daily ritual that begins when you wake up and stays with you till night. Our products are crafted to complete every part of your routine with purity, intention, and care.
          </p>
        </div> */}

        {/* The Purna Routine Timeline */}
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl lg:text-4xl mb-4">
            Your Day, Made Whole
          </h3>
          <p className="text-base md:text-lg text-neutral-600 max-w-3xl mx-auto mb-12">
            From refreshing oral care to nurturing night-time rituals, experience wellness that completes your entire day.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="text-center p-6 bg-[#FCF8F2] rounded-2xl shadow-sm border border-neutral-100">
              <div className="text-2xl text-neutral-900 mb-3">6 AM</div>
              <h4 className="text-lg font-semibold mb-2">Oral Care Essentials</h4>
              <p className="text-sm text-neutral-600">Start fresh with safe, gentle, natural formulations.</p>
            </div>

            <div className="text-center p-6 bg-[#FCF8F2] rounded-2xl shadow-sm border border-neutral-100">
              <div className="text-2xl text-neutral-900 mb-3">10 AM</div>
              <h4 className="text-lg font-semibold mb-2">Body Care</h4>
              <p className="text-sm text-neutral-600">Stay energized with cleansing and nourishing essentials.</p>
            </div>

            <div className="text-center p-6 bg-[#FCF8F2] rounded-2xl shadow-sm border border-neutral-100">
              <div className="text-2xl text-neutral-900 mb-3">4 PM</div>
              <h4 className="text-lg font-semibold mb-2">Hand & Hygiene</h4>
              <p className="text-sm text-neutral-600">Midday freshness that keeps you active and confident.</p>
            </div>

            <div className="text-center p-6 bg-[#FCF8F2] rounded-2xl shadow-sm border border-neutral-100">
              <div className="text-2xl text-neutral-900 mb-3">8 PM</div>
              <h4 className="text-lg font-semibold mb-2">Hair & Skin Ritual</h4>
              <p className="text-sm text-neutral-600">Wash away the day with calm, herbal nourishment.</p>
            </div>

            <div className="text-center p-6 bg-[#FCF8F2] rounded-2xl shadow-sm border border-neutral-100">
              <div className="text-2xl text-neutral-900 mb-3">10 PM</div>
              <h4 className="text-lg font-semibold mb-2">Night Care</h4>
              <p className="text-sm text-neutral-600">End the day with products crafted for rest, repair, and renewal.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/about"
            className="inline-block px-6 py-3 rounded-md bg-neutral-900 text-white text-xs tracking-widest font-semibold uppercase hover:bg-neutral-800 transition"
          >
            About Us
          </a>
        </div>
      </div>
    </section>
  );
}
