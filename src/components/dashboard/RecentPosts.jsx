import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, Eye, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusConfig = {
  published: { label: "Publicado", class: "bg-emerald-100 text-emerald-700" },
  draft: { label: "Rascunho", class: "bg-slate-100 text-slate-700" },
  scheduled: { label: "Agendado", class: "bg-blue-100 text-blue-700" },
};

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

export default function RecentPosts({ posts = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg shadow-slate-100 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Últimas Notícias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-20 h-14 bg-slate-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="border-0 shadow-lg shadow-slate-100 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Últimas Notícias
            </CardTitle>
            <Link 
              to={createPageUrl("Posts")} 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todas
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">Nenhuma notícia cadastrada</p>
              <Link
                to={createPageUrl("PostEditor")}
                className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block"
              >
                Criar primeira notícia
              </Link>
            </div>
          ) : (
            posts.slice(0, 5).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="group flex gap-4 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-20 h-14 object-cover rounded-lg bg-slate-100"
                  />
                ) : (
                  <div className="w-20 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <Edit2 className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className={`${statusConfig[post.status]?.class} text-xs px-2 py-0`}>
                      {statusConfig[post.status]?.label}
                    </Badge>
                    {post.category && (
                      <span className="text-xs text-slate-400">
                        {categoryLabels[post.category] || post.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(post.created_date), "dd MMM", { locale: ptBR })}
                    </span>
                    {post.views_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views_count.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}