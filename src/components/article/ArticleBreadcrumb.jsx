import React from "react";
import { ChevronRight, Home } from "lucide-react";

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

export default function ArticleBreadcrumb({ category }) {
  const categoryLabel = categoryLabels[category] || category || "Notícias";

  return (
    <div className="bg-[#1A1A1A]">
      {/* Breadcrumb Trail */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center gap-2 text-sm text-white/70">
          <a href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>Início</span>
          </a>
          <ChevronRight className="w-4 h-4" />
          <a href={`/#${category}`} className="hover:text-white transition-colors">
            {categoryLabel}
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white/50">Notícias</span>
        </nav>
      </div>

      {/* Category Banner */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
            {categoryLabel}
          </h2>
        </div>
      </div>
    </div>
  );
}