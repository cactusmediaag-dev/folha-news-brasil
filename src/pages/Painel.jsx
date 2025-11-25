import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

// Credenciais do sistema
const VALID_CREDENTIALS = {
  username: "folhanewsbrasil",
  password: "FolhaNewsBrasil2025"
};

export default function Painel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verifica se já está logado
  useEffect(() => {
    const auth = localStorage.getItem("fnb_auth");
    if (auth) {
      const authData = JSON.parse(auth);
      // Verifica se a sessão ainda é válida (24 horas)
      const loginTime = new Date(authData.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        navigate(createPageUrl("Dashboard"));
        return;
      } else {
        // Sessão expirada
        localStorage.removeItem("fnb_auth");
      }
    }
    setCheckingAuth(false);
  }, [navigate]);

  // Timer de bloqueio
  useEffect(() => {
    if (blockTimer > 0) {
      const timer = setTimeout(() => setBlockTimer(blockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (blockTimer === 0 && isBlocked) {
      setIsBlocked(false);
      setAttempts(0);
    }
  }, [blockTimer, isBlocked]);

  const sanitizeInput = (input) => {
    return input.replace(/<[^>]*>?/gm, '').trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isBlocked) {
      setError(`Aguarde ${blockTimer} segundos antes de tentar novamente.`);
      return;
    }

    const sanitizedUsername = sanitizeInput(formData.username);
    const sanitizedPassword = sanitizeInput(formData.password);

    if (!sanitizedUsername || !sanitizedPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    // Simula delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800));

    if (sanitizedUsername === VALID_CREDENTIALS.username && 
        sanitizedPassword === VALID_CREDENTIALS.password) {
      // Login bem-sucedido
      localStorage.setItem("fnb_auth", JSON.stringify({
        user: sanitizedUsername,
        fullName: "Administrador",
        role: "admin",
        loginTime: new Date().toISOString()
      }));
      navigate(createPageUrl("Dashboard"));
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsBlocked(true);
        setBlockTimer(30);
        setError("Muitas tentativas. Bloqueado por 30 segundos.");
      } else {
        setError(`Credenciais inválidas. ${5 - newAttempts} tentativas restantes.`);
      }
    }

    setIsLoading(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-50 to-slate-50 rounded-full opacity-30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl shadow-2xl shadow-slate-900/20 mb-6"
          >
            <Newspaper className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Folha News Brasil
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Painel Administrativo
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                  Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-400 transition-all duration-200 rounded-xl"
                    disabled={isLoading || isBlocked}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-12 pr-12 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-400 transition-all duration-200 rounded-xl"
                    disabled={isLoading || isBlocked}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || isBlocked}
                className="w-full h-12 bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Autenticando...
                  </span>
                ) : isBlocked ? (
                  `Aguarde ${blockTimer}s`
                ) : (
                  "Entrar no Painel"
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center">
                Acesso restrito a usuários autorizados.
                <br />
                Todas as ações são registradas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-8">
          © 2025 Folha News Brasil. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
}