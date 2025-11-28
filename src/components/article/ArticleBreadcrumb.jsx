import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight, Home } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_GRADIENTS } from "@/components/shared/CategoryColors";

export default function ArticleBreadcrumb({ category }) {
  const categoryLabel = CATEGORY_LABELS[category] || category || "Notícias";
  const categoryGradient = CATEGORY_GRADIENTS[category] || "linear-gradient(135deg, #374151 0%, #1f2937 100%)";

  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-8">
      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link 
          to={createPageUrl("Home")} 
          className="hover:text-[#D71E1F] transition-colors flex items-center gap-1"
        >
          <Home className="w-4 h-4" />
          <span>Início</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <Link 
          to={`/Categoria?slug=${category}`}
          className="font-medium hover:text-[#D71E1F] transition-colors"
        >
          {categoryLabel}
        </Link>
      </nav>

      {/* Category Header Box - Boxed Layout */}
      <div 
        className="w-full rounded-xl py-8 px-8 sm:px-10"
        style={{ background: categoryGradient }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
          {categoryLabel}
        </h2>
      </div>
    </div>
  );
}