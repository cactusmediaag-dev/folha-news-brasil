import React from "react";
import { Newspaper, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  institucional: [
    { name: "Sobre Nós", href: "#" },
    { name: "Expediente", href: "#" },
    { name: "Trabalhe Conosco", href: "#" },
    { name: "Política de Privacidade", href: "#" },
    { name: "Termos de Uso", href: "#" },
  ],
  editorias: [
    { name: "Política", href: "#" },
    { name: "Economia", href: "#" },
    { name: "Esportes", href: "#" },
    { name: "Tecnologia", href: "#" },
    { name: "Mundo", href: "#" },
  ],
  servicos: [
    { name: "Anuncie", href: "#" },
    { name: "Assinaturas", href: "#" },
    { name: "Edições Digitais", href: "#" },
    { name: "RSS", href: "#" },
    { name: "Aplicativos", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#D71E1F] p-2 rounded-lg">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Folha News Brasil</h3>
                <p className="text-xs text-gray-400">Seu portal de notícias</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              O portal de notícias mais completo do Brasil. Informação de qualidade, 24 horas por dia.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contato@folhanewsbrasil.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(11) 3000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D71E1F] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D71E1F] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D71E1F] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D71E1F] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold mb-4 text-white">Institucional</h4>
            <ul className="space-y-2">
              {footerLinks.institucional.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-[#D71E1F] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Editorias</h4>
            <ul className="space-y-2">
              {footerLinks.editorias.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-[#D71E1F] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Serviços</h4>
            <ul className="space-y-2">
              {footerLinks.servicos.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-[#D71E1F] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2025 Folha News Brasil. Todos os direitos reservados.</p>
            <p>Desenvolvido com ❤️ para o jornalismo brasileiro</p>
          </div>
        </div>
      </div>
    </footer>
  );
}