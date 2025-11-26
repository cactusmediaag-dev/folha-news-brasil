import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

import TopBar from "@/components/home/TopBar";
import BrandingHeader from "@/components/home/BrandingHeader";
import HeaderAdBanner from "@/components/home/HeaderAdBanner";
import HeroMosaic from "@/components/home/HeroMosaic";
import WebStoriesCarousel from "@/components/home/WebStoriesCarousel";
import NewsFeed from "@/components/home/NewsFeed";
import Sidebar from "@/components/home/Sidebar";
import Footer from "@/components/home/Footer";

export default function Home() {
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => base44.entities.Post.filter({ status: 'published' }, '-publish_date', 20),
    staleTime: 0,
    refetchOnMount: true,
  });

  console.log('Home - isLoading:', isLoading, 'posts:', posts.length, 'error:', error);

  // Sort by featured first, then by date
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return new Date(b.publish_date || b.created_date) - new Date(a.publish_date || a.created_date);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar />

      {/* Header with Logo and Navigation */}
      <BrandingHeader />

      {/* Header Ad Banner */}
      <HeaderAdBanner />

      {/* Hero Mosaic */}
      <HeroMosaic posts={sortedPosts} isLoading={isLoading} />

      {/* Web Stories Carousel */}
      <WebStoriesCarousel />

      {/* Main Content: Feed + Sidebar */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* News Feed - 2/3 */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">Últimas Notícias</h2>
                <div className="w-16 h-1 bg-[#D71E1F] mt-2 rounded-full" />
              </div>
              <NewsFeed posts={sortedPosts} />
            </div>

            {/* Sidebar - 1/3 */}
            <div>
              <Sidebar posts={sortedPosts} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}