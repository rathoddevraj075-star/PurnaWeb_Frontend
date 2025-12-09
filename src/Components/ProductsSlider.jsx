import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

const products = [
  {
    id: "complete-morning-ritual",
    title: "Complete Morning Ritual",
    price: "$48.00",
    image:
      "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&h=800&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop",
    link: "/products/complete-morning-ritual",
  },
  {
    id: "daily-wellness-bundle",
    title: "Daily Wellness Bundle",
    price: "$85.00",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=800&fit=crop",
    link: "/products/daily-wellness-bundle",
  },
  {
    id: "evening-restore-complex",
    title: "Evening Restore Complex",
    price: "$52.00",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb37f7622dd?w=800&h=800&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1556909114-44a1a5b86939?w=800&h=800&fit=crop",
    link: "/products/evening-restore-complex",
  },
  {
    id: "ayurvedic-essentials",
    title: "Ayurvedic Essentials",
    price: "$65.00",
    image:
      "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&h=800&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop",
    link: "/products/ayurvedic-essentials",
  },
];

export default function ProductSlider() {
  return (
    <section id="featured-products" className="bg-[#FCF8F2] border-b py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">Featured Products</h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated selection of complete wellness essentials.
          </p>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="group relative flex flex-col rounded-2xl overflow-hidden">
                {/* Product Image */}
                <div className="relative">
                  <Link
                    to={product.link}
                    className="block aspect-square overflow-hidden relative"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                    />
                    <img
                      src={product.hoverImage}
                      alt={product.title}
                      className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                    />
                  </Link>

                  <button
                    className="absolute w-4/5 left-1/2 bottom-4 -translate-x-1/2 
                      opacity-0 group-hover:opacity-100 
                      transform translate-y-4 group-hover:translate-y-0 
                      transition-all duration-500 ease-out 
                      bg-neutral-900 text-white 
                      text-xs font-semibold tracking-wide uppercase 
                      py-2 rounded-lg shadow hover:bg-neutral-800"
                  >
                    Learn More
                  </button>
                </div>

                <div className="p-1 text-center">
                  <h3 className="text-xs font-medium text-gray-900">
                    {product.title}
                  </h3>
                  <p className="text-black text-xs font-medium ">{product.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* ✅ Learn More CTA */}
        <div className="text-center mt-16">
          <a
            href="/products"
            className="inline-block bg-neutral-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
