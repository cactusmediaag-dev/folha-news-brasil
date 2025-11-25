import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Menu, X, ChevronDown, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Web Stories", href: "#webstories" },
  { 
    name: "Editorias", 
    dropdown: true,
    items: [
      { name: "Política", href: "#politica" },
      { name: "Economia", href: "#economia" },
      { name: "Esportes", href: "#esportes" },
      { name: "Tecnologia", href: "#tecnologia" },
      { name: "Mundo", href: "#mundo" },
      { name: "Entretenimento", href: "#entretenimento" },
    ]
  },
  { name: "Vídeos", href: "#videos" },
  { name: "Edições Digitais", href: "#edicoes" },
  { name: "Contato", href: "#contato" },
];

export default function BrandingHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#DADADA]">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6 text-[#1A1A1A]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-white">
              <div className="p-6 bg-[#D71E1F]">
                <div className="flex items-center gap-2 text-white">
                  <Newspaper className="w-8 h-8" />
                  <span className="text-xl font-bold">Folha News Brasil</span>
                </div>
              </div>
              <nav className="p-4">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="py-3 border-b border-gray-100">
                        <span className="font-semibold text-[#1A1A1A]">{item.name}</span>
                        <div className="mt-2 ml-4 space-y-2">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="block text-sm text-[#333333] hover:text-[#D71E1F] transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className="block py-3 border-b border-gray-100 font-semibold text-[#1A1A1A] hover:text-[#D71E1F] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <a href="/" className="flex items-center gap-3">
              <div className="bg-[#D71E1F] p-2 rounded-lg">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                  Folha News Brasil
                </h1>
                <p className="text-xs text-[#333333] -mt-1">Seu portal de notícias</p>
              </div>
            </a>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className={`${isSearchOpen ? 'flex' : 'hidden'} sm:flex items-center`}>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar notícias..."
                  className="w-48 md:w-64 pr-10 bg-white border-gray-300 focus:border-[#D71E1F] focus:ring-[#D71E1F]"
                />
                <Button
                  size="icon"
                  className="absolute right-0 top-0 bg-[#D71E1F] hover:bg-[#b91c1c] rounded-l-none"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="w-5 h-5 text-[#1A1A1A]" />
              ) : (
                <Search className="w-5 h-5 text-[#1A1A1A]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="hidden lg:flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-4 text-sm font-semibold text-[#333333] hover:text-[#D71E1F] transition-colors nav-link-underline">
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      {item.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <a
                            href={subItem.href}
                            className="cursor-pointer hover:text-[#D71E1F]"
                          >
                            {subItem.name}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <a
                    href={item.href}
                    className="block px-4 py-4 text-sm font-semibold text-[#333333] hover:text-[#D71E1F] transition-colors nav-link-underline"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}