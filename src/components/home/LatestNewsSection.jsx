import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import WeatherWidget from "./WeatherWidget";

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

export default function LatestNewsSection({ posts = [] }) {
  // Exclude first 3 posts (used in Hero), get next 4
  const feedPosts = posts.slice(3, 7);
  const timelinePosts = posts.slice(3, 11);

  if (feedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-10" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Últimas Notícias</h2>
          <div className="w-16 h-1 bg-[#D71E1F] mt-2 rounded-full" />
        </div>

        {/* Grid: Feed + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-8">
          
          {/* Left Column - News Feed */}
          <div className="space-y-6">
            {feedPosts.map((post) => (
              <Link
                key={post.id}
                to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                className="flex gap-4 group"
              >
                {/* Thumbnail - Compact on mobile */}
                    <div className="flex-shrink-0 w-[90px] h-[70px] sm:w-40 sm:h-28 rounded-md sm:rounded-lg overflow-hidden">
                      <img
                        src={post.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=300&fit=crop"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Content - Priority on mobile */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-[10px] sm:text-xs font-semibold text-[#D71E1F] uppercase">
                        {categoryLabels[post.category] || post.category}
                      </span>
                      <h3 className="text-[15px] sm:text-base font-bold text-[#1A1A1A] leading-[1.3] mt-1 group-hover:text-[#D71E1F] transition-colors line-clamp-3 sm:line-clamp-2" style={{ fontFamily: "'Overpass', sans-serif", letterSpacing: "-0.3px" }}>
                        {post.title}
                      </h3>
                      {post.subtitle && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2 hidden sm:block">
                          {post.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(post.publish_date || post.created_date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
              </Link>
            ))}
          </div>

          {/* Right Column - Weather + Timeline "Leia Também" */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              {/* Weather Widget */}
              <WeatherWidget />

              <h3 className="text-lg font-bold text-[#1A1A1A] mb-5 mt-6">Leia Também</h3>
              
              {/* Timeline Container */}
              <div className="relative pl-6">
                {/* Vertical Line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

                {/* Timeline Items */}
                <div className="space-y-5">
                  {timelinePosts.slice(0, 2).map((post, index) => (
                    <Link
                      key={post.id}
                      to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                      className="block group relative"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-[#D71E1F] ring-2 ring-white" />
                      
                      {/* Time */}
                      <span className="text-xs font-bold text-[#D71E1F]">
                        {formatDistanceToNow(new Date(post.publish_date || post.created_date), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                      
                      {/* Title */}
                      <h4 className="text-sm font-semibold text-[#1A1A1A] mt-1 group-hover:text-[#D71E1F] transition-colors line-clamp-2" style={{ fontFamily: "'Overpass', sans-serif", lineHeight: "1.4", letterSpacing: "-0.3px" }}>
                        {post.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}