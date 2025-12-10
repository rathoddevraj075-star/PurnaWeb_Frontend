import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    id: 1,
    image:
      "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/collagen-picture-1.jpg?v=1736803947&width=600",
    text: "Finally, a product that delivers on its promises. My skin glows, and I feel amazing inside and out!",
    author: "Martin B.",
  },
  {
    id: 2,
    image:
      "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/testimonial-lady.jpg?v=1737281359&width=600",
    text: "A game-changer for my daily routine. I wake up refreshed and ready to take on the day like never before!",
    author: "Hanna S.",
  },
];

const Testimonials = () => {
  return (
    <div>
      <section className="py-16 md:py-16 lg:py-20 bg-[#FCF8F2] border-b border-black">
        <div className="max-w-4xl mx-auto text-center px-8 relative">
          <h2 className="text-2xl md:text-5xl lg:text-5xl uppercase mb-8">What Our Customers Say !</h2>

          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            className="relative"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="flex flex-col items-center">
                  {/* Reviewer Image */}
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-24 h-24 rounded-full object-cover mb-2 shadow-md"
                  />

                  {/* Stars */}
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="w-6 h-6 text-yellow-400"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.97c.299.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.047 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xl italic mb-8 text-gray-700 max-w-xl">
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <h4 className="text-gray-900">{t.author}</h4>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute top-1/2 left-4 sm:left-8 md:left-12 lg:left-12 -translate-y-1/2 cursor-pointer z-20">
            <div className="bg-white shadow-md rounded-full p-3 hover:bg-neutral-100 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-neutral-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </div>
          </div>

          <div className="swiper-button-next-custom absolute top-1/2 right-4 sm:right-8 md:right-12 lg:right-12 -translate-y-1/2 cursor-pointer z-20">
            <div className="bg-white shadow-md rounded-full p-3 hover:bg-neutral-100 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-neutral-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </div>
        </div>

      </section>

    </div>

  );
};

export default Testimonials;
