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
  curiosidades: "Curiosidades",
};

const categoryColors = {
  politica: "#D71E1F",
  economia: "#2563eb",
  esportes: "#16a34a",
  entretenimento: "#9333ea",
  tecnologia: "#0891b2",
  saude: "#dc2626",
  educacao: "#ca8a04",
  mundo: "#4f46e5",
  brasil: "#15803d",
  local: "#ea580c",
  cidade: "#546E7A",
  curiosidades: "#f59e0b",
};

export default function LatestNewsSection({ posts = [] }) {
  // Lógica de dados para evitar repetição
  // Exclui os 3 primeiros (usados no Hero)
  const availablePosts = posts.slice(3);
  
  // Coluna 1: Últimas Notícias (5 itens)
  const ultimasNoticias = availablePosts.slice(0, 5);
  
  // Coluna 2: Folha em Destaque (1 hero + 3 mini) - prioriza mix de categorias
  const folhaDestaque = availablePosts.slice(5, 10);
  const destaqueHero = folhaDestaque[0];
  const destaqueMini = folhaDestaque.slice(1, 4);
  
  // Coluna 3: Leia Também (4 itens)
  const leiaTambem = availablePosts.slice(10, 14);

  if (ultimasNoticias.length === 0) {
    return null;
  }

  return (
    <section className="py-10" style={{ backgroundColor: 'transparent' }}>
      <div className="site-container">
        {/* Grid de 3 Colunas */}
        <div className="main-news-grid">
          
          {/* Coluna 2: Folha em Destaque (aparece primeiro no mobile) */}
          <div className="folha-destaque-col order-1 lg:order-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#37474F] rounded-full" />
              <h2 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-wide">
                Folha em Destaque
              </h2>
            </div>

            {/* Card Hero */}
            {destaqueHero && (
              <Link
                to={`${createPageUrl("Noticia")}?slug=${destaqueHero.slug}`}
                className="block relative rounded-xl overflow-hidden mb-5 group"
                style={{ aspectRatio: '16/9' }}
              >
                <img
                  src={destaqueHero.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800"}
                  alt={destaqueHero.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span 
                    className="inline-block px-3 py-1 text-xs font-bold text-white rounded mb-3 uppercase"
                    style={{ backgroundColor: categoryColors[destaqueHero.category] || '#D71E1F' }}
                  >
                    {categoryLabels[destaqueHero.category] || destaqueHero.category}
                  </span>
                  <h3 
                    className="text-white font-bold leading-tight line-clamp-3 group-hover:underline"
                    style={{ fontSize: '18px', fontFamily: "'Overpass', sans-serif" }}
                  >
                    {destaqueHero.title}
                  </h3>
                </div>
              </Link>
            )}

            {/* Mini Lista */}
            <div className="space-y-0 bg-white rounded-xl shadow-sm overflow-hidden">
              {destaqueMini.map((post, index) => (
                <Link
                  key={post.id}
                  to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                  className={`flex items-center gap-3 px-4 py-3.5 group hover:bg-gray-50 transition-colors ${
                    index < destaqueMini.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  {/* Mini Thumbnail */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=100"}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#D71E1F] transition-colors"
                      style={{ fontFamily: "'Overpass', sans-serif" }}
                    >
                      {post.title}
                    </h4>
                    <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(post.publish_date || post.created_date), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Coluna 1: Últimas Notícias (aparece segundo no mobile) */}
          <div className="ultimas-noticias-col order-2 lg:order-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#D71E1F] rounded-full" />
              <h2 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-wide">
                Últimas Notícias
              </h2>
            </div>

            {/* Lista Compacta */}
            <div className="space-y-0 bg-white rounded-xl shadow-sm overflow-hidden">
              {ultimasNoticias.map((post, index) => (
                <Link
                  key={post.id}
                  to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
                  className={`flex gap-4 p-4 group hover:bg-gray-50 transition-colors ${
                    index < ultimasNoticias.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-[100px] h-[75px] rounded-lg overflow-hidden">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=300&fit=crop"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span 
                      className="text-[10px] font-semibold uppercase"
                      style={{ color: categoryColors[post.category] || '#D71E1F' }}
                    >
                      {categoryLabels[post.category] || post.category}
                    </span>
                    <h3 
                      className="text-[15px] font-bold text-[#1A1A1A] leading-[1.3] mt-1 group-hover:text-[#D71E1F] transition-colors line-clamp-2"
                      style={{ fontFamily: "'Overpass', sans-serif", letterSpacing: "-0.3px" }}
                    >
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500">
                      <Clock className="w-3 h-3" />
                      {format(new Date(post.publish_date || post.created_date), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Coluna 3: Sidebar (Weather + Leia Também) */}
          <div className="sidebar-col order-3">
            <div className="lg:sticky lg:top-4">
              {/* Weather Widget */}
              <WeatherWidget />

              {/* Leia Também */}
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-5 bg-gray-400 rounded-full" />
                  <h3 className="text-lg font-bold text-[#1A1A1A]">Leia Também</h3>
                </div>
                
                {/* Timeline Container */}
                <div className="relative pl-6">
                  {/* Vertical Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

                  {/* Timeline Items */}
                  <div className="space-y-5">
                    {leiaTambem.map((post) => (
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
                        <h4 
                          className="text-sm font-semibold text-[#1A1A1A] mt-1 group-hover:text-[#D71E1F] transition-colors line-clamp-2"
                          style={{ fontFamily: "'Overpass', sans-serif", lineHeight: "1.4", letterSpacing: "-0.3px" }}
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

        {/* CSS do Grid Responsivo */}
        <style>{`
          .main-news-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            align-items: start;
          }
          
          /* Tablet (768px - 1200px) */
          @media (min-width: 768px) and (max-width: 1199px) {
            .main-news-grid {
              grid-template-columns: 1fr 320px;
            }
            .folha-destaque-col {
              grid-column: 1;
              order: 1 !important;
            }
            .ultimas-noticias-col {
              grid-column: 1;
              order: 2 !important;
            }
            .sidebar-col {
              grid-column: 2;
              grid-row: 1 / 3;
              order: 3 !important;
            }
          }
          
          /* Desktop (> 1200px) */
          @media (min-width: 1200px) {
            .main-news-grid {
              grid-template-columns: 1fr 1fr 320px;
            }
            .ultimas-noticias-col {
              order: 1 !important;
            }
            .folha-destaque-col {
              order: 2 !important;
            }
            .sidebar-col {
              order: 3 !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}