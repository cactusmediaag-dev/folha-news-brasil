import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Clock, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CidadesSection() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts-cidades"],
    queryFn: () => base44.entities.Post.filter(
      { category: "cidade", status: "published" },
      "-publish_date",
      4
    ),
  });

  if (isLoading) {
    return (
      <section className="py-10" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="h-14 bg-gray-200 rounded-lg animate-pulse mb-8" />
          {/* Grid Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-5">
                <div className="w-[240px] h-[160px] bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-10" style={{ backgroundColor: 'transparent' }}>
      <div className="site-container">
        {/* Boxed Header */}
        <div
          className="rounded-lg px-6 py-3 flex items-center justify-between mb-8"
          style={{
            background: "linear-gradient(135deg, #546E7A 0%, #78909C 100%)",
            boxShadow: "0 4px 10px rgba(84, 110, 122, 0.2)",
          }}
        >
          {/* Left - Title */}
          <div className="flex items-center">
            <div
              className="rounded-full mr-4"
              style={{
                width: "6px",
                height: "24px",
                backgroundColor: "#fff",
                borderRadius: "10px",
              }}
            />
            <h2
              className="text-white m-0"
              style={{
                fontFamily: "'Overpass', sans-serif",
                fontWeight: 800,
                fontSize: "1.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Cidades
            </h2>
          </div>

          {/* Right - See More */}
          <Link
            to="/Categoria?slug=cidade"
            className="flex items-center gap-1 text-white/90 hover:text-white transition-all group"
            style={{
              fontFamily: "'Overpass', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Ver mais
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News Grid - 2 Columns Desktop, 1 Column Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/Noticia?slug=${post.slug}`}
              className="flex flex-row items-start gap-3 md:gap-5 group pb-4 md:pb-0 border-b border-gray-100 md:border-0"
            >
              {/* Thumbnail - Fixed size on mobile */}
              <div className="w-[100px] h-[75px] md:w-[240px] md:h-[160px] flex-shrink-0 rounded-md md:rounded-lg overflow-hidden">
                <img
                  src={post.featured_image || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content - Priority text on mobile */}
              <div className="flex-1 min-w-0 flex flex-col justify-center py-0 md:py-1">
                {/* Category Tag */}
                <span
                  className="text-[10px] md:text-xs font-semibold uppercase mb-1 md:mb-2"
                  style={{ color: "#546E7A" }}
                >
                  Cidade
                </span>

                {/* Title - 3 lines on mobile */}
                <h3
                  className="text-[15px] md:text-lg font-bold text-[#1A1A1A] leading-[1.3] mb-1 md:mb-2 line-clamp-3 md:line-clamp-2 group-hover:text-[#D71E1F] transition-colors"
                  style={{ fontFamily: "'Overpass', sans-serif" }}
                >
                  {post.title}
                </h3>

                {/* Subtitle/Summary - Hidden on mobile */}
                {post.subtitle && (
                  <p
                    className="hidden md:block text-sm text-gray-500 line-clamp-2 mb-3"
                    style={{ fontFamily: "'Overpass', sans-serif" }}
                  >
                    {post.subtitle}
                  </p>
                )}

                {/* Meta - Time */}
                <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-gray-400">
                  <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>
                    {formatDistanceToNow(new Date(post.publish_date || post.created_date), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}