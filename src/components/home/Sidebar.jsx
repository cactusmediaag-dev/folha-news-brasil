import React from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryLabels = {
  politica: "Política",
  economia: "Economia",
  esportes: "Esportes",
  entretenimento: "Entretenimento",
  tecnologia: "Tecnologia",
  saude: "Saúde",
  educacao: "Educação",
  mundo: "Mundo",
  brasil: "Brasil",
  local: "Local",
};

export default function Sidebar({ posts = [] }) {
  const sidebarPosts = posts.slice(0, 8);

  return (
    <aside className="space-y-6">
      {/* Leia Também Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#1A1A1A]">Leia Também</h3>
          <div className="w-12 h-1 bg-[#D71E1F] mt-2 rounded-full" />
        </div>

        <div className="space-y-4">
          {sidebarPosts.length > 0 ? (
            sidebarPosts.map((post) => (
              <a
                key={post.id}
                href={`/noticia/${post.slug}`}
                className="block group"
              >
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="text-xs text-gray-400 font-medium min-w-fit">
                    {format(new Date(post.created_date), "HH:mm", { locale: ptBR })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#333333] group-hover:text-[#D71E1F] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <span className="text-xs text-[#D71E1F] mt-1 inline-block">
                      {categoryLabels[post.category] || post.category}
                    </span>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-4 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ad Banner */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Publicidade</p>
        <div className="h-[250px] bg-white/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <span className="text-gray-400 text-sm">Banner 300x250</span>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-[#D71E1F] rounded-xl p-5 text-white">
        <h3 className="text-lg font-bold mb-2">Newsletter</h3>
        <p className="text-sm text-white/90 mb-4">
          Receba as principais notícias do dia no seu e-mail.
        </p>
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
        />
        <button className="w-full py-2 bg-white text-[#D71E1F] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
          Inscrever-se
        </button>
      </div>
    </aside>
  );
}