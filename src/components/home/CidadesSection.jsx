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
      <section className="bg-white py-10 border-b border-gray-100">
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
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
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

        {/* News Grid - 2 Columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/Noticia?slug=${post.slug}`}
              className="flex gap-5 group"
            >
              {/* Thumbnail */}
              <div className="w-[240px] h-[160px] flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={post.featured_image || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center py-1">
                {/* Category Tag */}
                <span
                  className="text-xs font-semibold uppercase mb-2"
                  style={{ color: "#546E7A" }}
                >
                  Cidade
                </span>

                {/* Title */}
                <h3
                  className="text-lg font-bold text-[#1A1A1A] leading-snug mb-2 line-clamp-2 group-hover:text-[#D71E1F] transition-colors"
                  style={{ fontFamily: "'Overpass', sans-serif" }}
                >
                  {post.title}
                </h3>

                {/* Subtitle/Summary */}
                {post.subtitle && (
                  <p
                    className="text-sm text-gray-500 line-clamp-2 mb-3"
                    style={{ fontFamily: "'Overpass', sans-serif" }}
                  >
                    {post.subtitle}
                  </p>
                )}

                {/* Meta - Time */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
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