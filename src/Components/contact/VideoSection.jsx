"use client";
import { useEffect, useRef, useState } from "react";

export default function ContactVideoSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Toggle video play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Sync icon state with actual video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <section className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] overflow-hidden border-b border-black">
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        autoPlay
        loop
        muted
        poster="//wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/e3872cc7258944328fd7e1672eeb733d.thumbnail.0000000000_600x.jpg?v=1736514567"
      >
        <source
          src="//wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/e3872cc7258944328fd7e1672eeb733d/e3872cc7258944328fd7e1672eeb733d.HD-1080p-7.2Mbps-40800725.mp4?v=0"
          type="video/mp4"
        />
      </video>

      {/* Overlay with title */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlayPause}
      >
        <h2 className="text-white text-4xl md:text-6xl font-bold">CONTACT</h2>
      </div>

      {/* Play / Pause button */}
      <button
        onClick={togglePlayPause}
        aria-label="Play/pause button"
        className="absolute top-4 left-4 z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-black/40 text-white"
      >
        {isPlaying ? (
          // Pause icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 512 512"
            fill="currentColor"
          >
            <path d="M224,435.8V76.1c0-6.7-5.4-12.1-12.2-12.1h-71.6c-6.8,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6   C218.6,448,224,442.6,224,435.8z" />
            <path d="M371.8,64h-71.6c-6.7,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6c6.7,0,12.2-5.4,12.2-12.2V76.1   C384,69.4,378.6,64,371.8,64z" />
          </svg>
        ) : (
          // Play icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 10 14"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.48 0.81C0.82 0.45 0 0.93 0 1.69v10.52c0 0.78 0.86 1.26 1.53 0.85l9.01-5.56c0.65-0.4 0.63-1.36-0.17-1.73L1.48 0.81z"
            />
          </svg>
        )}
      </button>
    </section>
  );
}
