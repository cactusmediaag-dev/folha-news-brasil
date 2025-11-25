import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  Bell,
  Settings,
  Send,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const services = [
  { value: "onesignal", label: "OneSignal" },
  { value: "firebase", label: "Firebase Cloud Messaging" },
  { value: "pusher", label: "Pusher" },
  { value: "custom", label: "Customizado" },
];

export default function WebPush() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['webpush'],
    queryFn: () => base44.entities.WebPushConfig.list(),
  });

  const config = configs[0] || {
    service_name: "",
    api_key: "",
    app_id: "",
    is_active: false,
    total_sends: 0,
    subscribers_count: 0,
  };

  const [formData, setFormData] = useState(config);

  React.useEffect(() => {
    if (configs.length > 0) {
      setFormData(configs[0]);
    }
  }, [configs]);

  const handleSave = async () => {
    setIsSaving(true);
    
    if (configs.length > 0) {
      await base44.entities.WebPushConfig.update(configs[0].id, formData);
    } else {
      await base44.entities.WebPushConfig.create(formData);
    }
    
    queryClient.invalidateQueries({ queryKey: ['webpush'] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Web Push</h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure notificações push para engajar seus leitores.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Inscritos</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {(config.subscribers_count || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Notificações Enviadas</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {(config.total_sends || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <Send className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {config.is_active ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="font-semibold text-emerald-600">Ativo</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-500">Inativo</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg shadow-slate-100">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuração
                </CardTitle>
                <Badge className={config.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                  {config.is_active ? "Configurado" : "Não configurado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label>Serviço de Push</Label>
                  <Select
                    value={formData.service_name}
                    onValueChange={(value) => setFormData({ ...formData, service_name: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o serviço..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(svc => (
                        <SelectItem key={svc.value} value={svc.value}>
                          {svc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>App ID</Label>
                  <Input
                    placeholder="ID da aplicação no serviço..."
                    value={formData.app_id || ""}
                    onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="Chave de API do serviço..."
                  value={formData.api_key || ""}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-slate-400 mt-1">
                  A chave será armazenada de forma segura.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">Ativar Web Push</p>
                  <p className="text-sm text-slate-500">
                    Habilita o envio de notificações push.
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !formData.service_name}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : saved ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="border-0 shadow-lg shadow-slate-100 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Como funciona?</h3>
              <ol className="text-sm text-slate-600 space-y-2">
                <li>1. Crie uma conta no serviço de push (OneSignal, Firebase, etc.)</li>
                <li>2. Configure o SDK do serviço no frontend do seu portal</li>
                <li>3. Insira as credenciais de API nesta página</li>
                <li>4. Ative o serviço e comece a enviar notificações</li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}