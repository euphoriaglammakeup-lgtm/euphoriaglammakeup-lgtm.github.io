import React, { useEffect, useRef, useState } from "react";

export default function MediaCarousel({
  items = [],
  intervalMs = 3500,
  className = "",
  rounded = true,
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const isHoveredRef = useRef(false);

  const go = (next) => {
    const len = items.length || 1;
    setIndex(((next % len) + len) % len);
  };

  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  // autoplay independent of index so it doesn't reset every slide
  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      if (!isHoveredRef.current) {
        setIndex((i) => (i + 1) % items.length);
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [items.length, intervalMs]);

  // touch swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40; // px
    if (delta > threshold) prev();
    if (delta < -threshold) next();
    touchStartX.current = null;
  };

  // pause autoplay on hover (desktop)
  const onMouseEnter = () => {
    isHoveredRef.current = true;
  };
  const onMouseLeave = () => {
    isHoveredRef.current = false;
  };

  return (
    <div
      className={`relative overflow-hidden ${rounded ? "rounded-2xl" : ""} ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* track */}
      <div
        className="whitespace-nowrap transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {items.map((it, i) => (
          <div key={i} className="inline-block align-top w-full h-full">
            {it.type === "video" ? (
              <video
                className="w-full h-80 md:h-96 object-cover"
                src={it.src}
                poster={it.poster}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={it.src}
                alt={it.alt || `slide-${i}`}
                className="w-full h-80 md:h-96 object-cover"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {/* controls */}
      {items.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow px-3 py-2 rounded-full"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow px-3 py-2 rounded-full"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-white shadow" : "bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
