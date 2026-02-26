import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format, addHours, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  Radio,
  Zap,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const typeOptions = [
  { value: "alerta", label: "Alerta", Icon: AlertTriangle, color: "bg-orange-500" },
  { value: "ao_vivo", label: "Ao Vivo", Icon: Radio, color: "bg-red-600" },
  { value: "urgente", label: "Urgente", Icon: Zap, color: "bg-red-800" },
];

const durationOptions = [
  { label: "1 hora", hours: 1 },
  { label: "6 horas", hours: 6 },
  { label: "12 horas", hours: 12 },
  { label: "1 dia", hours: 24 },
  { label: "2 dias", hours: 48 },
  { label: "7 dias", hours: 168 },
];

const defaultForm = {
  title: "",
  type: "alerta",
  post_url: "",
  duration_hours: 6,
};

export default function Alertas() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);

  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ["alertas-admin"],
    queryFn: () => base44.entities.Alerta.list("-created_date", 20),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Alerta.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alertas-admin"] });
      queryClient.invalidateQueries({ queryKey: ["alertas-ativos"] });
      setForm(defaultForm);
      setShowForm(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => base44.entities.Alerta.update(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alertas-admin"] });
      queryClient.invalidateQueries({ queryKey: ["alertas-ativos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Alerta.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alertas-admin"] });
      queryClient.invalidateQueries({ queryKey: ["alertas-ativos"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const expires_at = addHours(new Date(), form.duration_hours).toISOString();
    createMutation.mutate({
      title: form.title.trim(),
      type: form.type,
      post_url: form.post_url.trim() || null,
      expires_at,
      is_active: true,
    });
  };

  const isExpired = (alerta) => {
    if (!alerta.expires_at) return false;
    return new Date(alerta.expires_at) < new Date();
  };

  const typeMap = Object.fromEntries(typeOptions.map((t) => [t.value, t]));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Alertas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie a barra de alertas exibida no site
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#D71E1F] hover:bg-[#b91c1c] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Alerta
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">Criar novo alerta</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Título */}
            <div>
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                Título do Alerta *
              </Label>
              <Input
                id="title"
                placeholder="Ex: Incêndio de grandes proporções atinge o centro da cidade..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>

            {/* Tipo */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 block mb-2">
                Tipo de Alerta *
              </Label>
              <div className="flex gap-3 flex-wrap">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, type: opt.value })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${
                      form.type === opt.value
                        ? "border-[#D71E1F] bg-red-50 text-[#D71E1F]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <opt.Icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duração */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 block mb-2">
                Duração de exibição *
              </Label>
              <div className="flex gap-2 flex-wrap">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.hours}
                    type="button"
                    onClick={() => setForm({ ...form, duration_hours: opt.hours })}
                    className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-all ${
                      form.duration_hours === opt.hours
                        ? "border-[#D71E1F] bg-red-50 text-[#D71E1F]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* URL da Notícia */}
            <div>
              <Label htmlFor="post_url" className="text-sm font-semibold text-slate-700">
                Link da Notícia <span className="font-normal text-slate-400">(opcional)</span>
              </Label>
              <Input
                id="post_url"
                placeholder="/Noticia?slug=minha-noticia"
                value={form.post_url}
                onChange={(e) => setForm({ ...form, post_url: e.target.value })}
                className="mt-1.5"
              />
              <p className="text-xs text-slate-400 mt-1">
                Se preenchido, o alerta será clicável e abrirá este link.
              </p>
            </div>

            {/* Preview */}
            <div>
              <Label className="text-sm font-semibold text-slate-700 block mb-2">
                Preview
              </Label>
              <div className="bg-[#D71E1F] rounded-lg px-4 py-2.5 flex items-center gap-3">
                {(() => {
                  const t = typeMap[form.type];
                  if (!t) return null;
                  return (
                    <>
                      <span className="bg-[#b91c1c] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded flex items-center gap-1.5 flex-shrink-0">
                        <t.Icon className="w-3.5 h-3.5" />
                        {t.label}
                      </span>
                      <span className="text-white text-sm font-semibold truncate">
                        {form.title || "Seu título aparecerá aqui..."}
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || !form.title.trim()}
                className="bg-[#D71E1F] hover:bg-[#b91c1c] text-white"
              >
                {createMutation.isPending ? "Publicando..." : "Publicar Alerta"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowForm(false); setForm(defaultForm); }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Alertas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Alertas criados</h2>
          {alertas.length > 0 && (
            <span className="text-xs text-slate-400">{alertas.length} no total</span>
          )}
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Carregando...</div>
        ) : alertas.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Nenhum alerta criado ainda</p>
            <p className="text-slate-400 text-sm mt-1">Clique em "Novo Alerta" para começar</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alertas.map((alerta) => {
              const t = typeMap[alerta.type] || typeMap.alerta;
              const expired = isExpired(alerta);
              const active = alerta.is_active && !expired;

              return (
                <div key={alerta.id} className="px-6 py-4 flex items-center gap-4">
                  {/* Ícone tipo */}
                  <div className={`${t.color} rounded-lg p-2 flex-shrink-0`}>
                    <t.Icon className="w-4 h-4 text-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm leading-snug truncate">
                      {alerta.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        {t.label}
                      </span>
                      {alerta.expires_at && (
                        <span className={`text-[11px] flex items-center gap-1 ${expired ? "text-red-500" : "text-slate-400"}`}>
                          <Clock className="w-3 h-3" />
                          {expired
                            ? "Expirado"
                            : `Expira ${format(new Date(alerta.expires_at), "dd/MM HH:mm", { locale: ptBR })}`}
                        </span>
                      )}
                      {active && (
                        <span className="text-[11px] font-semibold text-green-600 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Exibindo no site
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex-shrink-0">
                    {active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Ativo
                      </span>
                    ) : expired ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Expirado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Inativo
                      </span>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-xs h-8 ${alerta.is_active ? "text-slate-600" : "text-green-600"}`}
                      onClick={() => toggleMutation.mutate({ id: alerta.id, is_active: !alerta.is_active })}
                      disabled={toggleMutation.isPending}
                    >
                      {alerta.is_active ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                      onClick={() => deleteMutation.mutate(alerta.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}