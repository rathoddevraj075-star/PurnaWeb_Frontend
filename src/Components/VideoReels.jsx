"use client";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

const reels = [
  {
    id: 1,
    src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/f80275ae9c3b45b99879498c22b099ca/f80275ae9c3b45b99879498c22b099ca.HD-1080p-7.2Mbps-41137264.mp4?v=0",
    poster:
      "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/f80275ae9c3b45b99879498c22b099ca.thumbnail.0000000000_600x.jpg?v=1737112615",
    product: {
      name: "Women's Multi Capsules",
      price: "$36.00",
      img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-women.png?v=1736344026&width=600",
    },
  },
  {
    id: 2,
    src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/8cb6df095e464dbd8e219a53a0f6afac/8cb6df095e464dbd8e219a53a0f6afac.HD-1080p-2.5Mbps-41162163.mp4?v=0",
    poster:
      "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/8cb6df095e464dbd8e219a53a0f6afac.thumbnail.0000000000_600x.jpg?v=1737147500",
    product: {
      name: "Immunity Boost Capsules",
      price: "$42.00",
      img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-immunity.png?v=1736272401&width=300",
    },
  },
  {
    id: 3,
    src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/5702c2e5a1764787b0423a5809fdcd9c/5702c2e5a1764787b0423a5809fdcd9c.HD-1080p-7.2Mbps-41137234.mp4?v=0",
    poster:
      "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/5702c2e5a1764787b0423a5809fdcd9c.thumbnail.0000000000_600x.jpg?v=1737112565",
    product: {
      name: "Natural Collagen",
      price: "$55.00",
      img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-collagen.png?v=1736343720&width=600",
    },
  },
  {
    id: 4,
    src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/62c7a55bd2464953a7883389affce416/62c7a55bd2464953a7883389affce416.HD-1080p-7.2Mbps-41162082.mp4?v=0",
    poster:
      "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/62c7a55bd2464953a7883389affce416.thumbnail.0000000000_600x.jpg?v=1737147344",
    product: {
      name: "Boost Energy Capsules",
      price: "$48.00",
      img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-stress-relief_c7007b42-655e-4dd8-97f1-09bc8702c9b8.png?v=1736272263&width=600",
    },
  },
  {
    id: 5,
    src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/ae1780bea1d3427f9919b8c8bd9dffef/ae1780bea1d3427f9919b8c8bd9dffef.HD-1080p-3.3Mbps-41162255.mp4?v=0",
    poster:
      "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/ae1780bea1d3427f9919b8c8bd9dffef.thumbnail.0000000000_600x.jpg?v=1737147646",
    product: {
      name: "Boost Energy Capsules",
      price: "$48.00",
      img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-hair-skin-nails_dedd4bc7-4e2c-484d-9ac6-779a4425f6eb.png?v=1736272246&width=300",
    },
  },
  {
    id: 6,
    src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/408eb64fd41d4df89cbd1b4aa80ae42c/408eb64fd41d4df89cbd1b4aa80ae42c.HD-1080p-7.2Mbps-41137630.mp4?v=0",
    poster:
      "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/408eb64fd41d4df89cbd1b4aa80ae42c.thumbnail.0000000000_600x.jpg?v=1737113226",
    product: {
      name: "Boost Energy Capsules",
      price: "$48.00",
      img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/wellness-men.png?v=1736344407&width=300",
    },
  },
];

