import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Menu, X, ChevronDown, Newspaper, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ExploreMenu from "./ExploreMenu";

const navItems = [
{ name: "Home", href: "/" },
{ name: "Web Stories", href: "#webstories" },
{
  name: "Editorias",
  dropdown: true,
  items: [
  { name: "Política", href: "/Categoria?slug=politica" },
  { name: "Economia", href: "/Categoria?slug=economia" },
  { name: "Esportes", href: "/Categoria?slug=esportes" },
  { name: "Tecnologia", href: "/Categoria?slug=tecnologia" },
  { name: "Entretenimento", href: "/Categoria?slug=entretenimento" },
  { name: "Saúde", href: "/Categoria?slug=saude" },
  { name: "Educação", href: "/Categoria?slug=educacao" }]
},
{ name: "Cidades", href: "/Categoria?slug=cidade" },
{ name: "Turismo", href: "/Categoria?slug=turismo" },
{ name: "Ciência", href: "/Categoria?slug=ciencia" },
{ name: "Mundo", href: "/Categoria?slug=mundo" }];


export default function BrandingHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-slate-50">
      {/* Main Header - 3 Column Grid Layout */}
      <div className="bg-zinc-50 mx-auto px-4 max-w-7xl" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="grid grid-cols-3 items-center">
          {/* Column 1 - Left (Explore Menu) */}
          <div className="flex items-center">
            <ExploreMenu />
          </div>

          {/* Column 2 - Center (Logo) */}
          <div className="flex justify-center">
            <a href="/">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6925f248881ba46b069e0c80/8b8dd9df9_f_news_brasil_logo_002.png" 
                alt="Folha News Brasil" 
                className="h-10 sm:h-16 md:h-20 w-auto max-w-[150px] sm:max-w-[200px] md:max-w-none object-contain"
              />
            </a>
          </div>

          {/* Column 3 - Right (Search) */}
          <div className="flex items-center justify-end">
            <div className={`${isSearchOpen ? 'flex' : 'hidden'} sm:flex items-center`}>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar notícias..."
                  className="w-40 md:w-56 pr-10 bg-white border-gray-300 focus:border-[#D71E1F] focus:ring-[#D71E1F]" />

                <Button
                  size="icon"
                  className="absolute right-0 top-0 bg-[#D71E1F] hover:bg-[#b91c1c] rounded-l-none">

                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}>

              {isSearchOpen ?
              <X className="w-5 h-5 text-[#1A1A1A]" /> :

              <Search className="w-5 h-5 text-[#1A1A1A]" />
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="hidden lg:flex items-center justify-center" style={{ gap: '25px' }}>
            {/* Guia Folha CTA Button */}
            <li>
              <a 
                href="https://guia.folhanewsbrasil.com.br/" 
                target="_blank"
                rel="noopener noreferrer"
                className="special-cta-button"
                title="Acesse o Guia Folha"
              >
                <svg className="cta-icon-pulse" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="cta-text">GUIA FOLHA</span>
              </a>
            </li>
            
            {navItems.map((item, index) =>
            <li key={`${item.name}-${index}`}>
                {item.dropdown ?
              <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-4 text-[15px] font-semibold text-[#1A1A1A] hover:text-[#D71E1F] transition-colors nav-link-underline capitalize">
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      {item.items.map((subItem) =>
                  <DropdownMenuItem key={subItem.name} asChild>
                          <a
                      href={subItem.href}
                      className="cursor-pointer hover:text-[#D71E1F] font-semibold">

                            {subItem.name}
                          </a>
                        </DropdownMenuItem>
                  )}
                    </DropdownMenuContent>
                  </DropdownMenu> :

              <a
                href={item.href}
                className="block px-2 py-4 text-[15px] font-semibold text-[#1A1A1A] hover:text-[#D71E1F] transition-colors nav-link-underline capitalize">

                    {item.name}
                  </a>
              }
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>);

}