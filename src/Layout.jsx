import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  Newspaper,
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  Bell,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { name: "Notícias", page: "Posts", icon: FileText },
  { name: "Banners", page: "Banners", icon: Image },
  { name: "Web Push", page: "WebPush", icon: Bell },
  { name: "Equipe", page: "Team", icon: Users },
];

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      const userData = await base44.auth.me();
      setUser(userData);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  // Hide layout on specific pages if needed
  if (currentPageName === "Login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
        }
      `}</style>

      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl">
                        <Newspaper className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="font-bold text-slate-900">Folha News Brasil</h1>
                        <p className="text-xs text-slate-500">Painel Admin</p>
                      </div>
                    </div>
                  </div>
                  <nav className="p-4 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={createPageUrl(item.page)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          currentPageName === item.page
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-slate-900">Folha News Brasil</h1>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPageName === item.page
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-slate-700">
                          {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:inline text-sm font-medium text-slate-700">
                        {user.full_name || user.email}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Settings")}>
                        <Settings className="w-4 h-4 mr-2" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}