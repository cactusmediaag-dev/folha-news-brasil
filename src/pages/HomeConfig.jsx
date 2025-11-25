import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Star,
  Grid3X3,
  Rows,
  Save,
  Loader2,
  CheckCircle,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function HomeConfig() {
  const [config, setConfig] = useState({
    layout: "grid",
    showFeatured: true,
    featuredCount: 5,
    categorySections: ["politica", "economia", "esportes"],
    showBanners: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.filter({ status: 'published' }, '-created_date', 20),
  });

  const featuredPosts = posts.filter(p => p.is_featured);

  const handleSave = async () => {
    setIsSaving(true);
    // Simula salvamento
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Configurar Home</h1>
            <p className="text-slate-500 text-sm mt-1">
              Personalize o layout da página inicial do portal.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : saved ? (
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Layout Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5" />
                    Layout Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { value: "grid", label: "Grade", icon: Grid3X3 },
                      { value: "list", label: "Lista", icon: Rows },
                      { value: "featured", label: "Destaque", icon: Star },
                    ].map(layout => (
                      <button
                        key={layout.value}
                        onClick={() => setConfig({ ...config, layout: layout.value })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          config.layout === layout.value
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <layout.icon className={`w-8 h-8 mx-auto mb-2 ${
                          config.layout === layout.value ? "text-slate-900" : "text-slate-400"
                        }`} />
                        <p className={`text-sm font-medium ${
                          config.layout === layout.value ? "text-slate-900" : "text-slate-500"
                        }`}>
                          {layout.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Featured Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Seção de Destaques
                    </CardTitle>
                    <Switch
                      checked={config.showFeatured}
                      onCheckedChange={(checked) => setConfig({ ...config, showFeatured: checked })}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Quantidade de destaques</Label>
                      <Select
                        value={String(config.featuredCount)}
                        onValueChange={(value) => setConfig({ ...config, featuredCount: parseInt(value) })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 4, 5, 6, 8].map(n => (
                            <SelectItem key={n} value={String(n)}>
                              {n} notícias
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm font-medium text-slate-700 mb-3">
                        Notícias marcadas como destaque:
                      </p>
                      {featuredPosts.length === 0 ? (
                        <p className="text-sm text-slate-400">
                          Nenhuma notícia marcada como destaque.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {featuredPosts.slice(0, 3).map(post => (
                            <div key={post.id} className="flex items-center gap-2 text-sm">
                              <Star className="w-3 h-3 text-amber-500" />
                              <span className="truncate">{post.title}</span>
                            </div>
                          ))}
                          {featuredPosts.length > 3 && (
                            <p className="text-xs text-slate-400">
                              +{featuredPosts.length - 3} mais
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Sections */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Seções por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 mb-4">
                    Selecione as categorias que aparecerão como seções na home.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categoryLabels).map(([value, label]) => {
                      const isSelected = config.categorySections.includes(value);
                      return (
                        <button
                          key={value}
                          onClick={() => {
                            if (isSelected) {
                              setConfig({
                                ...config,
                                categorySections: config.categorySections.filter(c => c !== value),
                              });
                            } else {
                              setConfig({
                                ...config,
                                categorySections: [...config.categorySections, value],
                              });
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Preview */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Prévia do Layout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border border-slate-200 rounded-lg p-4 bg-white">
                    {/* Mini preview */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="h-6 bg-slate-900 rounded" />
                      
                      {/* Featured */}
                      {config.showFeatured && (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2 h-20 bg-slate-200 rounded" />
                          <div className="space-y-2">
                            <div className="h-9 bg-slate-200 rounded" />
                            <div className="h-9 bg-slate-200 rounded" />
                          </div>
                        </div>
                      )}

                      {/* Content based on layout */}
                      {config.layout === "grid" && (
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-12 bg-slate-100 rounded" />
                          ))}
                        </div>
                      )}
                      {config.layout === "list" && (
                        <div className="space-y-2">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-6 bg-slate-100 rounded" />
                          ))}
                        </div>
                      )}
                      {config.layout === "featured" && (
                        <div className="space-y-2">
                          <div className="h-16 bg-slate-200 rounded" />
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-10 bg-slate-100 rounded" />
                            <div className="h-10 bg-slate-100 rounded" />
                          </div>
                        </div>
                      )}

                      {/* Category sections */}
                      {config.categorySections.slice(0, 2).map((cat, i) => (
                        <div key={cat} className="pt-2 border-t border-slate-100">
                          <div className="h-3 w-16 bg-slate-300 rounded mb-2" />
                          <div className="grid grid-cols-3 gap-1">
                            {[1, 2, 3].map(j => (
                              <div key={j} className="h-8 bg-slate-100 rounded" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Layout:</span>
                      <Badge variant="secondary">
                        {config.layout === "grid" ? "Grade" : config.layout === "list" ? "Lista" : "Destaque"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Destaques:</span>
                      <span>{config.showFeatured ? `${config.featuredCount} itens` : "Desativado"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Seções:</span>
                      <span>{config.categorySections.length} categorias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}