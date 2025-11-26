import React from "react";

export default function ArticleFeaturedImage({ src, alt, caption }) {
  if (!src) return null;

  return (
    <figure className="max-w-[1140px] mx-auto px-4 mb-10">
      <div 
        className="rounded-xl overflow-hidden shadow-lg" 
        style={{ aspectRatio: '16/9' }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-500 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}