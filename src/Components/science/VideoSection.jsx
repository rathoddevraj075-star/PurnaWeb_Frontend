import { useRef, useState } from "react";

export default function ScienceHero() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

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

  return (
    <section className="relative w-full bg-black border-b border-black">
      {/* Video Background */}
      <div className="relative w-full h-[340px] md:h-[583px] overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted
          loop
          poster="https://wonder-theme-wellness.myshopify.com/cdn/shop/files/preview_images/131f028f00714cfc9cf29a1b8f649aec.thumbnail.0000000000_600x.jpg?v=1737460312"
        >
          <source
            src="https://wonder-theme-wellness.myshopify.com/cdn/shop/videos/c/vp/131f028f00714cfc9cf29a1b8f649aec/131f028f00714cfc9cf29a1b8f649aec.HD-1080p-7.2Mbps-41314991.mp4?v=0"
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0  flex items-center justify-center text-center px-4">
          <div className="text-white max-w-2xl">
            <h3 className="uppercase tracking-wide text-sm md:text-md font-extrabold mb-2">
              our mission
            </h3>
            <h2 className="text-2xl md:text-7xl font-bold">
              THERE’S A SCIENCE TO THE SCIENCE.
            </h2>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          aria-label="Play/pause button"
          className="absolute top-4 left-4 flex justify-center items-center w-10 h-10 bg-black/40 text-white rounded-lg"
        >
          {isPlaying ? (
            // Pause icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            // Play icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
