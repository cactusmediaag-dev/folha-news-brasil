import React from "react";

export default function ArticleFeaturedImage({ src, alt, caption }) {
  if (!src) return null;

  return (
    <figure className="max-w-[900px] mx-auto px-4 mb-8">
      <div className="rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-500 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}