import React from "react";

export default function ArticleFeaturedImage({ src, alt, caption }) {
  if (!src) return null;

  return (
    <figure className="max-w-4xl mx-auto px-4 mb-8">
      <div className="rounded-xl overflow-hidden shadow-lg">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
          loading="eager"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-500 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}