import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { 
  FileEdit, 
  Image, 
  LayoutGrid, 
  Bell,
  ArrowRight 
} from "lucide-react";

const actions = [
  {
    title: "Nova Notícia",
    description: "Criar nova publicação",
    icon: FileEdit,
    page: "PostEditor",
    color: "bg-blue-500",
  },
  {
    title: "Gerenciar Banners",
    description: "Anúncios e publicidade",
    icon: Image,
    page: "Banners",
    color: "bg-purple-500",
  },
  {
    title: "Configurar Home",
    description: "Layout da página inicial",
    icon: LayoutGrid,
    page: "HomeConfig",
    color: "bg-emerald-500",
  },
  {
    title: "Web Push",
    description: "Notificações push",
    icon: Bell,
    page: "WebPush",
    color: "bg-orange-500",
  },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg shadow-slate-100 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link
              key={action.title}
              to={createPageUrl(action.page)}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200"
              >
                <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </motion.div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}