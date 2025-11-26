import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Search, Clock, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES_LIST } from "@/components/shared/CategoryColors";

export default function ExploreMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group transition-colors"
        aria-expanded={isOpen}
        aria-label="Menu Explorar"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#D71E1F] transition-transform duration-300" />
        ) : (
          <Menu className="w-5 h-5 text-[#333] group-hover:text-[#D71E1F] transition-colors" />
        )}
        <span 
          className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
            isOpen ? "text-[#D71E1F]" : "text-[#333] group-hover:text-[#D71E1F]"
          }`}
          style={{ fontSize: '14px' }}
        >
          Explorar
        </span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:top-[140px]"
          onClick={() => setIsOpen(false)}
          style={{ top: '140px' }}
        />
      )}

      {/* Mega Menu Container */}
      <div
        className={`fixed left-0 right-0 bg-white z-50 shadow-xl transition-all duration-300 ease-out ${
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ 
          top: '140px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Desktop Grid - 4 Columns */}
          <div className="hidden lg:grid grid-cols-4 gap-8">
            {/* Column 1-3: Categories */}
            <div className="col-span-3">
              <h3 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-4">
                Todas as Editorias
              </h3>
              <div className="grid grid-cols-3 gap-x-8 gap-y-1">
                {CATEGORIES_LIST.map((cat) => (
                  <a
                    key={cat.value}
                    href={`/Categoria?slug=${cat.value}`}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-[#333] font-semibold hover:text-[#D71E1F] transition-all duration-200 hover:translate-x-1"
                    style={{ fontSize: '15px' }}
                  >
                    {cat.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 4: Quick Links & Search */}
            <div className="border-l border-gray-100 pl-8">
              <h3 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-4">
                Acesso Rápido
              </h3>
              
              {/* Search */}
              <div className="relative mb-6">
                <Input
                  type="search"
                  placeholder="Buscar notícias..."
                  className="w-full pr-10 bg-gray-50 border-gray-200 focus:border-[#D71E1F] focus:ring-[#D71E1F]"
                />
                <Button
                  size="icon"
                  className="absolute right-0 top-0 bg-[#D71E1F] hover:bg-[#b91c1c] rounded-l-none h-full"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Links */}
              <div className="space-y-1">
                <a
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 text-[#333] font-semibold hover:text-[#D71E1F] transition-all duration-200 hover:translate-x-1"
                >
                  <Clock className="w-4 h-4" />
                  <span>Últimas Notícias</span>
                </a>
                <a
                  href="/#webstories"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 text-[#333] font-semibold hover:text-[#D71E1F] transition-all duration-200 hover:translate-x-1"
                >
                  <Play className="w-4 h-4" />
                  <span>Web Stories</span>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile: Full list */}
          <div className="lg:hidden">
            <h3 className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-4">
              Editorias
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-6">
              {CATEGORIES_LIST.map((cat) => (
                <a
                  key={cat.value}
                  href={`/Categoria?slug=${cat.value}`}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-[#333] font-semibold hover:text-[#D71E1F] transition-colors"
                >
                  {cat.label}
                </a>
              ))}
            </div>
            
            {/* Mobile Search */}
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar notícias..."
                className="w-full pr-10 bg-gray-50 border-gray-200"
              />
              <Button
                size="icon"
                className="absolute right-0 top-0 bg-[#D71E1F] hover:bg-[#b91c1c] rounded-l-none h-full"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}