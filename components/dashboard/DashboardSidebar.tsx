"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  User, 
  Settings, 
  Briefcase, 
  History,
  LogOut,
  Bell
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  role: "client" | "artisan" | "admin";
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = role === "artisan" ? [
    { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
    { label: "Missions", href: "/dashboard/missions", icon: Briefcase },
    { label: "Planning", href: "/dashboard/planning", icon: ClipboardList },
    { label: "Profil Pro", href: "/dashboard/profile", icon: User },
    { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ] : [
    { label: "Carnet Nova", href: "/dashboard", icon: History },
    { label: "Mes Demandes", href: "/dashboard/requests", icon: ClipboardList },
    { label: "Mon Profil", href: "/dashboard/profile", icon: User },
    { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white/40 backdrop-blur-xl border-r border-border flex flex-col z-50">
      <div className="p-6">
        <Link href="/" className="text-xl font-extrabold text-primary-dk" style={{ fontFamily: "var(--font-display)" }}>
          Nova <span className="text-primary">Intervention</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium ${
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-text-muted hover:bg-white/50 hover:text-primary-dk"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
