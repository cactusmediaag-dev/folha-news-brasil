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

export default function RelatedPosts({ posts = [], currentPostId }) {
  const relatedPosts = posts
    .filter(p => p.id !== currentPostId)
    .slice(0, 4);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Leia Também</h2>
          <div className="w-16 h-1 bg-[#D71E1F] mt-3 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedPosts.map((post) => (
            <a
              key={post.id}
              href={`/Noticia?slug=${post.slug}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <Badge 
                  variant="secondary" 
                  className="bg-[#D71E1F]/10 text-[#D71E1F] hover:bg-[#D71E1F]/20 mb-2 text-xs"
                >
                  {categoryLabels[post.category] || post.category}
                </Badge>
                <h3 className="font-bold text-[#1A1A1A] group-hover:text-[#D71E1F] transition-colors line-clamp-2 text-sm leading-snug">
                  {post.title}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {format(new Date(post.created_date), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}