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
  cidade: "Cidades",
  ciencia: "Ciência",
  turismo: "Turismo",
  nacional: "Nacional",
};

export default function LatestNewsSection({ posts = [] }) {
  // Distribute posts to avoid repetition
  // Exclude first 3 (used in Hero)
  const availablePosts = posts.slice(3);
  
  const ultimasNoticias = availablePosts.slice(0, 5);      // Col 1: 5 posts
  const folhaDestaque = availablePosts.slice(5, 10);       // Col 2: 5 posts (1 hero + 4 mini)
  const leiaTambem = availablePosts.slice(10, 14);         // Col 3: 4 posts

  if (ultimasNoticias.length === 0 && folhaDestaque.length === 0) {
    return null;
  }

  const heroDestaque = folhaDestaque[0];
  const miniDestaque = folhaDestaque.slice(1, 5);

  return (
    <section className="py-10" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 3-Column Grid */}
        <div className="main-news-grid">
          
          {/* ===== COLUNA 1: Últimas Notícias (Esquerda) ===== */}
          <div className="col-ultimas order-2 lg:order-1">
            {/* Header */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Overpass', sans-serif" }}>
                Últimas Notícias
              </h2>
              <div className="w-14 h-1 bg-[#D71E1F] mt-2 rounded-full" />
            </div>

            {/* Compact List */}
            <div className="space-y-4">
              {ultimasNoticias.map((post, index) => (
                <Link
                  key={post.id}
                  to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                  className={`flex gap-3 group pb-4 ${index < ultimasNoticias.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-[80px] h-[60px] rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-[10px] font-semibold text-[#D71E1F] uppercase">
                      {categoryLabels[post.category] || post.category}
                    </span>
                    <h3 
                      className="text-[14px] font-semibold text-[#1A1A1A] leading-[1.35] mt-0.5 group-hover:text-[#D71E1F] transition-colors line-clamp-2"
                      style={{ fontFamily: "'Overpass', sans-serif" }}
                    >
                      {post.title}
                    </h3>
                    <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(post.publish_date || post.created_date), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ===== COLUNA 2: Folha em Destaque (Centro) ===== */}
          <div className="col-destaque order-1 lg:order-2">
            {/* Header */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Overpass', sans-serif" }}>
                Folha em Destaque
              </h2>
              <div className="w-14 h-1 bg-[#37474F] mt-2 rounded-full" />
            </div>

            {/* Hero Card */}
            {heroDestaque && (
              <Link
                to={`${createPageUrl("Noticia")}?slug=${heroDestaque.slug}`}
                className="block relative rounded-xl overflow-hidden mb-5 group"
                style={{ aspectRatio: '16/9' }}
              >
                <img
                  src={heroDestaque.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800"}
                  alt={heroDestaque.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span 
                    className="inline-block px-2.5 py-1 text-[11px] font-bold text-white rounded mb-2 uppercase"
                    style={{ backgroundColor: '#37474F' }}
                  >
                    {categoryLabels[heroDestaque.category] || heroDestaque.category}
                  </span>
                  <h3 
                    className="text-white text-lg font-bold leading-snug line-clamp-3"
                    style={{ fontFamily: "'Overpass', sans-serif", textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                  >
                    {heroDestaque.title}
                  </h3>
                </div>
              </Link>
            )}

            {/* Mini List */}
            <div className="space-y-3">
              {miniDestaque.map((post, index) => (
                <Link
                  key={post.id}
                  to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                  className={`flex items-center gap-3 group py-2.5 ${index < miniDestaque.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Small Thumbnail */}
                  <div className="flex-shrink-0 w-[50px] h-[50px] rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=100"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-[13px] font-semibold text-[#1A1A1A] leading-[1.4] line-clamp-2 group-hover:text-[#37474F] transition-colors"
                      style={{ fontFamily: "'Overpass', sans-serif" }}
                    >
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      {format(new Date(post.publish_date || post.created_date), "dd/MM", { locale: ptBR })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ===== COLUNA 3: Sidebar (Direita) ===== */}
          <div className="col-sidebar order-3 hidden lg:block">
            <div className="sticky top-4">
              {/* Weather Widget */}
              <WeatherWidget />

              {/* Leia Também */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: "'Overpass', sans-serif" }}>
                  Leia Também
                </h3>
                
                {/* Timeline */}
                <div className="relative pl-5">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

                  <div className="space-y-4">
                    {leiaTambem.map((post) => (
                      <Link
                        key={post.id}
                        to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                        className="block group relative"
                      >
                        <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-[#D71E1F] ring-2 ring-white" />
                        
                        <span className="text-[11px] font-bold text-[#D71E1F]">
                          {formatDistanceToNow(new Date(post.publish_date || post.created_date), { addSuffix: true, locale: ptBR })}
                        </span>
                        
                        <h4 
                          className="text-[13px] font-semibold text-[#1A1A1A] mt-1 group-hover:text-[#D71E1F] transition-colors line-clamp-2"
                          style={{ fontFamily: "'Overpass', sans-serif", lineHeight: "1.4" }}
                        >
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

        {/* Responsive CSS */}
        <style>{`
          .main-news-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            align-items: start;
          }
          
          /* Tablet */
          @media (min-width: 768px) {
            .main-news-grid {
              grid-template-columns: 1fr 320px;
            }
            .col-destaque {
              grid-column: 1;
            }
            .col-ultimas {
              grid-column: 1;
            }
            .col-sidebar {
              grid-column: 2;
              grid-row: 1 / 3;
            }
          }
          
          /* Desktop */
          @media (min-width: 1200px) {
            .main-news-grid {
              grid-template-columns: 1fr 1fr 320px;
              gap: 30px;
            }
            .col-ultimas {
              grid-column: 1;
              grid-row: 1;
            }
            .col-destaque {
              grid-column: 2;
              grid-row: 1;
            }
            .col-sidebar {
              grid-column: 3;
              grid-row: 1;
            }
          }
        `}</style>
      </div>
    </section>
  );
}