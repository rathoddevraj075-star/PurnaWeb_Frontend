import React, { useEffect,useState, useRef } from "react";

const teamMembers = [
  {
    name: "AMANDA TURNER",
    role: "CEO & Founder",
    image: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/team-1.jpg?v=1737399226&width=2000",
  },
  {
    name: "MICHAEL ROBINSON",
    role: "Head of Research and Development",
    image: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/team-3.jpg?v=1737399226&width=2000",
  },
  {
    name: "JESSICA NGUYEN",
    role: "Marketing Director",
    image: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/team-2.jpg?v=1737399226&width=2000",
  },
  {
    name: "ETHAN CARTER",
    role: "Chief Operations Officer",
    image: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/team-4.jpg?v=1737399226&width=2000",
  },
];

const OurTeam = ({
  text = "MEET OUR PERFECT TEAM",
  repeat = 10,
  spacing = 100,
  speed = 50,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wrappers = container.querySelectorAll(".scrolling-wrapper");
    wrappers.forEach((wrapper, index) => {
      wrapper.style.animationDuration = `${speed}s`;
      wrapper.style.animationDelay = `${-index * speed}s`;
    });
  }, [speed]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );
  };

  return (
    <>
      <section className="w-full overflow-hidden bg-[#fcf8f2] border-t border-black">
        <div className="relative flex items-center justify-center h-[100px] md:h-[80px]">
          <h2 className="w-full text-2xl md:text-xl whitespace-nowrap overflow-hidden relative">
            <div
              className="scrolling-container flex"
              ref={containerRef}
              style={{ width: `${repeat * spacing * 2}px` }}
            >
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="scrolling-wrapper flex animate-scroll-left"
                >
                  {[...Array(repeat)].map((_, j) => (
                    <div
                      key={j}
                      className="scrolling-text mr-[100px]"
                      style={{ marginRight: `${spacing}px` }}
                    >
                      {text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </h2>
        </div>
      </section>

      <section className="py-20 bg-[#fcf8f2] border-b border-black">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & tablet grid */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-[300px] xl:h-[270px] object-cover"
              />
              {/* Hover text ONLY on desktop */}
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile & tablet slider */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="min-w-full flex-shrink-0 relative rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover"
                  />
                  {/* Always visible text on mobile/tablet */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                    <h3 className="font-semibold text-lg sm:text-xl">{member.name}</h3>
                    <p className="text-sm sm:text-base">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            ›
          </button>
        </div>
      </div>
    </section>


    </>
  );
};

export default OurTeam;
