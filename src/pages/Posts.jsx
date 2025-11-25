import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusConfig = {
  published: { label: "Publicado", class: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  draft: { label: "Rascunho", class: "bg-slate-100 text-slate-700", icon: Clock },
  scheduled: { label: "Agendado", class: "bg-blue-100 text-blue-700", icon: Clock },
  archived: { label: "Arquivado", class: "bg-amber-100 text-amber-700", icon: AlertCircle },
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

export default function Posts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("fnb_auth");
    if (!auth) {
      navigate(createPageUrl("Painel"));
    }
  }, [navigate]);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Post.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDeleteId(null);
    },
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notícias</h1>
            <p className="text-slate-500 text-sm mt-1">
              {posts.length} notícias cadastradas
            </p>
          </div>
          <Link to={createPageUrl("PostEditor")}>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              Nova Notícia
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg shadow-slate-100 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar notícias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                  <SelectItem value="scheduled">Agendados</SelectItem>
                  <SelectItem value="archived">Arquivados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-50">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="border-0 shadow-lg shadow-slate-100 animate-pulse">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-32 h-20 bg-slate-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="border-0 shadow-lg shadow-slate-100">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Nenhuma notícia encontrada
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Comece criando sua primeira notícia."}
              </p>
              <Link to={createPageUrl("PostEditor")}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Notícia
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredPosts.map((post, index) => {
                const StatusIcon = statusConfig[post.status]?.icon || Clock;
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-shadow group">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Image */}
                          <Link to={`${createPageUrl("PostEditor")}?id=${post.id}`} className="flex-shrink-0">
                            {post.featured_image ? (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-lg bg-slate-100"
                              />
                            ) : (
                              <div className="w-full sm:w-32 h-32 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                                <FileText className="w-8 h-8 text-slate-400" />
                              </div>
                            )}
                          </Link>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <Link
                                to={`${createPageUrl("PostEditor")}?id=${post.id}`}
                                className="flex-1 min-w-0"
                              >
                                <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                  {post.title}
                                </h3>
                                {post.subtitle && (
                                  <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                                    {post.subtitle}
                                  </p>
                                )}
                              </Link>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`${createPageUrl("PostEditor")}?id=${post.id}`}>
                                      <Edit2 className="w-4 h-4 mr-2" />
                                      Editar
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => setDeleteId(post.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <Badge className={`${statusConfig[post.status]?.class} text-xs`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[post.status]?.label}
                              </Badge>
                              {post.category && (
                                <Badge variant="outline" className="text-xs">
                                  {categoryLabels[post.category]}
                                </Badge>
                              )}
                              <span className="text-xs text-slate-400">
                                {format(new Date(post.created_date), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                              </span>
                              {post.views_count > 0 && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {post.views_count.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir notícia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A notícia será permanentemente removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMutation.mutate(deleteId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}