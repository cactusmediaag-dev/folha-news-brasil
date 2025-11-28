import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Instagram, Facebook, Youtube, Twitter, ArrowUp } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/folhanewsbrasil", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/folhanewsbrasil", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/folhanewsbrasil", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com/folhanewsbrasil", label: "X (Twitter)" },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Web Stories", href: "/#webstories" },
  { name: "Política", href: "/Categoria?slug=politica" },
  { name: "Economia", href: "/Categoria?slug=economia" },
  { name: "Esportes", href: "/Categoria?slug=esportes" },
  { name: "Cidades", href: "/Categoria?slug=cidade" },
  { name: "Tecnologia", href: "/Categoria?slug=tecnologia" },
  { name: "Mundo", href: "/Categoria?slug=mundo" },
  { name: "Entretenimento", href: "/Categoria?slug=entretenimento" },
];

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer 
        className="w-full"
        style={{ 
          backgroundColor: '#D71E1F',
          paddingTop: '40px',
          paddingBottom: '30px'
        }}
      >
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* Logo - White Version */}
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6925f248881ba46b069e0c80/8b8dd9df9_f_news_brasil_logo_002.png"
            alt="Folha News Brasil"
            className="h-10 sm:h-12 w-auto max-w-[140px] sm:max-w-none object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />

          {/* Social Icons */}
          <div className="flex items-center gap-5 sm:gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-white hover:scale-110 transition-transform duration-200"
              >
                <social.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              </a>
            ))}
          </div>

          {/* Navigation Links - Hidden on Mobile */}
          <nav className="hidden sm:flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 max-w-4xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/90 hover:text-white transition-colors"
                style={{
                  fontFamily: "'Overpass', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Legal Links */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="/Privacidade"
              className="text-white/70 hover:text-white hover:underline transition-all"
              style={{
                fontFamily: "'Overpass', sans-serif",
                fontSize: '13px',
              }}
            >
              Política de Privacidade
            </a>
            <span className="text-white/40">•</span>
            <a
              href="/Privacidade"
              className="text-white/70 hover:text-white hover:underline transition-all"
              style={{
                fontFamily: "'Overpass', sans-serif",
                fontSize: '13px',
              }}
            >
              Termos de Uso
            </a>
          </div>

          {/* Copyright */}
          <p 
            className="text-white/60 mt-4 px-5 text-center"
            style={{
              fontFamily: "'Overpass', sans-serif",
              fontSize: '11px',
              lineHeight: '1.5'
            }}
          >
            © 2025 Folha News Brasil — Todos os direitos reservados
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Voltar ao topo"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        <ArrowUp className="w-5 h-5 text-[#D71E1F]" strokeWidth={2.5} />
      </button>
    </>
  );
}