import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function HeaderAdBanner() {
  // Fetch active banner for header position
  const { data: banners = [] } = useQuery({
    queryKey: ['header-banner'],
    queryFn: () => base44.entities.Banner.filter({ position: 'header', is_active: true }),
  });

  const activeBanner = banners[0];

  const handleBannerClick = async () => {
    if (activeBanner?.id) {
      // Track click
      await base44.entities.Banner.update(activeBanner.id, {
        clicks_count: (activeBanner.clicks_count || 0) + 1
      }).catch(() => {});
    }
  };

  return (
    <section className="py-4 bg-white">
      <div className="site-container">
        <div className="flex justify-center">
          {activeBanner?.image_url ? (
            <a
              href={activeBanner.destination_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBannerClick}
              className="block"
            >
              {/* Desktop: 970x90 */}
              <img
                src={activeBanner.image_url}
                alt={activeBanner.name || 'Publicidade'}
                className="hidden lg:block max-w-[970px] h-[90px] object-contain"
              />
              {/* Tablet: 728x90 */}
              <img
                src={activeBanner.image_url}
                alt={activeBanner.name || 'Publicidade'}
                className="hidden md:block lg:hidden max-w-[728px] h-[90px] object-contain"
              />
              {/* Mobile: 320x50 or 300x250 */}
              <img
                src={activeBanner.image_url}
                alt={activeBanner.name || 'Publicidade'}
                className="block md:hidden max-w-[320px] h-auto object-contain"
              />
            </a>
          ) : (
            // Placeholder when no banner
            <div className="w-full">
              {/* Desktop Placeholder */}
              <div className="hidden lg:flex w-[970px] h-[90px] bg-[#F5F5F5] rounded-lg items-center justify-center mx-auto">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Publicidade</span>
              </div>
              {/* Tablet Placeholder */}
              <div className="hidden md:flex lg:hidden w-[728px] h-[90px] bg-[#F5F5F5] rounded-lg items-center justify-center mx-auto">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Publicidade</span>
              </div>
              {/* Mobile Placeholder */}
              <div className="flex md:hidden w-[320px] h-[50px] bg-[#F5F5F5] rounded-lg items-center justify-center mx-auto">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Publicidade</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}