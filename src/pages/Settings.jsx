import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  Camera,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    department: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    const auth = localStorage.getItem("fnb_auth");
    if (!auth) {
      navigate(createPageUrl("Painel"));
      return;
    }
    loadUser();
  }, [navigate]);

  const loadUser = async () => {
    const auth = localStorage.getItem("fnb_auth");
    if (auth) {
      const authData = JSON.parse(auth);
      setUser({
        fullName: authData.fullName || authData.user,
        email: authData.user + "@folhanewsbrasil.com.br",
        role: authData.role,
      });
      setFormData({
        full_name: authData.fullName || "",
        phone: "",
        department: "",
        bio: "",
        avatar_url: "",
      });
    }
    setIsLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, avatar_url: file_url });
    setIsSaving(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Atualiza no localStorage
    const auth = localStorage.getItem("fnb_auth");
    if (auth) {
      const authData = JSON.parse(auth);
      authData.fullName = formData.full_name;
      localStorage.setItem("fnb_auth", JSON.stringify(authData));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsSaving(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie suas preferências e informações de perfil.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-100">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-100">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-100">
              <Shield className="w-4 h-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Avatar Section */}
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={formData.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 text-2xl font-semibold">
                          {getInitials(formData.full_name || user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute bottom-0 right-0 p-2 bg-slate-900 rounded-full cursor-pointer hover:bg-slate-800 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {formData.full_name || "Seu Nome"}
                      </h3>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                      <p className="text-xs text-slate-400 mt-1 capitalize">
                        {user?.role || "Usuário"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome Completo</Label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Departamento / Editoria</Label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Ex: Esportes, Política..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Biografia</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Uma breve descrição sobre você..."
                      className="mt-2 h-24"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
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
                      Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Preferências de Notificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "E-mail de novas notícias", desc: "Receba um resumo diário das notícias publicadas" },
                    { title: "Alertas de engajamento", desc: "Notificações quando suas notícias atingem marcos" },
                    { title: "Atualizações do sistema", desc: "Novidades e atualizações do CMS" },
                    { title: "Relatórios semanais", desc: "Receba relatórios de performance por e-mail" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={i < 2} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Segurança da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-900">Conta protegida</p>
                        <p className="text-sm text-emerald-700">
                          Sua conta está usando autenticação segura.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Sessões ativas</h4>
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Este dispositivo</p>
                          <p className="text-sm text-slate-500">
                            Última atividade: agora
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Ativo
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Encerrar todas as outras sessões
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}