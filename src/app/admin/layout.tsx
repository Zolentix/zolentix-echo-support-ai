"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ZLogo } from "@/components/ui/ZLogo";
import { getToken, getAdmin, clearAuth } from "@/lib/admin-auth";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/admin/knowledge", label: "Knowledge Base", icon: BookOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    const a = getAdmin();
    setAdmin(a);
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function handleLogout() {
    clearAuth();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-echo-base flex">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-echo-surface border-r border-echo-border flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-echo-border">
          <div className="flex items-center gap-3">
            <ZLogo size={24} />
            <span className="font-display font-semibold text-echo-text">
              Echo Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-echo-text-muted hover:text-echo-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-echo-primary/10 text-echo-primary-bright"
                    : "text-echo-text-secondary hover:text-echo-text hover:bg-echo-surface-hover"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="p-3 border-t border-echo-border">
          {admin && (
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-echo-text truncate">
                {admin.name}
              </p>
              <p className="text-xs text-echo-text-muted truncate">
                {admin.email}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-echo-text-secondary hover:text-echo-danger hover:bg-echo-danger/5 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 h-14 bg-echo-surface/80 backdrop-blur-xl border-b border-echo-border flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-echo-text-muted hover:text-echo-text"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-echo-text">
            Echo Admin
          </span>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
