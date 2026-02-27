import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Tag, FolderTree, ExternalLink } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

// Categorias nativas fixas (não podem ser deletadas)
const NATIVE_CATEGORIES = [
  { slug: "politica", label: "Política", color: "#B71C1C", gradient_start: "#C62828", gradient_end: "#E53935", group: "news", native: true },
  { slug: "economia", label: "Economia", color: "#2E7D32", gradient_start: "#1B5E20", gradient_end: "#43A047", group: "news", native: true },
  { slug: "esportes", label: "Esportes", color: "#EF6C00", gradient_start: "#E65100", gradient_end: "#FF6D00", group: "entertainment", native: true },
  { slug: "entretenimento", label: "Entretenimento", color: "#9C27B0", gradient_start: "#6A1B9A", gradient_end: "#AB47BC", group: "entertainment", native: true },
  { slug: "tecnologia", label: "Tecnologia", color: "#0288D1", gradient_start: "#00f260", gradient_end: "#0575E6", group: "tech", native: true },
  { slug: "saude", label: "Saúde", color: "#009688", gradient_start: "#00695C", gradient_end: "#26A69A", group: "health", native: true },
  { slug: "educacao", label: "Educação", color: "#FBC02D", gradient_start: "#F57F17", gradient_end: "#FFCA28", group: "health", native: true },
  { slug: "mundo", label: "Mundo", color: "#1565C0", gradient_start: "#1A237E", gradient_end: "#3949AB", group: "news", native: true },
  { slug: "brasil", label: "Brasil", color: "#43A047", gradient_start: "#00695C", gradient_end: "#4CAF50", group: "news", native: true },
  { slug: "local", label: "Local", color: "#607D8B", gradient_start: "#37474F", gradient_end: "#607D8B", group: "local", native: true },
  { slug: "cidade", label: "Cidade", color: "#546E7A", gradient_start: "#37474F", gradient_end: "#607D8B", group: "local", native: true },
  { slug: "turismo", label: "Turismo", color: "#00BCD4", gradient_start: "#006064", gradient_end: "#00ACC1", group: "lifestyle", native: true },
  { slug: "transporte", label: "Transporte", color: "#455A64", gradient_start: "#263238", gradient_end: "#455A64", group: "local", native: true },
  { slug: "musica", label: "Música", color: "#E91E63", gradient_start: "#AD1457", gradient_end: "#EC407A", group: "entertainment", native: true },
  { slug: "ciencia", label: "Ciência", color: "#673AB7", gradient_start: "#1CD8D2", gradient_end: "#93EDC7", group: "tech", native: true },
  { slug: "nacional", label: "Nacional", color: "#009c3b", gradient_start: "#009c3b", gradient_end: "#005f25", group: "news", native: true },
  { slug: "auto", label: "Auto", color: "#2c3e50", gradient_start: "#2c3e50", gradient_end: "#bdc3c7", group: "lifestyle", native: true },
  { slug: "inteligencia-artificial", label: "Inteligência Artificial", color: "#b00bf9", gradient_start: "#b00bf9", gradient_end: "#560a9b", group: "tech", native: true },
  { slug: "nasa", label: "Nasa", color: "#0b1e3b", gradient_start: "#0b1e3b", gradient_end: "#1e3c72", group: "tech", native: true },
  { slug: "curiosidades", label: "Curiosidades", color: "#F7971E", gradient_start: "#F7971E", gradient_end: "#FFD200", group: "lifestyle", native: true },
  { slug: "viagem", label: "Viagem", color: "#2980B9", gradient_start: "#2980B9", gradient_end: "#6DD5FA", group: "lifestyle", native: true },
  { slug: "gastronomia", label: "Gastronomia", color: "#eb3349", gradient_start: "#eb3349", gradient_end: "#f45c43", group: "lifestyle", native: true },
  { slug: "viagem-gastronomia", label: "Viagem & Gastronomia", color: "#AA076B", gradient_start: "#AA076B", gradient_end: "#61045F", group: "lifestyle", native: true },
  { slug: "policia", label: "Polícia", color: "#1a1a2e", gradient_start: "#1a1a2e", gradient_end: "#16213e", group: "policia", native: true },
];

