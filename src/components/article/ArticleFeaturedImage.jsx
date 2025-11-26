import React from "react";

export default function ArticleFeaturedImage({ src, alt, caption }) {
  if (!src) return null;

  return (
    <figure className="max-w-[1140px] mx-auto px-4 mb-10">
      <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <img
          src={src}
          alt={alt}
          className="w-full object-cover"
          style={{ 
            maxHeight: '450px',
            objectPosition: 'center 20%'
          }}
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