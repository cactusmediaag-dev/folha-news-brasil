import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cloud, Rss, Youtube, Twitter, Instagram, Phone, Facebook } from "lucide-react";

export default function TopBar() {
  const [city, setCity] = useState("Cuiabá");
  
  const today = new Date();
  const formattedDate = format(today, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  // Capitalize first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  useEffect(() => {
    // Tenta detectar cidade pelo IP
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city) {
          setCity(data.city);
          console.log("Cidade detectada via IP:", data.city);
        }
      })
      .catch(err => {
        console.warn("Erro ao detectar cidade via IP, mantendo fallback:", err);
        // Mantém Cuiabá como fallback
      });
  }, []);

  return (
    <div className="bg-[#D71E1F] text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Date */}
        <div className="text-sm font-light hidden sm:block">
          {capitalizedDate}
        </div>

        {/* Weather Widget */}
        <div className="flex items-center gap-2 text-sm">
          <Cloud className="w-4 h-4" />
          <span>{city}</span>
          <span className="font-semibold">22ºC</span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="RSS">
            <Rss className="w-4 h-4" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
            <Youtube className="w-4 h-4" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Twitter">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="WhatsApp">
            <Phone className="w-4 h-4" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
            <Facebook className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}