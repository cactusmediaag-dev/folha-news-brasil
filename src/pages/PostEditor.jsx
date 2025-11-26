import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import ReactQuill from "react-quill";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Video,
  Search,
  Eye,
  Loader2,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const categories = [
  { value: "politica", label: "Política" },
  { value: "economia", label: "Economia" },
  { value: "esportes", label: "Esportes" },
  { value: "entretenimento", label: "Entretenimento" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "mundo", label: "Mundo" },
  { value: "brasil", label: "Brasil" },
  { value: "local", label: "Local" },
];

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export default function PostEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("id");

  const [isLoading, setIsLoading] = useState(!!editId);
  
  useEffect(() => {
    const auth = localStorage.getItem("fnb_auth");
    if (!auth) {
      navigate(createPageUrl("Painel"));
    }
  }, [navigate]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [post, setPost] = useState({
    title: "",
    subtitle: "",
    slug: "",
    body: "",
    category: "",
    featured_image: "",
    video_url: "",
    status: "draft",
    publish_date: "",
    author_name: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
    is_featured: false,
  });

  useEffect(() => {
    if (editId) {
      loadPost();
    }
  }, [editId]);

  const loadPost = async () => {
    const posts = await base44.entities.Post.filter({ id: editId });
    if (posts.length > 0) {
      setPost(posts[0]);
    }
    setIsLoading(false);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setPost({
      ...post,
      title,
      slug: generateSlug(title),
      meta_title: title.substring(0, 60),
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setPost({ ...post, featured_image: file_url });
    setIsSaving(false);
  };

  const handleSave = async (status = post.status) => {
    setIsSaving(true);
    const postData = {
      ...post,
      status,
      publish_date: status === "published" && !post.publish_date 
        ? new Date().toISOString() 
        : post.publish_date,
    };

    if (editId) {
      await base44.entities.Post.update(editId, postData);
    } else {
      await base44.entities.Post.create(postData);
    }

    queryClient.invalidateQueries({ queryKey: ['posts'] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsSaving(false);

    if (!editId) {
      navigate(createPageUrl("Posts"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl("Posts"))}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {editId ? "Editar Notícia" : "Nova Notícia"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleSave("draft")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : saved ? (
                  <Check className="w-4 h-4 mr-2 text-emerald-600" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Rascunho
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleSave("published")}
                disabled={isSaving || !post.title}
              >
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Título</Label>
                    <Input
                      placeholder="Digite o título da notícia..."
                      value={post.title}
                      onChange={handleTitleChange}
                      className="mt-2 text-lg font-medium bg-slate-50 border-slate-200 focus:bg-white h-12"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Subtítulo</Label>
                    <Input
                      placeholder="Linha de apoio ou subtítulo..."
                      value={post.subtitle}
                      onChange={(e) => setPost({ ...post, subtitle: e.target.value })}
                      className="mt-2 bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">URL (Slug)</Label>
                    <Input
                      value={post.slug}
                      onChange={(e) => setPost({ ...post, slug: e.target.value })}
                      className="mt-2 bg-slate-50 border-slate-200 focus:bg-white font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Body Editor */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Conteúdo</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <style>{`
                    .quill-editor-wrapper .ql-container {
                      font-family: 'Titillium Web', sans-serif !important;
                      font-size: 16px;
                      border: none !important;
                      border-top: 1px solid #E2E8F0 !important;
                    }
                    .quill-editor-wrapper .ql-toolbar {
                      font-family: 'Titillium Web', sans-serif !important;
                      border: none !important;
                      border-bottom: 1px solid #E2E8F0 !important;
                      background: #F8FAFC;
                      padding: 12px !important;
                    }
                    .quill-editor-wrapper .ql-toolbar button {
                      width: 28px !important;
                      height: 28px !important;
                      padding: 4px !important;
                    }
                    .quill-editor-wrapper .ql-toolbar button svg {
                      width: 16px !important;
                      height: 16px !important;
                    }
                    .quill-editor-wrapper .ql-toolbar .ql-picker {
                      height: 28px !important;
                    }
                    .quill-editor-wrapper .ql-toolbar .ql-picker-label {
                      padding: 4px 8px !important;
                    }
                    .quill-editor-wrapper .ql-editor {
                      min-height: 400px;
                      padding: 20px !important;
                      background: white;
                      line-height: 1.7;
                    }
                    .quill-editor-wrapper .ql-editor.ql-blank::before {
                      font-style: normal;
                      color: #94A3B8;
                      left: 20px;
                    }
                    .quill-editor-wrapper .ql-editor p {
                      margin-bottom: 1em;
                    }
                    .quill-editor-wrapper .ql-editor h2 {
                      font-size: 1.5em;
                      font-weight: 700;
                      margin: 1.5em 0 0.5em;
                    }
                    .quill-editor-wrapper .ql-editor h3 {
                      font-size: 1.25em;
                      font-weight: 600;
                      margin: 1.2em 0 0.4em;
                    }
                    .quill-editor-wrapper .ql-editor blockquote {
                      border-left: 4px solid #D71E1F;
                      padding-left: 16px;
                      margin: 1em 0;
                      color: #64748B;
                      font-style: italic;
                    }
                    .quill-editor-wrapper .ql-snow .ql-stroke {
                      stroke: #475569 !important;
                    }
                    .quill-editor-wrapper .ql-snow .ql-fill {
                      fill: #475569 !important;
                    }
                    .quill-editor-wrapper .ql-snow button:hover .ql-stroke {
                      stroke: #D71E1F !important;
                    }
                    .quill-editor-wrapper .ql-snow button:hover .ql-fill {
                      fill: #D71E1F !important;
                    }
                    .quill-editor-wrapper .ql-snow button.ql-active .ql-stroke {
                      stroke: #D71E1F !important;
                    }
                    .quill-editor-wrapper .ql-snow button.ql-active .ql-fill {
                      fill: #D71E1F !important;
                    }
                  `}</style>
                  <div className="quill-editor-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={post.body}
                      onChange={(value) => setPost({ ...post, body: value })}
                      placeholder="Escreva sua notícia aqui..."
                      modules={{
                        toolbar: [
                          [{ header: [2, 3, false] }],
                          ["bold", "italic", "underline"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["blockquote", "link"],
                          ["image"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold", "italic", "underline",
                        "list", "bullet",
                        "blockquote", "link", "image"
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* SEO */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    SEO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Meta Title</Label>
                    <Input
                      placeholder="Título para mecanismos de busca..."
                      value={post.meta_title}
                      onChange={(e) => setPost({ ...post, meta_title: e.target.value })}
                      className="mt-2 bg-slate-50 border-slate-200 focus:bg-white"
                      maxLength={60}
                    />
                    <p className="text-xs text-slate-400 mt-1">{post.meta_title?.length || 0}/60 caracteres</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Meta Description</Label>
                    <Textarea
                      placeholder="Descrição para mecanismos de busca..."
                      value={post.meta_description}
                      onChange={(e) => setPost({ ...post, meta_description: e.target.value })}
                      className="mt-2 bg-slate-50 border-slate-200 focus:bg-white"
                      maxLength={160}
                    />
                    <p className="text-xs text-slate-400 mt-1">{post.meta_description?.length || 0}/160 caracteres</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Keywords</Label>
                    <Input
                      placeholder="Palavras-chave separadas por vírgula..."
                      value={post.keywords}
                      onChange={(e) => setPost({ ...post, keywords: e.target.value })}
                      className="mt-2 bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Imagem de Destaque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {post.featured_image ? (
                    <div className="relative group">
                      <img
                        src={post.featured_image}
                        alt="Featured"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPost({ ...post, featured_image: "" })}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300 transition-colors">
                      <ImageIcon className="w-10 h-10 text-slate-300 mb-3" />
                      <span className="text-sm text-slate-500">Clique para enviar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Categoria</Label>
                    <Select
                      value={post.category}
                      onValueChange={(value) => setPost({ ...post, category: value })}
                    >
                      <SelectTrigger className="mt-2 bg-slate-50">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700">Autor</Label>
                    <Input
                      placeholder="Nome do autor..."
                      value={post.author_name}
                      onChange={(e) => setPost({ ...post, author_name: e.target.value })}
                      className="mt-2 bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700">Link de Vídeo</Label>
                    <div className="relative mt-2">
                      <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="URL do YouTube ou Vimeo..."
                        value={post.video_url}
                        onChange={(e) => setPost({ ...post, video_url: e.target.value })}
                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-slate-100">
                    <Label className="text-sm font-medium text-slate-700">
                      Destaque na Home
                    </Label>
                    <Switch
                      checked={post.is_featured}
                      onCheckedChange={(checked) => setPost({ ...post, is_featured: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}