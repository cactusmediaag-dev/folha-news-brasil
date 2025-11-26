import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
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

export default function NewsFeed({ posts = [] }) {
  const feedPosts = posts.slice(3); // Skip first 3 used in hero

  if (feedPosts.length === 0) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedPosts.map((post, index) => (
        <React.Fragment key={post.id}>
          <Link
            to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
            className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              {/* Image */}
              <div className="w-full sm:w-40 h-48 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={post.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <Badge 
                  variant="secondary" 
                  className="bg-[#D71E1F]/10 text-[#D71E1F] hover:bg-[#D71E1F]/20 mb-2"
                >
                  {categoryLabels[post.category] || post.category}
                </Badge>
                <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#D71E1F] transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                {post.subtitle && (
                  <p className="text-sm text-[#333333] line-clamp-2 mb-3">
                    {post.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(post.created_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                  </span>
                  {post.views_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views_count.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Ad Banner after 2nd post */}
          {index === 1 && (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-8 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Publicidade</p>
              <div className="h-24 bg-white/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-gray-400 text-sm">Espaço para Banner 728x90</span>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}