export default function VideoReels() {
  const videoRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState({});

  useEffect(() => {
    // Mute videos by default
    Object.values(videoRefs.current).forEach((vid) => {
      if (vid) vid.muted = true;
    });
  }, []);

  useEffect(() => {
    // Play first video on load
    if (videoRefs.current[0]) {
      videoRefs.current[0].play();
      setIsPlaying({ 0: true });
    }
  }, []);

  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex; // 🔥 use realIndex with loop
    setActiveIndex(realIndex);

    Object.values(videoRefs.current).forEach((vid, idx) => {
      if (!vid) return;
      if (idx === realIndex) {
        vid.play();
        setIsPlaying((prev) => ({ ...prev, [idx]: true }));
      } else {
        vid.pause();
        setIsPlaying((prev) => ({ ...prev, [idx]: false }));
      }
    });
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
    Object.values(videoRefs.current).forEach((vid) => {
      if (vid) vid.muted = !muted;
    });
  };

  const togglePlayPause = (index) => {
    const vid = videoRefs.current[index];
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setIsPlaying((prev) => ({ ...prev, [index]: true }));
    } else {
      vid.pause();
      setIsPlaying((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <section className="w-full bg-[#FCF8F2] py-10 group relative">
      <h2 className="text-center font-semibold text-[30px] mb-1 uppercase">
        Real Stories, Real Recommendations!
      </h2>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
        pagination={{ clickable: true }}
        spaceBetween={24}
        slidesPerView={1.1}
        centeredSlides
        loop={true} // 🔥 enables infinite loop
        onSlideChange={handleSlideChange}
        breakpoints={{
          640: { slidesPerView: 1.2, centeredSlides: true },
          1024: { slidesPerView: 3, centeredSlides: true },
          1440: { slidesPerView: 4, centeredSlides: true },
        }}
        className="pb-10"
      >
        {reels.map((reel, idx) => (
          <SwiperSlide key={reel.id} className="flex justify-center">
            <div
              className={`relative flex flex-col transition-transform duration-500 ${
                activeIndex === idx
                  ? "scale-90 z-20"
                  : "scale-70 opacity-80 z-10"
              }`}
            >
              {/* Video */}
              <div className="relative aspect-[9/16] w-full rounded-3xl overflow-hidden shadow-md">
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={reel.src}
                  poster={reel.poster}
                  muted={muted}
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                />

                {/* Play/Pause */}
                <button
                  onClick={() => togglePlayPause(idx)}
                  className="absolute top-6 left-4 bg-black/20 text-white p-2 rounded-lg"
                >
                  {isPlaying[idx] ? <Pause size={33} /> : <Play size={33} />}
                </button>

                {/* Mute/Unmute */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-6 right-6 bg-black/20 text-white p-2 rounded-lg"
                >
                  {muted ? <VolumeX size={27} /> : <Volume2 size={27} />}
                </button>
              </div>

              {/* Product Bar */}
              <div className="flex items-center gap-4 border border-black rounded-[25px] p-5 bg-[#FCF8F2] mt-4 shadow-sm">
                <img
                  src={reel.product.img}
                  alt={reel.product.name}
                  className="h-30 w-30 object-contain flex-shrink-0"
                />
                <div className="text-left">
                  <h3 className="text-lg font-medium">{reel.product.name}</h3>
                  <p className="text-lg text-black">{reel.product.price}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button className="custom-prev absolute top-1/2 left-4 transform -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition bg-white p-2 rounded-full shadow hover:bg-gray-100">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button className="custom-next absolute top-1/2 right-4 transform -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition bg-white p-2 rounded-full shadow hover:bg-gray-100">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}

// "use client";
// import { useRef, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Volume2, VolumeX, Play, Pause } from "lucide-react";

// const reels = [
//   {
//     id: 1,
//     src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/f80275ae9c3b45b99879498c22b099ca/f80275ae9c3b45b99879498c22b099ca.HD-1080p-7.2Mbps-41137264.mp4?v=0",
//     poster: "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/f80275ae9c3b45b99879498c22b099ca.thumbnail.0000000000_600x.jpg?v=1737112615",
//     product: { name: "Women's Multi Capsules", price: "$36.00", img: "/images/prod1.png" },
//   },
//   {
//     id: 2,
//     src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/8cb6df095e464dbd8e219a53a0f6afac/8cb6df095e464dbd8e219a53a0f6afac.HD-1080p-2.5Mbps-41162163.mp4?v=0",
//     poster: "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/8cb6df095e464dbd8e219a53a0f6afac.thumbnail.0000000000_600x.jpg?v=1737147500",
//     product: { name: "Immunity Boost Capsules", price: "$42.00", img: "/images/prod2.png" },
//   },
//   {
//     id: 3,
//     src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/5702c2e5a1764787b0423a5809fdcd9c/5702c2e5a1764787b0423a5809fdcd9c.HD-1080p-7.2Mbps-41137234.mp4?v=0",
//     poster: "//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/5702c2e5a1764787b0423a5809fdcd9c.thumbnail.0000000000_600x.jpg?v=1737112565",
//     product: { name: "Natural Collagen", price: "$55.00", img: "/images/prod3.png" },
//   },
//   {
//     id: 4,
//     src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/62c7a55bd2464953a7883389affce416/62c7a55bd2464953a7883389affce416.HD-1080p-7.2Mbps-41162082.mp4?v=0",
//     poster:"//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/62c7a55bd2464953a7883389affce416.thumbnail.0000000000_600x.jpg?v=1737147344",
//     product: { name: "Boost Energy Capsules", price: "$48.00", img: "/images/prod4.png" },
//   },
//   {
//     id: 5,
//     src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/ae1780bea1d3427f9919b8c8bd9dffef/ae1780bea1d3427f9919b8c8bd9dffef.HD-1080p-3.3Mbps-41162255.mp4?v=0",
//     poster:"//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/ae1780bea1d3427f9919b8c8bd9dffef.thumbnail.0000000000_600x.jpg?v=1737147646",
//     product: { name: "Boost Energy Capsules", price: "$48.00", img: "/images/prod4.png" },
//   },
//   {
//     id: 5,
//     src: "//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/408eb64fd41d4df89cbd1b4aa80ae42c/408eb64fd41d4df89cbd1b4aa80ae42c.HD-1080p-7.2Mbps-41137630.mp4?v=0",
//     poster:"//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/408eb64fd41d4df89cbd1b4aa80ae42c.thumbnail.0000000000_600x.jpg?v=1737113226",
//     product: { name: "Boost Energy Capsules", price: "$48.00", img: "/images/prod4.png" },
//   },
// ];

// export default function VideoReels() {
//   const videoRefs = useRef({});
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [muted, setMuted] = useState(true);
//   const [isPlaying, setIsPlaying] = useState({});

//   const handleSlideChange = (swiper) => {
//     const newIndex = swiper.activeIndex;
//     setActiveIndex(newIndex);

//     Object.values(videoRefs.current).forEach((vid, idx) => {
//       if (!vid) return;
//       if (idx === newIndex) {
//         vid.play();
//         setIsPlaying((prev) => ({ ...prev, [idx]: true }));
//       } else {
//         vid.pause();
//         setIsPlaying((prev) => ({ ...prev, [idx]: false }));
//       }
//     });
//   };

//   const toggleMute = () => {
//     setMuted((prev) => !prev);
//     Object.values(videoRefs.current).forEach((vid) => {
//       if (vid) vid.muted = !muted;
//     });
//   };

//   const togglePlayPause = (index) => {
//     const vid = videoRefs.current[index];
//     if (!vid) return;

//     if (vid.paused) {
//       vid.play();
//       setIsPlaying((prev) => ({ ...prev, [index]: true }));
//     } else {
//       vid.pause();
//       setIsPlaying((prev) => ({ ...prev, [index]: false }));
//     }
//   };

//   return (
//     <section className="w-full bg-[#fbfaf6] py-12 group relative">
//       <div className="max-w-7xl mx-auto px-4">
//         <h2 className="text-center font-semibold text-sm tracking-widest mb-6 uppercase">
//           Real Stories, Real Recommendations!
//         </h2>

//         <Swiper
//           modules={[Navigation, Pagination]}
//           navigation={{
//             nextEl: ".custom-next",
//             prevEl: ".custom-prev",
//           }}
//           pagination={{ clickable: true }}
//           spaceBetween={20}
//           centeredSlides
//           slidesPerView={1.1}
//           onSlideChange={handleSlideChange}
//           breakpoints={{
//             640: { slidesPerView: 2, spaceBetween: 20 },
//             1024: { slidesPerView: 3, spaceBetween: 24 },
//             1440: { slidesPerView: 4, spaceBetween: 28 },
//           }}
//         >
//           {reels.map((reel, idx) => (
//             <SwiperSlide key={reel.id}>
//               <div
//                 className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm`}
//               >
//                 {/* Video */}
//                 <div className="relative aspect-[9/16] w-full">
//                   <video
//                     ref={(el) => (videoRefs.current[idx] = el)}
//                     src={reel.src}
//                     poster={reel.poster}
//                     muted={muted}
//                     playsInline
//                     loop
//                     className="w-full h-full object-cover"
//                   />

//                   {/* Play/Pause */}
//                   <button
//                     onClick={() => togglePlayPause(idx)}
//                     className="absolute top-3 left-3 bg-black/60 text-white p-2 rounded-full"
//                   >
//                     {isPlaying[idx] ? <Pause size={18} /> : <Play size={18} />}
//                   </button>

//                   {/* Mute/Unmute */}
//                   <button
//                     onClick={toggleMute}
//                     className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full"
//                   >
//                     {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
//                   </button>
//                 </div>

//                 {/* Product Bar */}
//                 <div className="border border-gray-200 rounded-lg p-3 text-center mt-4 bg-white">
//                   <img
//                     src={reel.product.img}
//                     alt={reel.product.name}
//                     className="h-14 mx-auto object-contain"
//                   />
//                   <h3 className="text-sm font-medium mt-2">{reel.product.name}</h3>
//                   <p className="text-xs text-gray-600">{reel.product.price}</p>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         {/* Navigation Arrows (only on hover of section) */}
//         <button className="custom-prev absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition bg-white p-2 rounded-full shadow hover:bg-gray-100">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <button className="custom-next absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition bg-white p-2 rounded-full shadow hover:bg-gray-100">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </div>
//     </section>
//   );
// }

// // "use client";
// // import { useRef, useState } from "react";
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Navigation, Pagination } from "swiper/modules";
// // import "swiper/css";
// // import "swiper/css/navigation";
// // import "swiper/css/pagination";
// // import { Volume2, VolumeX, Play, Pause } from "lucide-react";

// // const reels = [
// //   {
// //     id: 1,
// //     src: "/videos/reel1.mp4",
// //     poster: "/images/reel1.jpg",
// //     product: { name: "Women's Multi Capsules", price: "$36.00", img: "/images/prod1.png" },
// //   },
// //   {
// //     id: 2,
// //     src: "/videos/reel2.mp4",
// //     poster: "/images/reel2.jpg",
// //     product: { name: "Immunity Boost Capsules", price: "$42.00", img: "/images/prod2.png" },
// //   },
// //   {
// //     id: 3,
// //     src: "/videos/reel3.mp4",
// //     poster: "/images/reel3.jpg",
// //     product: { name: "Natural Collagen", price: "$55.00", img: "/images/prod3.png" },
// //   },
// //   {
// //     id: 4,
// //     src: "/videos/reel4.mp4",
// //     poster: "/images/reel4.jpg",
// //     product: { name: "Boost Energy Capsules", price: "$48.00", img: "/images/prod4.png" },
// //   },
// // ];

// // export default function VideoReels() {
// //   const videoRefs = useRef({});
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const [muted, setMuted] = useState(true);
// //   const [isPlaying, setIsPlaying] = useState({});

// //   const handleSlideChange = (swiper) => {
// //     const newIndex = swiper.activeIndex;
// //     setActiveIndex(newIndex);

// //     Object.values(videoRefs.current).forEach((vid, idx) => {
// //       if (!vid) return;
// //       if (idx === newIndex) {
// //         vid.play();
// //         setIsPlaying((prev) => ({ ...prev, [idx]: true }));
// //       } else {
// //         vid.pause();
// //         setIsPlaying((prev) => ({ ...prev, [idx]: false }));
// //       }
// //     });
// //   };

// //   const toggleMute = () => {
// //     setMuted((prev) => !prev);
// //     Object.values(videoRefs.current).forEach((vid) => {
// //       if (vid) vid.muted = !muted;
// //     });
// //   };

// //   const togglePlayPause = (index) => {
// //     const vid = videoRefs.current[index];
// //     if (!vid) return;

// //     if (vid.paused) {
// //       vid.play();
// //       setIsPlaying((prev) => ({ ...prev, [index]: true }));
// //     } else {
// //       vid.pause();
// //       setIsPlaying((prev) => ({ ...prev, [index]: false }));
// //     }
// //   };

// //   return (
// //     <section className="w-full bg-[#fbfaf6] py-12">
// //       <div className="max-w-7xl mx-auto px-4">
// //         <h2 className="text-center font-semibold text-sm tracking-widest mb-6">
// //           REAL STORIES, REAL RECOMMENDATIONS!
// //         </h2>

// //         <Swiper
// //           modules={[Navigation, Pagination]}
// //           navigation
// //           pagination={{ clickable: true }}
// //           spaceBetween={16}
// //           centeredSlides
// //           slidesPerView={1.1}
// //           onSlideChange={handleSlideChange}
// //           breakpoints={{
// //             640: { slidesPerView: 2, spaceBetween: 20 },
// //             1024: { slidesPerView: 3, spaceBetween: 24 },
// //             1440: { slidesPerView: 4, spaceBetween: 28 },
// //           }}
// //         >
// //           {reels.map((reel, idx) => (
// //             <SwiperSlide key={reel.id}>
// //               <div
// //                 className={`relative bg-white rounded-2xl overflow-hidden ${
// //                   activeIndex === idx ? "ring-2 ring-black" : ""
// //                 }`}
// //               >
// //                 {/* Video */}
// //                 <div className="relative aspect-[9/16] w-full">
// //                   <video
// //                     ref={(el) => (videoRefs.current[idx] = el)}
// //                     src={reel.src}
// //                     poster={reel.poster}
// //                     muted={muted}
// //                     playsInline
// //                     loop
// //                     className="w-full h-full object-cover"
// //                   />

// //                   {/* Play/Pause */}
// //                   <button
// //                     onClick={() => togglePlayPause(idx)}
// //                     className="absolute top-3 left-3 bg-black/60 text-white p-2 rounded-full"
// //                   >
// //                     {isPlaying[idx] ? <Pause size={18} /> : <Play size={18} />}
// //                   </button>

// //                   {/* Mute/Unmute */}
// //                   <button
// //                     onClick={toggleMute}
// //                     className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full"
// //                   >
// //                     {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
// //                   </button>
// //                 </div>

// //                 {/* Product Card (only for active video) */}
// //                 {activeIndex === idx && (
// //                   <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] bg-white shadow-md rounded-xl border p-4 text-center transition-all duration-500">
// //                     <img
// //                       src={reel.product.img}
// //                       alt={reel.product.name}
// //                       className="h-16 mx-auto object-contain"
// //                     />
// //                     <h3 className="text-sm font-medium mt-2">
// //                       {reel.product.name}
// //                     </h3>
// //                     <p className="text-xs text-gray-600">{reel.product.price}</p>
// //                   </div>
// //                 )}
// //               </div>
// //             </SwiperSlide>
// //           ))}
// //         </Swiper>
// //       </div>
// //     </section>
// //   );
// // }
