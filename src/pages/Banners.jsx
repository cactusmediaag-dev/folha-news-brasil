import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Image as ImageIcon,
  Plus,
  ExternalLink,
  Eye,
  MousePointer,
  MoreHorizontal,
  Edit2,
  Trash2,
  Power,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const positions = [
  { value: "header", label: "Header (Topo)" },
  { value: "sidebar_top", label: "Sidebar Superior" },
  { value: "sidebar_bottom", label: "Sidebar Inferior" },
  { value: "footer", label: "Footer (Rodapé)" },
  { value: "inline_article", label: "Dentro do Artigo" },
  { value: "popup", label: "Pop-up" },
];

const positionLabels = positions.reduce((acc, p) => ({ ...acc, [p.value]: p.label }), {});

export default function Banners() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("fnb_auth");
    if (!auth) {
      navigate(createPageUrl("Painel"));
    }
  }, [navigate]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    destination_url: "",
    position: "",
    advertiser: "",
    is_active: true,
    start_date: "",
    end_date: "",
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => base44.entities.Banner.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Banner.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Banner.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Banner.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setDeleteId(null);
    },
  });

  const openModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        name: banner.name || "",
        image_url: banner.image_url || "",
        destination_url: banner.destination_url || "",
        position: banner.position || "",
        advertiser: banner.advertiser || "",
        is_active: banner.is_active ?? true,
        start_date: banner.start_date || "",
        end_date: banner.end_date || "",
      });
    } else {
      setEditingBanner(null);
      setFormData({
        name: "",
        image_url: "",
        destination_url: "",
        position: "",
        advertiser: "",
        is_active: true,
        start_date: "",
        end_date: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, image_url: file_url });
    setIsUploading(false);
  };

  const handleSubmit = () => {
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleActive = async (banner) => {
    await base44.entities.Banner.update(banner.id, { is_active: !banner.is_active });
    queryClient.invalidateQueries({ queryKey: ['banners'] });
  };

  const activeBanners = banners.filter(b => b.is_active);
  const inactiveBanners = banners.filter(b => !b.is_active);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Banners</h1>
            <p className="text-slate-500 text-sm mt-1">
              {activeBanners.length} ativos • {inactiveBanners.length} inativos
            </p>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Banner
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg shadow-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total de Banners</p>
                  <p className="text-2xl font-bold text-slate-900">{banners.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total de Visualizações</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {banners.reduce((acc, b) => acc + (b.views_count || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Eye className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total de Cliques</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {banners.reduce((acc, b) => acc + (b.clicks_count || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <MousePointer className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Banners Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="border-0 shadow-lg shadow-slate-100 animate-pulse">
                <div className="h-40 bg-slate-200 rounded-t-lg" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : banners.length === 0 ? (
          <Card className="border-0 shadow-lg shadow-slate-100">
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Nenhum banner cadastrado
              </h3>
              <p className="text-slate-500 mb-6">
                Crie seu primeiro banner publicitário.
              </p>
              <Button onClick={() => openModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {banners.map((banner, index) => (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-0 shadow-lg shadow-slate-100 overflow-hidden group ${!banner.is_active ? 'opacity-60' : ''}`}>
                    <div className="relative h-40 bg-slate-100">
                      {banner.image_url ? (
                        <img
                          src={banner.image_url}
                          alt={banner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className={banner.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                          {banner.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 line-clamp-1">{banner.name}</h3>
                          <p className="text-sm text-slate-500">{positionLabels[banner.position]}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openModal(banner)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleActive(banner)}>
                              <Power className="w-4 h-4 mr-2" />
                              {banner.is_active ? "Desativar" : "Ativar"}
                            </DropdownMenuItem>
                            {banner.destination_url && (
                              <DropdownMenuItem asChild>
                                <a href={banner.destination_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Abrir Link
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(banner.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex gap-4 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {(banner.views_count || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          {(banner.clicks_count || 0).toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Editar Banner" : "Novo Banner"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nome do Banner</Label>
              <Input
                placeholder="Ex: Banner Home Principal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Imagem</Label>
              {formData.image_url ? (
                <div className="mt-2 relative">
                  <img
                    src={formData.image_url}
                    alt="Banner"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <label className="mt-2 border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-slate-300">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                      <span className="text-sm text-slate-500">Clique para enviar</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>

            <div>
              <Label>URL de Destino</Label>
              <Input
                placeholder="https://..."
                value={formData.destination_url}
                onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Posição</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {positions.map(pos => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Anunciante</Label>
              <Input
                placeholder="Nome do anunciante..."
                value={formData.advertiser}
                onChange={(e) => setFormData({ ...formData, advertiser: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.position || createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingBanner ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir banner?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O banner será permanentemente removido.
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