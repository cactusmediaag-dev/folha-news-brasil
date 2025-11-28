import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function InlineAdBanner() {
  const { data: banners = [] } = useQuery({
    queryKey: ['inline-banners'],
    queryFn: () => base44.entities.Banner.filter({ position: 'inline_article', is_active: true }),
  });

  const activeBanner = banners[0];

  const handleClick = async () => {
    if (activeBanner) {
      await base44.entities.Banner.update(activeBanner.id, {
        clicks_count: (activeBanner.clicks_count || 0) + 1
      });
    }
  };

  return (
    <section className="py-8 bg-gray-100 inline-ad-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 h-[120px] sm:h-[150px] flex items-center justify-center">
          {activeBanner ? (
            <a
              href={activeBanner.destination_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="w-full h-full"
            >
              <img
                src={activeBanner.image_url}
                alt={activeBanner.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </a>
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-sm font-medium">Espaço Publicitário</p>
              <p className="text-xs">728x90 / 970x90</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}