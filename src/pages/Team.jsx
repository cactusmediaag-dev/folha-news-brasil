import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Users,
  Shield,
  Edit2,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const roleConfig = {
  admin: { label: "Admin", class: "bg-purple-100 text-purple-700", icon: Shield },
  editor: { label: "Editor", class: "bg-blue-100 text-blue-700", icon: Edit2 },
  jornalista: { label: "Jornalista", class: "bg-emerald-100 text-emerald-700", icon: FileText },
  user: { label: "Usuário", class: "bg-slate-100 text-slate-700", icon: Users },
};

export default function Team() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('-created_date'),
  });

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Equipe Editorial</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie os membros da sua equipe.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'admin' || u.role_level === 'admin').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">Editores</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role_level === 'editor').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">Jornalistas</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {users.filter(u => u.role_level === 'jornalista').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Team List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="border-0 shadow-lg shadow-slate-100 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : users.length === 0 ? (
          <Card className="border-0 shadow-lg shadow-slate-100">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Nenhum membro encontrado
              </h3>
              <p className="text-slate-500">
                Convide membros para sua equipe pelo painel de configurações.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user, index) => {
              const roleKey = user.role_level || user.role || 'user';
              const role = roleConfig[roleKey] || roleConfig.user;
              const RoleIcon = role.icon;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 font-semibold">
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {user.full_name || "Sem nome"}
                          </h3>
                          <p className="text-sm text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={`${role.class} text-xs`}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {role.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {user.department && (
                        <p className="text-xs text-slate-400 mt-4">
                          Editoria: {user.department}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(user.created_date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        {user.posts_count > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {user.posts_count} posts
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg shadow-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Níveis de Permissão</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-purple-300">Admin</p>
                  <p className="text-slate-400">Acesso total ao sistema</p>
                </div>
                <div>
                  <p className="font-medium text-blue-300">Editor</p>
                  <p className="text-slate-400">Gerencia notícias e banners</p>
                </div>
                <div>
                  <p className="font-medium text-emerald-300">Jornalista</p>
                  <p className="text-slate-400">Cria e edita próprias notícias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}