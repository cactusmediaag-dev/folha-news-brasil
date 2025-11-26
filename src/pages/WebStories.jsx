import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Smartphone,
  Trash2,
  Edit,
  Eye,
  Upload,
  Image as ImageIcon,
  Video,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORIES_LIST } from "@/components/shared/CategoryColors";

export default function WebStoriesPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "politica",
    media_url: "",
    media_type: "image",
    external_link: "",
    status: "draft",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["web-stories"],
    queryFn: () => base44.entities.WebStory.list("-created_date", 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WebStory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["web-stories"] });
      closeEditor();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.WebStory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["web-stories"] });
      closeEditor();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.WebStory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["web-stories"] });
    },
  });

  const openEditor = (story = null) => {
    if (story) {
      setEditingStory(story);
      setFormData({
        title: story.title || "",
        category: story.category || "politica",
        media_url: story.media_url || "",
        media_type: story.media_type || "image",
        external_link: story.external_link || "",
        status: story.status || "draft",
      });
    } else {
      setEditingStory(null);
      setFormData({
        title: "",
        category: "politica",
        media_url: "",
        media_type: "image",
        external_link: "",
        status: "draft",
      });
    }
    setPreviewError(false);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingStory(null);
    setFormData({
      title: "",
      category: "politica",
      media_url: "",
      media_type: "image",
      external_link: "",
      status: "draft",
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if video is too long (15 seconds max)
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        if (video.duration > 15) {
          alert("Vídeos devem ter no máximo 15 segundos.");
          return;
        }
        uploadFile(file, "video");
      };
      video.src = URL.createObjectURL(file);
    } else {
      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width > img.height) {
          alert("Recomendamos imagens verticais (9:16). A imagem horizontal será recortada.");
        }
        uploadFile(file, "image");
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const uploadFile = async (file, type) => {
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, media_url: file_url, media_type: type });
    setPreviewError(false);
    setIsUploading(false);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.media_url) {
      alert("Preencha o título e faça upload da mídia.");
      return;
    }

    if (editingStory) {
      updateMutation.mutate({ id: editingStory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este story?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Smartphone className="w-7 h-7 text-[#D71E1F]" />
            Web Stories
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie os stories que aparecem no carrossel da Home
          </p>
        </div>
        <Button
          onClick={() => openEditor()}
          className="bg-[#D71E1F] hover:bg-[#b91c1c]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Story
        </Button>
      </div>

      {/* Stories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#D71E1F]" />
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl">
          <Smartphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Nenhum story cadastrado
          </h3>
          <p className="text-slate-500 mb-6">
            Crie seu primeiro Web Story para aparecer na Home
          </p>
          <Button onClick={() => openEditor()} className="bg-[#D71E1F] hover:bg-[#b91c1c]">
            <Plus className="w-4 h-4 mr-2" />
            Criar Story
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <AnimatePresence>
            {stories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[9/16] bg-slate-200">
                    {story.media_type === "video" ? (
                      <video
                        src={story.media_url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={story.media_url}
                        alt={story.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    )}
                    <div
                      className="absolute inset-0 bg-slate-700 items-center justify-center hidden"
                    >
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <Badge
                      className="absolute top-2 left-2 text-white text-[10px]"
                      style={{ backgroundColor: CATEGORY_COLORS[story.category] || "#D71E1F" }}
                    >
                      {CATEGORY_LABELS[story.category] || story.category}
                    </Badge>

                    {/* Status Badge */}
                    <Badge
                      className={`absolute top-2 right-2 text-[10px] ${
                        story.status === "published"
                          ? "bg-green-500"
                          : "bg-amber-500"
                      }`}
                    >
                      {story.status === "published" ? "Publicado" : "Rascunho"}
                    </Badge>

                    {/* Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-semibold line-clamp-2">
                        {story.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-white/70 text-xs">
                        <Eye className="w-3 h-3" />
                        {story.views_count || 0}
                      </div>
                    </div>

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9"
                        onClick={() => openEditor(story)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-9 w-9"
                        onClick={() => handleDelete(story.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#D71E1F]" />
              {editingStory ? "Editar Story" : "Novo Story"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {/* Form */}
            <div className="space-y-5">
              {/* Media Upload */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Mídia (9:16 - Vertical)
                </Label>
                <div
                  className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-[#D71E1F] transition-colors cursor-pointer"
                  onClick={() => document.getElementById("media-upload").click()}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-[#D71E1F] mx-auto" />
                  ) : formData.media_url ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      {formData.media_type === "video" ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">Mídia carregada</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, media_url: "", media_type: "image" });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">
                        Clique para fazer upload
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Imagem ou vídeo vertical (máx 15s)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Title */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Título
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value.slice(0, 60),
                    })
                  }
                  placeholder="Título do story..."
                  maxLength={60}
                />
                <p className="text-xs text-slate-400 mt-1 text-right">
                  {formData.title.length}/60
                </p>
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Categoria
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES_LIST.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* External Link */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Link de Destino
                </Label>
                <Input
                  value={formData.external_link}
                  onChange={(e) =>
                    setFormData({ ...formData, external_link: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label className="text-sm font-semibold">Publicar</Label>
                  <p className="text-xs text-slate-500">
                    Story visível na Home
                  </p>
                </div>
                <Switch
                  checked={formData.status === "published"}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked ? "published" : "draft",
                    })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={closeEditor}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-[#D71E1F] hover:bg-[#b91c1c]"
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {editingStory ? "Salvar" : "Criar Story"}
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Preview
              </Label>
              <div
                className="relative bg-slate-900 rounded-[2rem] p-2 mx-auto"
                style={{ width: "220px" }}
              >
                {/* Phone Frame */}
                <div
                  className="relative bg-slate-800 rounded-[1.5rem] overflow-hidden"
                  style={{ aspectRatio: "9/16" }}
                >
                  {formData.media_url ? (
                    <>
                      {formData.media_type === "video" ? (
                        <video
                          src={formData.media_url}
                          className="w-full h-full object-cover"
                          muted
                          autoPlay
                          loop
                        />
                      ) : (
                        <img
                          src={formData.media_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setPreviewError(true)}
                        />
                      )}
                      {previewError && (
                        <div className="absolute inset-0 bg-slate-700 flex flex-col items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-xs text-slate-400">Erro na imagem</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <p className="text-xs">Sem mídia</p>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Category Badge */}
                  {formData.category && (
                    <Badge
                      className="absolute top-3 left-3 text-white text-[10px]"
                      style={{
                        backgroundColor: CATEGORY_COLORS[formData.category] || "#D71E1F",
                      }}
                    >
                      {CATEGORY_LABELS[formData.category] || formData.category}
                    </Badge>
                  )}

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-sm font-bold leading-tight">
                      {formData.title || "Título do Story"}
                    </h3>
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-slate-700 rounded-full" />
              </div>
              <p className="text-xs text-slate-400 text-center mt-3">
                Visualização aproximada do story
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}