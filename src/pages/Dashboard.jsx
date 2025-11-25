import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { 
  Newspaper, 
  FileText, 
  Eye, 
  Image,
  TrendingUp,
  Users
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import VisitsChart from "@/components/dashboard/VisitsChart";
import RecentPosts from "@/components/dashboard/RecentPosts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("fnb_auth");
    if (!auth) {
      navigate(createPageUrl("Login"));
      return;
    }
    setUser(JSON.parse(auth));
  }, [navigate]);

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date', 100),
  });

  const { data: banners = [] } = useQuery({
    queryKey: ['banners'],
    queryFn: () => base44.entities.Banner.list(),
  });

  const publishedPosts = posts.filter(p => p.status === 'published');
  const draftPosts = posts.filter(p => p.status === 'draft');
  const totalViews = posts.reduce((acc, p) => acc + (p.views_count || 0), 0);
  const activeBanners = banners.filter(b => b.is_active);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Folha News Brasil</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user.user}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("fnb_auth");
                  navigate(createPageUrl("Login"));
                }}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900">
            Bem-vindo de volta!
          </h2>
          <p className="text-slate-500 mt-1">
            Aqui está o resumo do seu portal de notícias.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Notícias Publicadas"
            value={publishedPosts.length}
            subtitle={`${draftPosts.length} rascunhos`}
            icon={FileText}
            color="blue"
            delay={0}
          />
          <StatsCard
            title="Total de Visitas"
            value={totalViews.toLocaleString()}
            subtitle="Todas as notícias"
            icon={Eye}
            color="green"
            delay={0.1}
          />
          <StatsCard
            title="Banners Ativos"
            value={activeBanners.length}
            subtitle={`${banners.length} total`}
            icon={Image}
            color="purple"
            delay={0.2}
          />
          <StatsCard
            title="Taxa de Engajamento"
            value="4.2%"
            subtitle="+0.8% esta semana"
            icon={TrendingUp}
            color="orange"
            delay={0.3}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart - 2 columns */}
          <div className="lg:col-span-2">
            <VisitsChart />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>

          {/* Recent Posts - 2 columns */}
          <div className="lg:col-span-2">
            <RecentPosts posts={posts} isLoading={postsLoading} />
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Equipe Editorial</h3>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Gerencie sua equipe de jornalistas, editores e colaboradores.
            </p>
            <button
              onClick={() => navigate(createPageUrl("Team"))}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
            >
              Gerenciar Equipe
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}