import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
  Link as LinkIcon,
  Sparkles,
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
import { useToast } from "@/components/ui/use-toast";

import { CATEGORIES_LIST } from "@/components/shared/CategoryColors";

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
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("id");

  const [isLoading, setIsLoading] = useState(!!editId);
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  
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
    subcategory: "",
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
  const [subcategorySuggestions, setSubcategorySuggestions] = useState([]);
  const [showSubcategorySuggestions, setShowSubcategorySuggestions] = useState(false);

  // Fetch existing subcategories for autocomplete
  const { data: existingPosts = [] } = useQuery({
    queryKey: ['posts-subcategories', post.category],
    queryFn: () => base44.entities.Post.filter({ category: post.category }),
    enabled: !!post.category,
  });

  useEffect(() => {
    if (existingPosts.length > 0 && post.category) {
      const uniqueSubcats = [...new Set(
        existingPosts
          .filter(p => p.subcategory)
          .map(p => p.subcategory)
      )];
      setSubcategorySuggestions(uniqueSubcats);
    }
  }, [existingPosts, post.category]);

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

  const handleMagicImport = async () => {
    if (!importUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, cole uma URL válida.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Acesse esta URL e extraia os metadados da página: ${importUrl}

Extraia as seguintes informações:
1. O título principal da notícia/artigo (og:title ou title tag)
2. A descrição ou subtítulo (og:description ou meta description)
3. A URL da imagem principal (og:image)

Retorne APENAS os dados encontrados. Se não encontrar algum campo, retorne string vazia.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Título da notícia" },
            description: { type: "string", description: "Descrição ou subtítulo" },
            image: { type: "string", description: "URL da imagem principal" },
          },
          required: ["title", "description", "image"],
        },
      });

      if (result.title || result.description || result.image) {
        setPost((prev) => ({
          ...prev,
          title: result.title || prev.title,
          subtitle: result.description || prev.subtitle,
          featured_image: result.image || prev.featured_image,
          slug: result.title ? generateSlug(result.title) : prev.slug,
          meta_title: result.title ? result.title.substring(0, 60) : prev.meta_title,
          meta_description: result.description ? result.description.substring(0, 160) : prev.meta_description,
        }));

        toast({
          title: "Dados importados com sucesso!",
          description: "Os campos foram preenchidos automaticamente.",
        });
        setImportUrl("");
      } else {
        toast({
          title: "Nenhum dado encontrado",
          description: "Não foi possível extrair dados desta URL. Preencha manualmente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao importar",
        description: "Não foi possível ler este site. Preencha manualmente.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
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
        {/* Magic Import Bar */}
        {!editId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-0 shadow-lg shadow-purple-100 bg-gradient-to-r from-purple-50 to-orange-50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold text-sm">Magic Import</span>
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Cole o link da notícia original aqui..."
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        className="pl-10 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                        onKeyDown={(e) => e.key === "Enter" && handleMagicImport()}
                      />
                    </div>
                    <Button
                      onClick={handleMagicImport}
                      disabled={isImporting || !importUrl.trim()}
                      className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white whitespace-nowrap"
                    >
                      {isImporting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Importar Dados ⚡
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                <CardContent className="p-0 pb-12">
                  <style>{`
                    /* Reset any global SVG styles that might affect Quill */
                    .quill-editor-wrapper svg {
                      width: auto !important;
                      height: auto !important;
                      max-width: 18px !important;
                      max-height: 18px !important;
                      display: inline-block !important;
                    }
                    .quill-editor-wrapper {
                      position: relative;
                      background: white;
                      border-radius: 0 0 8px 8px;
                      overflow: hidden;
                    }
                    .quill-editor-wrapper .ql-toolbar.ql-snow {
                      font-family: 'Titillium Web', sans-serif !important;
                      border: none !important;
                      border-bottom: 1px solid #E2E8F0 !important;
                      background: #F8FAFC;
                      padding: 12px 16px !important;
                      display: flex;
                      flex-wrap: wrap;
                      gap: 4px;
                    }
                    .quill-editor-wrapper .ql-toolbar.ql-snow .ql-formats {
                      margin-right: 12px !important;
                      display: flex;
                      align-items: center;
                      gap: 2px;
                    }
                    .quill-editor-wrapper .ql-toolbar.ql-snow button {
                      width: 32px !important;
                      height: 32px !important;
                      padding: 6px !important;
                      display: flex !important;
                      align-items: center !important;
                      justify-content: center !important;
                      border-radius: 4px !important;
                    }
                    .quill-editor-wrapper .ql-toolbar.ql-snow button:hover {
                      background: #E2E8F0 !important;
                    }
                    .quill-editor-wrapper .ql-toolbar.ql-snow button svg {
                      width: 16px !important;
                      height: 16px !important;
                      max-width: 16px !important;
                      max-height: 16px !important;
                    }
                    .quill-editor-wrapper .ql-toolbar.ql-snow .ql-picker {
                      height: 32px !important;
                    }
                    .quill-editor-wrapper .ql-toolbar.ql-snow .ql-picker-label {
                      padding: 4px 8px !important;
                      border-radius: 4px !important;
                      display: flex !important;
                      align-items: center !important;
                    }
                    .quill-editor-wrapper .ql-toolbar.ql-snow .ql-picker-label svg {
                      width: 16px !important;
                      height: 16px !important;
                    }
                    .quill-editor-wrapper .ql-container.ql-snow {
                      font-family: 'Titillium Web', sans-serif !important;
                      font-size: 16px;
                      border: none !important;
                      min-height: 400px;
                    }
                    .quill-editor-wrapper .ql-editor {
                      min-height: 400px;
                      padding: 24px !important;
                      background: white;
                      line-height: 1.8;
                      font-size: 16px;
                    }
                    .quill-editor-wrapper .ql-editor.ql-blank::before {
                      font-style: normal;
                      color: #94A3B8;
                      left: 24px;
                      font-size: 16px;
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
                      background: #F8FAFC;
                      padding: 12px 16px;
                      border-radius: 0 8px 8px 0;
                    }
                    .quill-editor-wrapper .ql-snow .ql-stroke {
                      stroke: #475569 !important;
                      stroke-width: 2px !important;
                    }
                    .quill-editor-wrapper .ql-snow .ql-fill {
                      fill: #475569 !important;
                    }
                    .quill-editor-wrapper .ql-snow .ql-thin {
                      stroke-width: 1px !important;
                    }
                    .quill-editor-wrapper .ql-snow button:hover .ql-stroke,
                    .quill-editor-wrapper .ql-snow .ql-picker-label:hover .ql-stroke {
                      stroke: #D71E1F !important;
                    }
                    .quill-editor-wrapper .ql-snow button:hover .ql-fill,
                    .quill-editor-wrapper .ql-snow .ql-picker-label:hover .ql-fill {
                      fill: #D71E1F !important;
                    }
                    .quill-editor-wrapper .ql-snow button.ql-active .ql-stroke {
                      stroke: #D71E1F !important;
                    }
                    .quill-editor-wrapper .ql-snow button.ql-active .ql-fill {
                      fill: #D71E1F !important;
                    }
                    .quill-editor-wrapper .ql-snow .ql-picker.ql-expanded .ql-picker-options {
                      border-color: #E2E8F0 !important;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                      border-radius: 8px !important;
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
                          ["bold", "italic", "underline", "strike", "blockquote"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold", "italic", "underline", "strike", "blockquote",
                        "list", "bullet",
                        "link", "image", "video"
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
                      onValueChange={(value) => setPost({ ...post, category: value, subcategory: "" })}
                    >
                      <SelectTrigger className="mt-2 bg-slate-50">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES_LIST.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Label className="text-sm font-medium text-slate-700">Subcategoria (Opcional)</Label>
                    <Input
                      placeholder="Ex: Futebol, Rock, Tecnologia..."
                      value={post.subcategory || ""}
                      onChange={(e) => {
                        setPost({ ...post, subcategory: e.target.value });
                        setShowSubcategorySuggestions(true);
                      }}
                      onFocus={() => setShowSubcategorySuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSubcategorySuggestions(false), 200)}
                      className="mt-2 bg-slate-50 border-slate-200 focus:bg-white"
                    />
                    {showSubcategorySuggestions && subcategorySuggestions.length > 0 && post.category && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {subcategorySuggestions
                          .filter(s => s.toLowerCase().includes((post.subcategory || "").toLowerCase()))
                          .map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 transition-colors"
                              onClick={() => {
                                setPost({ ...post, subcategory: suggestion });
                                setShowSubcategorySuggestions(false);
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                      </div>
                    )}
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