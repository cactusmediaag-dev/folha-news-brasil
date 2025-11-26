import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import TopBar from "@/components/home/TopBar";
import BrandingHeader from "@/components/home/BrandingHeader";
import Footer from "@/components/home/Footer";
import InlineAdBanner from "@/components/home/InlineAdBanner";
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_GRADIENTS } from "@/components/shared/CategoryColors";

const POSTS_PER_PAGE = 6;

export default function Categoria() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug") || "politica";
  const [currentPage, setCurrentPage] = useState(1);

  const categoryColor = CATEGORY_COLORS[slug] || "#607D8B";
  const categoryGradient = CATEGORY_GRADIENTS[slug] || CATEGORY_GRADIENTS['default'];
  const categoryLabel = CATEGORY_LABELS[slug] || slug;

  // Fetch all posts for this category
  const { data: allPosts = [], isLoading } = useQuery({
    queryKey: ['category-posts', slug],
    queryFn: () => base44.entities.Post.filter({ status: 'published', category: slug }, '-publish_date', 50),
  });

  // Hero posts (top 3)
  const heroPosts = allPosts.slice(0, 3);
  
  // Feed posts (rest, paginated)
  const feedPosts = allPosts.slice(3);
  const totalPages = Math.ceil(feedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = feedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Title */}
      <title>Notícias sobre {categoryLabel} | Folha News Brasil</title>

      {/* Header Global */}
      <TopBar />
      <BrandingHeader />

      {/* Barra de Identidade - Boxed Gradient Card */}
      <section className="max-w-7xl mx-auto px-4" style={{ marginTop: '30px', marginBottom: '10px' }}>
        <div
          className="flex items-center"
          style={{
            background: categoryGradient,
            borderRadius: '12px',
            minHeight: '100px',
            padding: '0 40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <div>
            <p className="text-white/80 text-sm mb-1">Início &gt; {categoryLabel}</p>
            <h1 
              className="text-2xl sm:text-[32px] font-bold text-white uppercase tracking-wide"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              {categoryLabel}
            </h1>
          </div>
        </div>
      </section>

      {/* Category Hero - Top 3 Posts */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 h-[450px]">
            <div className="bg-gray-200 rounded-xl animate-pulse" />
            <div className="flex flex-col gap-5">
              <div className="flex-1 bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        ) : heroPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhuma notícia encontrada nesta categoria.</p>
          </div>
        ) : heroPosts.length === 1 ? (
          // Single post - full width
          <Link
            to={`${createPageUrl("Noticia")}?slug=${heroPosts[0].slug}`}
            className="block relative h-[400px] rounded-xl overflow-hidden group"
          >
            <img
              src={heroPosts[0].featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop"}
              alt={heroPosts[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight group-hover:underline">
                {heroPosts[0].title}
              </h2>
              {heroPosts[0].subtitle && (
                <p className="text-white/80 mt-2 line-clamp-2">{heroPosts[0].subtitle}</p>
              )}
            </div>
          </Link>
        ) : (
          // 2 or 3 posts - mosaic layout
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5" style={{ height: '450px' }}>
            {/* Main Post */}
            <Link
              to={`${createPageUrl("Noticia")}?slug=${heroPosts[0].slug}`}
              className="relative rounded-xl overflow-hidden group h-full"
            >
              <img
                src={heroPosts[0].featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop"}
                alt={heroPosts[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold rounded mb-3"
                  style={{ backgroundColor: categoryColor }}
                >
                  {categoryLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight group-hover:underline">
                  {heroPosts[0].title}
                </h2>
              </div>
            </Link>

            {/* Side Posts */}
            <div className="flex flex-col gap-5 h-full">
              {heroPosts.slice(1, 3).map((post) => (
                <Link
                  key={post.id}
                  to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                  className="relative flex-1 rounded-xl overflow-hidden group"
                >
                  <img
                    src={post.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-sm sm:text-base font-bold leading-tight group-hover:underline line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Mid-Page Ad Banner */}
      <InlineAdBanner />

      {/* Feed - Remaining Posts */}
      {paginatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Mais Notícias</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <Link
                key={post.id}
                to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&h=400&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1A1A1A] leading-tight line-clamp-2 group-hover:text-[#D71E1F] transition-colors">
                    {post.title}
                  </h3>
                  {post.subtitle && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.subtitle}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(post.publish_date || post.created_date), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                    {post.views_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views_count}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-[#D71E1F] hover:bg-[#b91c1c]" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}