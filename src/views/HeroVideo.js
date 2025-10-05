import React from "react";

export default function HeroVideo({ src, poster, className = "", overlay = true }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <video
        className="w-full h-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {overlay && <div className="absolute inset-0 bg-black/30" aria-hidden />}
    </div>
  );
}
