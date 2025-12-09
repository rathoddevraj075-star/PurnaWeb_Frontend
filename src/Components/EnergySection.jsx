import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const products = [
  {
    id: "p1",
    title: "Boost Energy Capsules",
    price: "$36.00",
    link: "/products/boost-energy-capsules",
    promoText: "BOOST YOUR ENERGY LEVELS!",
    desktopImage:
      "/public/images/Web-image-3.png",
    mobileImage:
      "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-energy-banner.jpg?v=1737016809",
    productImage:
      "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-boost-energy_297f87b4-11c5-48db-bb18-dcc6219a0acf.png?v=1736272301",
    bg: "rgb(254,78,78)",
    text: "rgb(255,255,255)",
  },
  {
    id: "p2",
    title: "Stress Relief Capsules",
    price: "$36.00",
    link: "/products/stress-relief-capsules",
    promoText: "RELAX NATURALLY, LIVE FULLY!",
    desktopImage:
      "/public/images/Web-image-4.png",
    mobileImage:
      "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-relax-banner-3.jpg?v=1737027334",
    productImage:
      "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-stress-relief_c7007b42-655e-4dd8-97f1-09bc8702c9b8.png?v=1736272263",
    bg: "rgb(0,163,82)",
    text: "rgb(255,255,255)",
  },
  {
    id: "p3",
    title: "Women's Multi Capsules",
    price: "$36.00",
    link: "/products/womens-multi-capsules",
    promoText: "COMPLETE CARE FOR YOUR HEALTH!",
    desktopImage:
      "/public/images/Web-image-5.png",
    mobileImage:
      "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-women-banner-2.jpg?v=1737030705",
    productImage:
      "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-women.png?v=1736344026",
    bg: "rgb(255,193,203)",
    text: "rgb(21,21,21)",
  },
];

