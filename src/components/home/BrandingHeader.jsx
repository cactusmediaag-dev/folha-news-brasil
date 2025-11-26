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
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
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
  { name: "Entretenimento", href: "#entretenimento" }]

},
{ name: "Cidades", href: "#cidades" },
{ name: "Policial", href: "#policial" },
{ name: "Política", href: "#politica" },
{ name: "Ciência", href: "#ciencia" },
{ name: "Mundo", href: "#mundo" },
{ name: "Capital", href: "#capital" }];


export default function BrandingHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#DADADA]">
      {/* Main Header - 3 Column Grid Layout */}
      <div className="bg-zinc-50 mx-auto px-4 max-w-7xl" style={{ paddingTop: '35px', paddingBottom: '35px' }}>
        <div className="grid grid-cols-3 items-center">
          {/* Column 1 - Left (Mobile Menu / Empty on Desktop) */}
          <div className="flex items-center">
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
                  {navItems.map((item, index) =>
                  <div key={`${item.name}-${index}`}>
                      {item.dropdown ?
                    <div className="py-3 border-b border-gray-100">
                          <span className="font-medium text-[#1A1A1A]">{item.name}</span>
                          <div className="mt-2 ml-4 space-y-2">
                            {item.items.map((subItem) =>
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block text-sm text-[#333333] hover:text-[#D71E1F] transition-colors font-light"
                          onClick={() => setIsMobileMenuOpen(false)}>

                                {subItem.name}
                              </a>
                        )}
                          </div>
                        </div> :

                    <a
                      href={item.href}
                      className="block py-3 border-b border-gray-100 font-medium text-[#1A1A1A] hover:text-[#D71E1F] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}>

                          {item.name}
                        </a>
                    }
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Column 2 - Center (Logo) */}
          <div className="flex justify-center">
            <a href="/" className="flex flex-col items-center gap-2">
              <div className="bg-[#D71E1F] p-3 rounded-xl">
                <Newspaper className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                  Folha News Brasil
                </h1>
                <p className="text-xs sm:text-sm text-[#333333] font-light">Seu portal de notícias</p>
              </div>
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
            {navItems.map((item, index) =>
            <li key={`${item.name}-${index}`}>
                {item.dropdown ?
              <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-4 text-sm font-light text-[#333333] hover:text-[#D71E1F] transition-colors nav-link-underline">
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      {item.items.map((subItem) =>
                  <DropdownMenuItem key={subItem.name} asChild>
                          <a
                      href={subItem.href}
                      className="cursor-pointer hover:text-[#D71E1F] font-light">

                            {subItem.name}
                          </a>
                        </DropdownMenuItem>
                  )}
                    </DropdownMenuContent>
                  </DropdownMenu> :

              <a
                href={item.href}
                className="block px-2 py-4 text-sm font-light text-[#333333] hover:text-[#D71E1F] transition-colors nav-link-underline">

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