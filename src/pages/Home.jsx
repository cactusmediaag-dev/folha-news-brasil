import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

import TopBar from "@/components/home/TopBar";
import BrandingHeader from "@/components/home/BrandingHeader";
import HeaderAdBanner from "@/components/home/HeaderAdBanner";
import HeroMosaic from "@/components/home/HeroMosaic";
import WebStoriesCarousel from "@/components/home/WebStoriesCarousel";
import LatestNewsSection from "@/components/home/LatestNewsSection";
import InlineAdBanner from "@/components/home/InlineAdBanner";
import CidadesSection from "@/components/home/CidadesSection";
import EntertainmentWorldSection from "@/components/home/EntertainmentWorldSection";
import SportsSection from "@/components/home/SportsSection";
import TripleNewsGrid from "@/components/home/TripleNewsGrid";
import Footer from "@/components/home/Footer";

export default function Home() {
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => base44.entities.Post.filter({ status: 'published' }, '-publish_date', 30),
    staleTime: 0,
    refetchOnMount: true,
  });

  // Sort by featured first, then by date
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return new Date(b.publish_date || b.created_date) - new Date(a.publish_date || a.created_date);
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Top Bar */}
      <TopBar />

      {/* Header with Logo and Navigation */}
      <BrandingHeader />

      {/* Header Ad Banner */}
      <HeaderAdBanner />

      {/* Hero Mosaic - Sessão 1 */}
      <HeroMosaic posts={sortedPosts} isLoading={isLoading} />

      {/* Web Stories Carousel - Sessão 2 */}
      <WebStoriesCarousel />

      {/* Últimas Notícias + Timeline - Sessão 3 */}
      <LatestNewsSection posts={sortedPosts} />

      {/* Inline Ad Banner */}
      <InlineAdBanner />

      {/* Entretenimento & Mundo - Sessão 4 */}
      <EntertainmentWorldSection />

      {/* Categoria Cidades - Sessão 5 */}
      <CidadesSection />

      {/* Esportes + Brasileirão - Sessão 6 */}
      <SportsSection />

      {/* Triple News Grid - Nacional, Economia, Saúde - Sessão 7 */}
      <TripleNewsGrid />

      {/* Footer */}
      <Footer />
    </div>
  );
}