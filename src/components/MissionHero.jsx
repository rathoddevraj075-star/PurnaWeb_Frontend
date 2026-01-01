import React, { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export default function MissionHero() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <section className="relative bg-[#FCF8F2] w-full h-[300px] md:h-[500px] overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/fb630cfc6d81416aacff24b567afb494/fb630cfc6d81416aacff24b567afb494.HD-1080p-7.2Mbps-41272877.mp4?v=0"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <p className="lg:text-sm md:text-md font-light mb-4">
            Letter from CEO
          </p>
          <h1 className="text-sm md:text-3xl lg:text-3xl max-w-[700px] mb-6">
            "WELLNESS INC. ENVISIONS A FUTURE WHERE BIOLOGY AND TECHNOLOGY UNITE. UNLOCKING NEW POSSIBILITIES AND REDIFING INNOVATION."
          </h1>
        </div>

        {/* Play/Pause Button - top left, transparent */}
        <button
          onClick={togglePlay}
          className="absolute top-6 left-6 z-20 text-white hover:text-gray-300 transition"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </section>

    </div>

  );
}