export default function EnergySection() {
  const promoRef = useRef(null);
  const productRef = useRef(null);

  const syncSliders = () => {
    if (promoRef.current && productRef.current) {
      promoRef.current.on("slideChange", () => {
        productRef.current.slideTo(promoRef.current.activeIndex);
      });
      productRef.current.on("slideChange", () => {
        promoRef.current.slideTo(productRef.current.activeIndex);
      });
    }
  };

  return (
    <section className="bg-white w-full border-b border-black ">
      <div className="flex flex-col lg:flex-row w-full h-auto lg:min-h-[700px] mx-auto">
        {/* Promo Slider */}
        <div className="w-full lg:w-1/2 min-h-[320px] sm:min-h-[380px] lg:min-h-[700px]">
        <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            onSwiper={(s) => {
              productRef.current = s;
              syncSliders();
            }}
            className="h-full"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                <div
                  className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-8 lg:p-2"
                  style={{ backgroundColor: p.bg, color: p.text }}
                >
                  <img
                    src={p.productImage}
                    alt={p.title}
                    className="sm:w-56 sm:h-56 lg:w-[420px] lg:h-[420px] lg:mb-2 object-contain"
                  />
                  <h3 className="text-base sm:text-lg font-medium">{p.title}</h3>
                  <p className="text-base sm:text-xl">{p.price}</p>
                  {/* <a
                    href={p.link}
                    className="mt-4 inline-block bg-white text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Add to Cart
                  </a> */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Slider */}
        <div className="w-full lg:w-1/2 min-h-[360px] sm:min-h-[420px] lg:min-h-[700px]">
        <Swiper
            effect="fade"
            modules={[EffectFade]}
            pagination={{ clickable: true }}
            onSwiper={(s) => {
              promoRef.current = s;
              syncSliders();
            }}
            className="h-full"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                <div
                  className="relative flex h-full items-center justify-center"
                  style={{ backgroundColor: p.bg, color: p.text }}
                >
                  <img
                    src={p.desktopImage}
                    alt={p.title}
                    className="hidden lg:block absolute inset-0 w-full h-full object-cover"
                  />
                  <img
                    src={p.mobileImage}
                    alt={p.title}
                    className="block lg:hidden absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" />
                  <div className="relative z-10 flex flex-col items-center lg:items-end justify-center p-6 lg:p-14 text-center">
                    <h2 className="text-2xl lg:text-7xl text-left font-bold text-white drop-shadow-lg">
                      {p.promoText}
                    </h2>
                    {/* <a
                      href={p.link}
                      className="mt-4 inline-block bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Shop Now
                    </a> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}


// import { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, EffectFade } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";

// const products = [
//   {
//     id: "p1",
//     title: "Boost Energy Capsules",
//     price: "$36.00",
//     link: "/products/boost-energy-capsules",
//     promoText: "Boost Your Energy Levels!",
//     desktopImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/A_Young_Sportsman_Runs_At_Sunset_original_1250975.jpg?v=1736967016",
//     mobileImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-energy-banner.jpg?v=1737016809",
//     productImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-boost-energy_297f87b4-11c5-48db-bb18-dcc6219a0acf.png?v=1736272301",
//     bg: "rgb(254,78,78)",
//     text: "rgb(255,255,255)",
//   },
//   {
//     id: "p2",
//     title: "Stress Relief Capsules",
//     price: "$36.00",
//     link: "/products/stress-relief-capsules",
//     promoText: "Relax Naturally, Live Fully!",
//     desktopImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/relax-image-banner.jpg?v=1737017322",
//     mobileImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-relax-banner-3.jpg?v=1737027334",
//     productImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-stress-relief_c7007b42-655e-4dd8-97f1-09bc8702c9b8.png?v=1736272263",
//     bg: "rgb(0,163,82)",
//     text: "rgb(255,255,255)",
//   },
//   {
//     id: "p3",
//     title: "Women's Multi Capsules",
//     price: "$36.00",
//     link: "/products/womens-multi-capsules",
//     promoText: "Complete care for your health!",
//     desktopImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/women-image-banner-3.jpg?v=1737030329",
//     mobileImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-women-banner-2.jpg?v=1737030705",
//     productImage:
//       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-women.png?v=1736344026",
//     bg: "rgb(255,193,203)",
//     text: "rgb(21,21,21)",
//   },
// ];

// export default function EnergySection() {
//   const promoRef = useRef(null);
//   const productRef = useRef(null);

//   const syncSliders = () => {
//     if (promoRef.current && productRef.current) {
//       promoRef.current.on("slideChange", () => {
//         productRef.current.slideTo(promoRef.current.activeIndex);
//       });
//       productRef.current.on("slideChange", () => {
//         promoRef.current.slideTo(productRef.current.activeIndex);
//       });
//     }
//   };

//   return (
//     <section className="bg-white ">
//       <div className="flex flex-col lg:flex-row h-auto lg:h-[600px] container mx-auto">
//         {/* Promo Slider - Hidden on smaller screens */}
//         <div className="hidden lg:block lg:w-1/2 h-[300px] lg:h-full">
//           <Swiper
//             effect="fade"
//             modules={[EffectFade, Pagination]}
//             pagination={{ clickable: true }}
//             onSwiper={(s) => {
//               promoRef.current = s;
//               syncSliders();
//             }}
//             className="h-full"
//           >
//             {products.map((p) => (
//               <SwiperSlide key={p.id}>
//                 <div
//                   className="relative flex h-full items-center justify-center"
//                   style={{ backgroundColor: p.bg, color: p.text }}
//                 >
//                   {/* Background image */}
//                   <img
//                     src={p.desktopImage}
//                     alt={p.title}
//                     className="absolute inset-0 w-full h-full object-cover"
//                     loading="lazy"
//                   />
//                   <div className="absolute inset-0 bg-black/40" />
//                   <div className="relative z-10 flex flex-col items-center lg:items-start justify-center p-6 lg:p-12 text-center lg:text-left">
//                     <h2 className="text-2xl lg:text-5xl font-bold text-white drop-shadow-lg">
//                       {p.promoText}
//                     </h2>
//                     <a
//                       href={p.link}
//                       className="mt-4 inline-block bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
//                     >
//                       Shop Now
//                     </a>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//         {/* Product Slider - Full width on smaller screens */}
//         <div className="w-full lg:w-1/2 h-[400px] sm:h-[450px] lg:h-full">
//           <Swiper
//             modules={[Pagination]}
//             pagination={{ clickable: true }}
//             onSwiper={(s) => {
//               productRef.current = s;
//               syncSliders();
//             }}
//             className="h-full"
//           >
//             {products.map((p) => (
//               <SwiperSlide key={p.id}>
//                 <div
//                   className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-8"
//                   style={{ backgroundColor: p.bg, color: p.text }}
//                 >
//                   <img
//                     src={p.productImage}
//                     alt={p.title}
//                     className="w-48 sm:w-60 h-48 sm:h-60 object-contain mb-6"
//                     loading="lazy"
//                   />
//                   <h3 className="text-lg sm:text-xl font-semibold">{p.title}</h3>
//                   <p className="text-base sm:text-lg">{p.price}</p>
//                   <a
//                     href={p.link}
//                     className="mt-4 inline-block bg-white text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
//                   >
//                     Add to Cart
//                   </a>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// }

// // import { useRef } from "react";
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Pagination, EffectFade } from "swiper/modules";
// // import "swiper/css";
// // import "swiper/css/pagination";
// // import "swiper/css/effect-fade";

// // const products = [
// //   {
// //     id: "p1",
// //     title: "Boost Energy Capsules",
// //     price: "$36.00",
// //     link: "/products/boost-energy-capsules",
// //     promoText: "Boost Your Energy Levels!",
// //     desktopImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/A_Young_Sportsman_Runs_At_Sunset_original_1250975.jpg?v=1736967016",
// //     mobileImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-energy-banner.jpg?v=1737016809",
// //     productImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-boost-energy_297f87b4-11c5-48db-bb18-dcc6219a0acf.png?v=1736272301",
// //     bg: "rgb(254,78,78)",
// //     text: "rgb(255,255,255)",
// //   },
// //   {
// //     id: "p2",
// //     title: "Stress Relief Capsules",
// //     price: "$36.00",
// //     link: "/products/stress-relief-capsules",
// //     promoText: "Relax Naturally, Live Fully!",
// //     desktopImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/relax-image-banner.jpg?v=1737017322",
// //     mobileImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-relax-banner-3.jpg?v=1737027334",
// //     productImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-stress-relief_c7007b42-655e-4dd8-97f1-09bc8702c9b8.png?v=1736272263",
// //     bg: "rgb(0,163,82)",
// //     text: "rgb(255,255,255)",
// //   },
// //   {
// //     id: "p3",
// //     title: "Women's Multi Capsules",
// //     price: "$36.00",
// //     link: "/products/womens-multi-capsules",
// //     promoText: "Complete care for your health!",
// //     desktopImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/women-image-banner-3.jpg?v=1737030329",
// //     mobileImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/mobile-women-banner-2.jpg?v=1737030705",
// //     productImage:
// //       "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-women.png?v=1736344026",
// //     bg: "rgb(255,193,203)",
// //     text: "rgb(21,21,21)",
// //   },
// // ];

// // export default function EnergySection() {
// //   const promoRef = useRef(null);
// //   const productRef = useRef(null);

// //   const syncSliders = () => {
// //     if (promoRef.current && productRef.current) {
// //       promoRef.current.on("slideChange", () => {
// //         productRef.current.slideTo(promoRef.current.activeIndex);
// //       });
// //       productRef.current.on("slideChange", () => {
// //         promoRef.current.slideTo(productRef.current.activeIndex);
// //       });
// //     }
// //   };

// //   return (
// //     <section className="bg-white">
// //       <div className="flex flex-col md:flex-row h-[500px] md:h-[600px]">
// //         {/* Promo Slider */}
// //         <div className="relative w-full md:w-1/2 h-full">
// //           <Swiper
// //             effect="fade"
// //             modules={[EffectFade, Pagination]}
// //             pagination={{ clickable: true }}
// //             onSwiper={(s) => {
// //               promoRef.current = s;
// //               syncSliders();
// //             }}
// //             className="h-full"
// //           >
// //             {products.map((p) => (
// //               <SwiperSlide key={p.id}>
// //                 <div
// //                   className="relative flex h-full items-center justify-center"
// //                   style={{ backgroundColor: p.bg, color: p.text }}
// //                 >
// //                   {/* Background image */}
// //                   <img
// //                     src={p.desktopImage}
// //                     alt={p.title}
// //                     className="hidden md:block absolute inset-0 w-full h-full object-cover"
// //                   />
// //                   <img
// //                     src={p.mobileImage}
// //                     alt={p.title}
// //                     className="block md:hidden absolute inset-0 w-full h-full object-cover"
// //                   />
// //                   <div className="absolute inset-0 bg-black/30" />
// //                   <div className="relative z-10 flex items-end md:items-center justify-center md:justify-start p-6 md:p-12">
// //                     <h2 className="text-2xl md:text-5xl font-bold text-white drop-shadow">
// //                       {p.promoText}
// //                     </h2>
// //                   </div>
// //                 </div>
// //               </SwiperSlide>
// //             ))}
// //           </Swiper>
// //         </div>

// //         {/* Product Slider */}
// //         <div className="w-full md:w-1/2 h-full">
// //           <Swiper
// //             modules={[Pagination]}
// //             pagination={{ clickable: true }}
// //             onSwiper={(s) => {
// //               productRef.current = s;
// //               syncSliders();
// //             }}
// //             className="h-full"
// //           >
// //             {products.map((p) => (
// //               <SwiperSlide key={p.id}>
// //                 <div
// //                   className="flex flex-col items-center justify-center h-full text-center p-8"
// //                   style={{ backgroundColor: p.bg, color: p.text }}
// //                 >
// //                   <img
// //                     src={p.productImage}
// //                     alt={p.title}
// //                     className="w-60 h-60 object-contain mb-6"
// //                   />
// //                   <h3 className="text-lg font-semibold">{p.title}</h3>
// //                   <p>{p.price}</p>
// //                 </div>
// //               </SwiperSlide>
// //             ))}
// //           </Swiper>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }
