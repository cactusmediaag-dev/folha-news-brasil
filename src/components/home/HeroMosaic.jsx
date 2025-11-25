import React from "react";
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

export default function HeroMosaic({ posts = [] }) {
  const mainPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);

  if (!mainPost) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px]">
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Carregando notícias...</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex-1 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
              <div className="flex-1 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main News */}
          <a 
            href={`/noticia/${mainPost.slug}`}
            className="lg:col-span-2 relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden group news-card-hover"
          >
            <img
              src={mainPost.featured_image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop"}
              alt={mainPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            <div className="absolute inset-0 gradient-overlay" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <Badge className="w-fit bg-[#D71E1F] hover:bg-[#b91c1c] text-white mb-3">
                {categoryLabels[mainPost.category] || mainPost.category}
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 line-clamp-3">
                {mainPost.title}
              </h1>
              {mainPost.subtitle && (
                <p className="text-white/90 text-sm sm:text-base line-clamp-2 mb-3">
                  {mainPost.subtitle}
                </p>
              )}
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {format(new Date(mainPost.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
                {mainPost.author_name && (
                  <span>Por {mainPost.author_name}</span>
                )}
              </div>
            </div>
          </a>

          {/* Secondary News */}
          <div className="flex flex-col gap-4">
            {secondaryPosts.length > 0 ? (
              secondaryPosts.map((post) => (
                <a
                  key={post.id}
                  href={`/noticia/${post.slug}`}
                  className="relative flex-1 min-h-[200px] lg:min-h-0 rounded-xl overflow-hidden group news-card-hover"
                >
                  <img
                    src={post.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute inset-0 gradient-overlay" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <Badge className="w-fit bg-[#D71E1F] hover:bg-[#b91c1c] text-white mb-2 text-xs">
                      {categoryLabels[post.category] || post.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </a>
              ))
            ) : (
              <>
                <div className="flex-1 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl min-h-[200px]"></div>
                <div className="flex-1 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl min-h-[200px]"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}