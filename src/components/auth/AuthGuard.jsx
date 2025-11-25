import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Loader2 } from "lucide-react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = localStorage.getItem("fnb_auth");
    if (auth) {
      const authData = JSON.parse(auth);
      const loginTime = new Date(authData.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setUser(authData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("fnb_auth");
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("fnb_auth");
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isLoading, isAuthenticated, logout, checkAuth };
}

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(createPageUrl("Painel"));
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}