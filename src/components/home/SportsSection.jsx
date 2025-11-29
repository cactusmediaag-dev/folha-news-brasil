import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for Brasileirão
const soccerData = [
  { pos: 1, team: 'FLA', points: 75, form: ['w', 'w', 'l', 'w', 'd'], logo: 'https://e.imguol.com/futebol/brasoes/40x40/flamengo.png' },
  { pos: 2, team: 'PAL', points: 70, form: ['w', 'w', 'w', 'l', 'd'], logo: 'https://e.imguol.com/futebol/brasoes/40x40/palmeiras.png' },
  { pos: 3, team: 'BOT', points: 68, form: ['w', 'd', 'd', 'w', 'w'], logo: 'https://e.imguol.com/futebol/brasoes/40x40/botafogo.png' },
  { pos: 4, team: 'CAM', points: 63, form: ['l', 'w', 'w', 'd', 'w'], logo: 'https://e.imguol.com/futebol/brasoes/40x40/atletico-mg.png' },
  { pos: 5, team: 'INT', points: 58, form: ['d', 'd', 'w', 'w', 'l'], logo: 'https://e.imguol.com/futebol/brasoes/40x40/internacional.png' },
];

const FormDot = ({ result }) => {
  const colors = {
    w: 'bg-[#27ae60]',
    l: 'bg-[#c0392b]',
    d: 'bg-[#bdc3c7]'
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[result]}`} />;
};

export default function SportsSection() {
  const { data: sportsPosts = [] } = useQuery({
    queryKey: ["sports-posts"],
    queryFn: () => base44.entities.Post.filter(
      { category: "esportes", status: "published" },
      "-publish_date",
      3
    ),
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: ptBR });
    } catch {
      return "";
    }
  };

  return (
    <section 
      className="w-full py-14"
      style={{ background: "linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)" }}
    >
      <div className="site-container">
        {/* Header */}
        <div 
          className="flex items-center justify-between px-5 py-3 rounded-xl mb-8"
          style={{ background: "rgba(255, 255, 255, 0.25)", backdropFilter: "blur(10px)" }}
        >
          <h2 className="text-white font-bold text-xl uppercase tracking-wide" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            Esportes
          </h2>
          <Link 
            to={createPageUrl("Categoria") + "?slug=esportes"}
            className="text-white text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            Ver tabela completa <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          
          {/* Left Column - News Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sportsPosts.map((post) => (
              <Link
                key={post.id}
                to={createPageUrl("Noticia") + `?slug=${post.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={post.featured_image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 
                    className="text-base font-bold text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#F2994A] transition-colors"
                    style={{ fontFamily: "'Overpass', sans-serif" }}
                  >
                    {post.title}
                  </h3>
                  <p 
                    className="text-sm text-[#4A5568] mt-2 mb-3 line-clamp-3"
                    style={{ fontFamily: "'Overpass', sans-serif", lineHeight: 1.4 }}
                  >
                    {post.subtitle || post.meta_description || ""}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(post.publish_date || post.created_date)}
                  </span>
                </div>
              </Link>
            ))}

            {/* Fallback cards if no posts */}
            {sportsPosts.length === 0 && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                    <div className="h-40 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3 mt-3" />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right Column - Brasileirão Widget */}
          <div className="bg-white rounded-xl shadow-lg p-5 h-fit lg:h-full">
            {/* Widget Header */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Rodada 36</p>
              <h3 className="text-lg font-bold text-[#27ae60]" style={{ fontFamily: "'Overpass', sans-serif" }}>
                Campeonato Brasileiro 2025
              </h3>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase border-b border-gray-100">
                  <th className="text-left py-2 font-semibold">Classificação</th>
                  <th className="text-center py-2 font-semibold w-10">P</th>
                  <th className="text-right py-2 font-semibold">Últ. Jogos</th>
                </tr>
              </thead>
              <tbody>
                {soccerData.map((team, index) => (
                  <tr 
                    key={team.team} 
                    className={`border-b border-gray-50 ${index < 4 ? '' : ''}`}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold w-6 ${
                          team.pos <= 4 ? 'text-[#27ae60]' : 'text-gray-400'
                        }`}>
                          {team.pos}
                        </span>
                        <img 
                          src={team.logo} 
                          alt={team.team}
                          className="w-6 h-6 object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <span className="font-semibold text-[#1A1A1A] text-sm">
                          {team.team}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <span className="font-bold text-[#1A1A1A]">{team.points}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-1">
                        {team.form.map((result, i) => (
                          <FormDot key={i} result={result} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer Link */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link 
                to={createPageUrl("Categoria") + "?slug=esportes"}
                className="text-sm text-[#F2994A] font-semibold hover:underline flex items-center gap-1"
              >
                Ver classificação completa <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}