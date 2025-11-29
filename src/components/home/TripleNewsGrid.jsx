import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronRight, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const categories = [
  { key: "brasil", label: "Nacional", color: "#009c3b" },
  { key: "economia", label: "Economia", color: "#DAA520" },
  { key: "saude", label: "Saúde", color: "#00BCD4" },
];

function CategoryColumn({ category, label, color }) {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: [`posts-${category}`],
    queryFn: () =>
      base44.entities.Post.filter(
        { category, status: "published" },
        "-publish_date",
        4
      ),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        {/* Big Card Skeleton */}
        <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
        {/* List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-20 h-20 bg-gray-200 rounded-md animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  const mainPost = posts[0];
  const listPosts = posts.slice(1, 4);

  return (
    <div>
      {/* CNN Style Header */}
      <div className="flex items-center gap-2 mb-4 border-b-2 border-gray-100 pb-3">
        <h3
          className="m-0 uppercase"
          style={{
            fontFamily: "'Overpass', sans-serif",
            fontWeight: 800,
            fontSize: "1.2rem",
            color: color,
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </h3>
        <span
          className="inline-block"
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: color,
          }}
        />
      </div>

      {/* Big Card - Epic Style */}
      <Link
        to={`/Noticia?slug=${mainPost.slug}`}
        className="block relative overflow-hidden rounded-lg mb-5 group"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={
            mainPost.featured_image ||
            "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600"
          }
          alt={mainPost.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute bottom-0 left-0 w-full p-4 md:p-5"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
          }}
        >
          <h4
            className="text-white m-0 leading-[1.3]"
            style={{
              fontFamily: "'Overpass', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {mainPost.title}
          </h4>
        </div>
      </Link>

      {/* News List - Compact Style */}
      <div className="space-y-0">
        {listPosts.map((post, index) => (
          <Link
            key={post.id}
            to={`/Noticia?slug=${post.slug}`}
            className={`flex items-start gap-3 py-3 group ${
              index < listPosts.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            {/* Thumbnail */}
            <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
              <img
                src={
                  post.featured_image ||
                  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200"
                }
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h5
                className="text-[#1A1A1A] m-0 leading-[1.35] line-clamp-3 transition-colors"
                style={{
                  fontFamily: "'Overpass', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  "--hover-color": color,
                }}
                onMouseEnter={(e) => (e.target.style.color = color)}
                onMouseLeave={(e) => (e.target.style.color = "#1A1A1A")}
              >
                {post.title}
              </h5>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(
                    new Date(post.publish_date || post.created_date),
                    { addSuffix: true, locale: ptBR }
                  )}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* See More Link */}
      <Link
        to={`/Categoria?slug=${category}`}
        className="inline-flex items-center gap-1 mt-4 text-gray-500 hover:text-gray-800 transition-colors group"
        style={{
          fontFamily: "'Overpass', sans-serif",
          fontWeight: 600,
          fontSize: "13px",
        }}
      >
        Veja mais em {label}
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

export default function TripleNewsGrid() {
  return (
    <section className="py-12" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {categories.map((cat) => (
            <CategoryColumn
              key={cat.key}
              category={cat.key}
              label={cat.label}
              color={cat.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}