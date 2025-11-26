import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryLabels = {
  politica: "Política",
  economia: "Economia",
  esportes: "Esportes",
  entretenimento: "Entretenimento",
  tecnologia: "Tecnologia",
  saude: "Saúde",
  educacao: "Educação",
  mundo: "Mundo",
  brasil: "Brasil",
  local: "Local",
};

export default function HeroMosaic({ posts = [], isLoading = false }) {
  // Debug log
  console.log('HeroMosaic - Total posts received:', posts.length);
  console.log('HeroMosaic - Featured posts:', posts.filter(p => p.is_featured).map(p => p.title));

  // Filter featured posts first, then sort by date
  const featuredPosts = posts
    .filter(p => p.is_featured === true)
    .sort((a, b) => new Date(b.publish_date || b.created_date) - new Date(a.publish_date || a.created_date));
  
  // If not enough featured posts, fill with regular posts sorted by date
  const regularPosts = posts
    .filter(p => !p.is_featured)
    .sort((a, b) => new Date(b.publish_date || b.created_date) - new Date(a.publish_date || a.created_date));

  const displayPosts = featuredPosts.length >= 3 
    ? featuredPosts.slice(0, 3)
    : [...featuredPosts, ...regularPosts].slice(0, 3);

  console.log('HeroMosaic - Display posts:', displayPosts.map(p => ({ title: p.title, featured: p.is_featured })));

  const mainPost = displayPosts[0];
  const sidePosts = displayPosts.slice(1, 3);

  // Loading skeleton - show while loading OR when we don't have enough posts yet
  if (isLoading || displayPosts.length < 3) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hero-mosaic-grid">
            <div className="main-post bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center animate-pulse">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 font-semibold">Carregando destaques...</p>
              </div>
            </div>
            <div className="side-posts">
              <div className="side-post bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
              <div className="side-post bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="hero-mosaic-grid">
          {/* Main News - Left Column */}
          <Link 
            to={`${createPageUrl("Noticia")}?slug=${mainPost.slug}`}
            className="main-post relative rounded-xl overflow-hidden group"
          >
            <img
              src={mainPost.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop"}
              alt={mainPost.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
              <Badge className="w-fit bg-[#D71E1F] hover:bg-[#b91c1c] text-white mb-3 font-semibold">
                {categoryLabels[mainPost.category] || mainPost.category}
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 line-clamp-3 drop-shadow-lg">
                {mainPost.title}
              </h1>
              {mainPost.subtitle && (
                <p className="text-white/90 text-sm sm:text-base line-clamp-2 mb-3 font-normal">
                  {mainPost.subtitle}
                </p>
              )}
              <div className="flex items-center gap-4 text-white/80 text-sm font-normal">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {format(new Date(mainPost.publish_date || mainPost.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
                {mainPost.author_name && (
                  <span>Por {mainPost.author_name}</span>
                )}
              </div>
            </div>
          </Link>

          {/* Side News - Right Column */}
          <div className="side-posts">
            {sidePosts.length > 0 ? (
              sidePosts.map((post) => (
                <Link
                  key={post.id}
                  to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                  className="side-post relative rounded-xl overflow-hidden group"
                >
                  <img
                    src={post.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop"}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end z-10">
                    <Badge className="w-fit bg-[#D71E1F] hover:bg-[#b91c1c] text-white mb-2 text-xs font-semibold">
                      {categoryLabels[post.category] || post.category}
                    </Badge>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <div className="side-post bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
                <div className="side-post bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}