import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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

const categoryColors = {
  politica: "#D71E1F",
  brasil: "#D71E1F",
  economia: "#2E8B57",
  tecnologia: "#1E90FF",
  mundo: "#8A2BE2",
  esportes: "#FF6B00",
  entretenimento: "#E91E63",
  saude: "#00BCD4",
  educacao: "#4CAF50",
  local: "#795548",
};

export default function ArticleBreadcrumb({ category }) {
  const categoryLabel = categoryLabels[category] || category || "Notícias";
  const categoryColor = categoryColors[category] || "#333333";

  return (
    <>
      {/* Category Banner - Full Width */}
      <div 
        className="w-full"
        style={{ backgroundColor: categoryColor }}
      >
        <div className="max-w-7xl mx-auto px-4 h-[50px] flex items-center justify-center">
          <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-widest">
            {categoryLabel}
          </h2>
        </div>
      </div>

      {/* Breadcrumb Trail */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link 
              to={createPageUrl("Home")} 
              className="hover:text-[#D71E1F] transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span style={{ color: categoryColor }} className="font-medium">
              {categoryLabel}
            </span>
          </nav>
        </div>
      </div>
    </>
  );
}