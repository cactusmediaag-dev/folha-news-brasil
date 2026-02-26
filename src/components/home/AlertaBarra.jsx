import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Radio, AlertTriangle, Zap, X, ChevronRight } from "lucide-react";

const typeConfig = {
  alerta: {
    label: "ALERTA",
    Icon: AlertTriangle,
    pulse: false,
    bgClass: "bg-[#D71E1F]",
    badgeBg: "bg-[#b91c1c]",
  },
  ao_vivo: {
    label: "AO VIVO",
    Icon: Radio,
    pulse: true,
    bgClass: "bg-[#D71E1F]",
    badgeBg: "bg-[#7f1d1d]",
  },
  urgente: {
    label: "URGENTE",
    Icon: Zap,
    pulse: false,
    bgClass: "bg-[#D71E1F]",
    badgeBg: "bg-[#991b1b]",
  },
};

export default function AlertaBarra() {
  const [dismissed, setDismissed] = useState(false);

  const { data: alertas = [] } = useQuery({
    queryKey: ["alertas-ativos"],
    queryFn: () => base44.entities.Alerta.filter({ is_active: true }, "-created_date", 1),
    refetchInterval: 60000, // re-fetch a cada minuto
  });

  // Filtra alertas não expirados
  const agora = new Date();
  const alerta = alertas.find((a) => {
    if (!a.expires_at) return true;
    return new Date(a.expires_at) > agora;
  });

  if (!alerta || dismissed) return null;

  const config = typeConfig[alerta.type] || typeConfig.alerta;
  const { Icon, label, pulse, bgClass, badgeBg } = config;

  const handleClick = () => {
    if (alerta.post_url) {
      window.location.href = alerta.post_url;
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#F9FAFB' }}>
      <div className={`${bgClass} max-w-7xl mx-auto py-2.5 px-4 flex items-center gap-3`} style={{ boxShadow: "0 2px 8px rgba(215,30,31,0.35)" }}>
        {/* Badge de tipo */}
        <span
          className={`${badgeBg} text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded flex items-center gap-1.5 flex-shrink-0`}
        >
          <span className={pulse ? "relative flex items-center" : ""}>
            {pulse && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75 animate-ping" />
            )}
            <Icon className="w-3.5 h-3.5 relative" />
          </span>
          {label}
        </span>

        {/* Separador */}
        <span className="text-white/40 font-thin text-lg select-none hidden sm:block">|</span>

        {/* Título clicável */}
        <button
          onClick={handleClick}
          className={`flex-1 text-white text-sm font-semibold text-left leading-snug truncate hover:underline ${
            alerta.post_url ? "cursor-pointer" : "cursor-default"
          }`}
        >
          {alerta.title}
        </button>

        {/* "Leia mais" arrow */}
        {alerta.post_url && (
          <button
            onClick={handleClick}
            className="flex-shrink-0 text-white/80 hover:text-white flex items-center gap-1 text-xs font-bold uppercase tracking-wide"
          >
            Leia mais <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Fechar */}
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-white/60 hover:text-white ml-2 transition-colors"
          aria-label="Fechar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}