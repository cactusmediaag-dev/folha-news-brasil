import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Building2, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryConfig = {
  cidades: {
    label: "Cidades",
    gradient: "linear-gradient(90deg, #005C97 0%, #363795 100%)",
    icon: Building2,
    filter: "local",
  },
  politica: {
    label: "Política",
    gradient: "linear-gradient(90deg, #D71E1F 0%, #8B0000 100%)",
    icon: Building2,
    filter: "politica",
  },
  esportes: {
    label: "Esportes",
    gradient: "linear-gradient(90deg, #16a34a 0%, #15803d 100%)",
    icon: Building2,
    filter: "esportes",
  },
  economia: {
    label: "Economia",
    gradient: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
    icon: Building2,
    filter: "economia",
  },
};

export default function CategorySection({ category = "cidades", posts = [] }) {
  const config = categoryConfig[category] || categoryConfig.cidades;
  const Icon = config.icon;
  
  // Filter posts by category
  const categoryPosts = posts
    .filter(p => p.category === config.filter)
    .slice(0, 4);

  if (categoryPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Category Header Bar */}
        <div
          className="rounded-xl px-6 py-4 mb-6 flex items-center justify-between"
          style={{ background: config.gradient }}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-white" />
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              {config.label}
            </h2>
          </div>
          <Link
            to={`${createPageUrl("Home")}#${category}`}
            className="flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium transition-colors"
          >
            Ver tudo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryPosts.map((post) => (
            <Link
              key={post.id}
              to={`${createPageUrl("Noticia")}?slug=${post.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.featured_image || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-[#1A1A1A] leading-tight line-clamp-2 group-hover:text-[#D71E1F] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  {format(new Date(post.publish_date || post.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}