const GROUPS = [
  { value: "news", label: "Notícias" },
  { value: "tech", label: "Tecnologia" },
  { value: "entertainment", label: "Entretenimento" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "health", label: "Saúde & Educação" },
  { value: "local", label: "Local" },
  { value: "policia", label: "Polícia" },
  { value: "outros", label: "Outros" },
];

const emptyCategory = { slug: "", label: "", color: "#D71E1F", gradient_start: "#D71E1F", gradient_end: "#ff6b6b", group: "outros", is_active: true };
const emptySubcategory = { name: "", category: "" };

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Category Form Dialog ────────────────────────────────────────────────────
function CategoryDialog({ open, onClose, editing, onSave }) {
  const [form, setForm] = useState(editing || emptyCategory);

  React.useEffect(() => {
    setForm(editing || emptyCategory);
  }, [editing, open]);

  const handleLabelChange = (val) => {
    setForm((f) => ({
      ...f,
      label: val,
      slug: editing ? f.slug : slugify(val),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>Nome de exibição *</Label>
            <Input
              className="mt-1"
              value={form.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Ex: Meio Ambiente"
            />
          </div>
          <div>
            <Label>Slug (URL) *</Label>
            <Input
              className="mt-1"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              placeholder="ex: meio-ambiente"
            />
            <p className="text-xs text-slate-400 mt-1">
              URL: /Categoria?slug={form.slug || "..."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Cor principal</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-9 rounded border cursor-pointer"
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label>Gradiente início</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.gradient_start}
                  onChange={(e) => setForm({ ...form, gradient_start: e.target.value })}
                  className="w-10 h-9 rounded border cursor-pointer"
                />
                <Input
                  value={form.gradient_start}
                  onChange={(e) => setForm({ ...form, gradient_start: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label>Gradiente fim</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={form.gradient_end}
                  onChange={(e) => setForm({ ...form, gradient_end: e.target.value })}
                  className="w-10 h-9 rounded border cursor-pointer"
                />
                <Input
                  value={form.gradient_end}
                  onChange={(e) => setForm({ ...form, gradient_end: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div
            className="rounded-lg p-4 text-white text-sm font-bold"
            style={{ background: `linear-gradient(135deg, ${form.gradient_start} 0%, ${form.gradient_end} 100%)` }}
          >
            Preview: {form.label || "Nome da categoria"}
          </div>

          <div>
            <Label>Grupo</Label>
            <Select value={form.group} onValueChange={(v) => setForm({ ...form, group: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GROUPS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              className="bg-[#D71E1F] hover:bg-[#b91c1c] text-white"
              onClick={() => onSave(form)}
              disabled={!form.slug || !form.label}
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Subcategory Form Dialog ─────────────────────────────────────────────────
function SubcategoryDialog({ open, onClose, editing, allCategories, onSave }) {
  const [form, setForm] = useState(editing || emptySubcategory);

  React.useEffect(() => {
    setForm(editing || emptySubcategory);
  }, [editing, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar Subcategoria" : "Nova Subcategoria"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>Nome *</Label>
            <Input
              className="mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Futebol"
            />
          </div>
          <div>
            <Label>Categoria pai</Label>
            <Select value={form.category || ""} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Nenhuma —</SelectItem>
                {allCategories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              className="bg-[#D71E1F] hover:bg-[#b91c1c] text-white"
              onClick={() => onSave({ ...form, category: form.category === "__none__" ? "" : form.category })}
              disabled={!form.name}
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Categorias() {
  const queryClient = useQueryClient();
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  // Fetch custom categories from DB
  const { data: dbCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => base44.entities.Category.list(),
  });

  // Fetch subcategories
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => base44.entities.Subcategory.list(),
  });

  // Merge native + custom categories
  const allCategories = [
    ...NATIVE_CATEGORIES,
    ...dbCategories.filter((dc) => !NATIVE_CATEGORIES.find((nc) => nc.slug === dc.slug)),
  ];

  // ── Mutations ──
  const saveCategoryMutation = useMutation({
    mutationFn: (data) =>
      data.id ? base44.entities.Category.update(data.id, data) : base44.entities.Category.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCatDialogOpen(false);
      setEditingCat(null);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => base44.entities.Category.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const saveSubcategoryMutation = useMutation({
    mutationFn: (data) =>
      data.id ? base44.entities.Subcategory.update(data.id, data) : base44.entities.Subcategory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      setSubDialogOpen(false);
      setEditingSub(null);
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: (id) => base44.entities.Subcategory.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  const handleSaveCategory = (form) => {
    const payload = { ...form };
    if (editingCat?.id) payload.id = editingCat.id;
    saveCategoryMutation.mutate(payload);
  };

  const handleSaveSubcategory = (form) => {
    const payload = { ...form };
    if (editingSub?.id) payload.id = editingSub.id;
    saveSubcategoryMutation.mutate(payload);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorias & Subcategorias</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie as categorias e subcategorias das notícias.</p>
        </div>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderTree className="w-4 h-4" /> Categorias
          </TabsTrigger>
          <TabsTrigger value="subcategories" className="flex items-center gap-2">
            <Tag className="w-4 h-4" /> Subcategorias
          </TabsTrigger>
        </TabsList>

        {/* ── CATEGORIAS ── */}
        <TabsContent value="categories" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              className="bg-[#D71E1F] hover:bg-[#b91c1c] text-white"
              onClick={() => { setEditingCat(null); setCatDialogOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-2" /> Nova Categoria
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Native categories */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categorias Nativas (fixas)</p>
            </div>
            {NATIVE_CATEGORIES.map((cat) => (
              <div key={cat.slug} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-800">{cat.label}</span>
                  <span className="ml-2 text-xs text-slate-400 font-mono">{cat.slug}</span>
                </div>
                <Badge variant="outline" className="text-xs">{GROUPS.find(g => g.value === cat.group)?.label}</Badge>
                <a
                  href={`/Categoria?slug=${cat.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#D71E1F] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <span className="text-xs text-slate-300 italic">nativa</span>
              </div>
            ))}

            {/* Custom categories from DB */}
            {dbCategories.length > 0 && (
              <>
                <div className="px-4 py-2 bg-blue-50 border-b border-slate-100">
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Categorias Personalizadas</p>
                </div>
                {dbCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-slate-800">{cat.label}</span>
                      <span className="ml-2 text-xs text-slate-400 font-mono">{cat.slug}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{GROUPS.find(g => g.value === cat.group)?.label}</Badge>
                    <a
                      href={`/Categoria?slug=${cat.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-[#D71E1F] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-400 hover:text-blue-600"
                      onClick={() => { setEditingCat(cat); setCatDialogOpen(true); }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-400 hover:text-red-600"
                      onClick={() => { if (confirm(`Excluir "${cat.label}"?`)) deleteCategoryMutation.mutate(cat.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        </TabsContent>

        {/* ── SUBCATEGORIAS ── */}
        <TabsContent value="subcategories" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              className="bg-[#D71E1F] hover:bg-[#b91c1c] text-white"
              onClick={() => { setEditingSub(null); setSubDialogOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-2" /> Nova Subcategoria
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {subcategories.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Nenhuma subcategoria cadastrada.</p>
              </div>
            ) : (
              subcategories.map((sub) => {
                const parentCat = allCategories.find((c) => c.slug === sub.category);
                return (
                  <div key={sub.id} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <Tag className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-slate-800">{sub.name}</span>
                    </div>
                    {parentCat && (
                      <Badge
                        className="text-xs text-white"
                        style={{ background: parentCat.color }}
                      >
                        {parentCat.label}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-400 hover:text-blue-600"
                      onClick={() => { setEditingSub(sub); setSubDialogOpen(true); }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-400 hover:text-red-600"
                      onClick={() => { if (confirm(`Excluir "${sub.name}"?`)) deleteSubcategoryMutation.mutate(sub.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CategoryDialog
        open={catDialogOpen}
        onClose={() => { setCatDialogOpen(false); setEditingCat(null); }}
        editing={editingCat}
        onSave={handleSaveCategory}
      />
      <SubcategoryDialog
        open={subDialogOpen}
        onClose={() => { setSubDialogOpen(false); setEditingSub(null); }}
        editing={editingSub}
        allCategories={allCategories}
        onSave={handleSaveSubcategory}
      />
    </div>
  );
}