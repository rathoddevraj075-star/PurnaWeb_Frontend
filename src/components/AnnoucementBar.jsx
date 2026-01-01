import React, { useEffect, useRef, useState } from "react";

export default function AnnouncementBar() {
  const containerRef = useRef(null); // element that contains the "slides"/marquee groups
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [isHidden, setIsHidden] = useState(false);
  const [, setCurrentIndex] = useState(0);

  const MOBILE_BREAKPOINT = 900; // same threshold as original

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined"
      ? window.innerWidth >= MOBILE_BREAKPOINT
      : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const messages = [
    "Complete Care for the Complete You",
  ];

  // localStorage check on mount
  useEffect(() => {
    const hiddenUntil = Number(
      localStorage.getItem("wt-announcement-hidden") || 0
    );
    if (hiddenUntil && Date.now() < hiddenUntil) {
      setIsHidden(true);
      return;
    }
    setIsHidden(false);
  }, []);

  // helper
  const isMobileView = () =>
    typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

  // start interval for mobile slider
  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      changeAnnouncement();
    }, 5000);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  // change slide (mobile)
  const changeAnnouncement = () => {
    if (!isMobileView()) return;
    const totalSlides = containerRef.current?.children.length || 0;
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => {
      const next = (prev + 1) % totalSlides;
      // apply transform
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = "transform 0.5s ease-in-out";
          containerRef.current.style.transform = `translateX(-${next * 100}vw)`;
        }
      });
      // if we loop back to 0, match original behaviour that briefly removes transition
      if (next === 0 && containerRef.current) {
        // after the transition completes, remove transition and snap back (original did a setTimeout 490ms)
        setTimeout(() => {
          if (!containerRef.current) return;
          containerRef.current.style.transition = "none";
          containerRef.current.style.transform = "translateX(0)";
          // flush to re-enable transition
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.transition =
                "transform 0.5s ease-in-out";
            }
          }, 0);
        }, 490);
      }
      return next;
    });
  };

  const previousAnnouncement = () => {
    const totalSlides = containerRef.current?.children.length || 0;
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => {
      const next = (prev - 1 + totalSlides) % totalSlides;
      if (containerRef.current) {
        containerRef.current.style.transition = "transform 0.5s ease-in-out";
        containerRef.current.style.transform = `translateX(-${next * 100}vw)`;
      }
      return next;
    });
  };

  // touch handlers
  const handleTouchStart = (e) => {
    if (!isMobileView()) return;
    touchStartX.current = e.touches[0].clientX;
    stopInterval(); // pause when user interacts
  };

  const handleTouchMove = (e) => {
    if (!isMobileView()) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isMobileView()) {
      startInterval();
      return;
    }
    const delta = touchEndX.current - touchStartX.current;
    if (Math.abs(delta) > 30) {
      if (delta < 0) {
        changeAnnouncement(); // swipe left -> next
      } else {
        previousAnnouncement(); // swipe right -> prev
      }
    }
    // reset delta and restart interval
    touchStartX.current = 0;
    touchEndX.current = 0;
    startInterval();
  };

  // close for one day
  const hideForOneDay = () => {
    const oneDayLater = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("wt-announcement-hidden", String(oneDayLater));
    setIsHidden(true);
    stopInterval();
  };

  // handle resize - if desktop now, reset transforms and index
  const handleResize = () => {
    if (window.innerWidth >= MOBILE_BREAKPOINT && containerRef.current) {
      containerRef.current.style.transform = "translateX(0)";
      setCurrentIndex(0);
    } else if (window.innerWidth < MOBILE_BREAKPOINT) {
      // ensure interval running on mobile
      startInterval();
    }
  };

  // mount lifecycle - attach handlers and start interval if in mobile mode
  useEffect(() => {
    if (!containerRef.current) return;
    // set transition style (the original sets it)
    containerRef.current.style.transition = "transform 0.5s ease-in-out";

    // mobile interval + touch events
    if (isMobileView()) {
      startInterval();
    }

    // touch listeners (passive: true)
    const el = containerRef.current;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    window.addEventListener("resize", handleResize);

    return () => {
      stopInterval();
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isHidden) return null;

  // Build the content groups:
  // - For marquee behavior on desktop we duplicate the block to allow seamless scroll.
  // - For mobile the container children act as slides; each child is one "group".
  const buildMarqueeGroup = () => {
    // Each group repeats the messages a few times to mimic the original repeated items
    // Adjust repetition count to get nice continuous width
    return (
      <div className="wt-announcement__marquee inline-flex items-center whitespace-nowrap">
        {/* repeat the message blocks so the width exceeds viewport */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="wt-announcement__body wt-announcement__text px-6 py-2 text-sm md:text-base"
            role="region"
            aria-label="Announcement"
          >
            {messages[0]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* marquee keyframes + small helper styles */}
      <style>{`
        /* marquee animation for desktop */
        @keyframes wt-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } /* since we duplicate content */
        }
        .wt-announcement {
          --color-background: #2d2d2d;
          --color-text: #ffffff;
        }
        /* Decorator classes used for semantics (kept for familiarity) */
        .wt-announcement__container--marquee .wt-announcement__marquee-wrapper {
          display: none;
        }

        /* For wider screens we apply continuous marquee using duplicated children */
        @media (min-width: ${MOBILE_BREAKPOINT}px) {
          .wt-announcement__marquee-wrapper {
            display: block;
            overflow: hidden;
            width: 100%;
          }
          .wt-announcement__marquee-track {
            display: inline-flex;
            width: 200%; /* because content is duplicated */
            animation: wt-marquee var(--time, 40s) linear infinite;
            align-items: center;
          }
          .wt-announcement__marquee {
            display: inline-flex;
            align-items: center;
          }
        }

        /* On mobile we want slides (full-viewport width per group) */
        @media (max-width: ${MOBILE_BREAKPOINT - 1}px) {
          .wt-announcement__container {
            display: block;
            width: 100vw;
            overflow: hidden;
          }
          .wt-announcement__container > .wt-announcement__marquee {
            display: inline-block;
            width: 100vw;
            vertical-align: top;
          }
        }

        /* Simple close button styling (we mostly use Tailwind, this is fallback) */
        .wt-announcement__close {
          background: transparent;
          border: none;
          cursor: pointer;
        }
      `}</style>

      <section
        id="wt-announcement"
        className="wt-announcement relative z-40 w-full bg-[#2d2d2d] text-white select-none"
      >
        {/* Container wrapper: - On desktop we show a continuous marquee track (duplicated groups).
            - On mobile this is still the containerRef but children are slides (each one 100vw). */}
        <div
          id="wt-announcement__container"
          ref={containerRef}
          className="wt-announcement__container wt-announcement__container--marquee"
          style={{
            "--time": "100s",
            transition: "transform 0.5s ease-in-out",
            transform: "translateX(0)",
          }}
        >
          <div className="wt-announcement__marquee-track">
            {isDesktop ? (
              <>
                {buildMarqueeGroup()}
                {buildMarqueeGroup()}
              </>
            ) : (
              buildMarqueeGroup()
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <button
            aria-label="Close announcement bar"
            className="wt-announcement__close p-2 focus:outline-none"
            onClick={hideForOneDay}
          >
            {/* SVG close icon roughly matching the original */}
            <svg
              className="svg-icon svg-icon--close wt-announcement__close__icon w-6 h-6"
              aria-hidden="true"
              focusable="false"
              role="presentation"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 72 72"
            >
              <g transform="rotate(-90 -1e-6 72)">
                <path
                  d="m58.76,133.59-22.76-22.58-22.76,22.58a1.41,1.41 0 0 1-1.99,0l-0.83-0.82a1.38,1.38 0 0 1 0-1.98l22.97-22.79L10.65,84.99a1.39,1.39 0 0 1 0-1.98l0.83-0.82a1.42,1.42 0 0 1 1.99,0l22.76,22.58L58.76,58.39a1.42,1.42 0 0 1 2,0l0.83,0.82a1.39,1.39 0 0 1 0,1.98L38.63,85.97l22.97,22.79a1.39,1.39 0 0 1 0,1.98l-0.83,0.82a1.42,1.42 0 0 1-2,0z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}
