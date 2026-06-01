"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  FolderLock, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Formulaires IA", href: "/forms", icon: FileText },
  { name: "Coffre-fort", href: "/vault", icon: FolderLock },
  { name: "Conformité", href: "/compliance", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-stone-100 bg-white dark:border-stone-900 dark:bg-stone-950">
      {/* Brand Logo Header */}
      <div className="flex h-20 items-center justify-center border-b border-stone-100 px-6 dark:border-stone-900">
        <div className="text-center">
          <h1 className="font-serif text-lg font-bold tracking-widest text-stone-900 dark:text-white">
            KAPEX
          </h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#C5A021] font-medium">
            Wealth Management
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-sm px-3 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 ${
                isActive
                  ? "bg-stone-50 text-stone-900 border-l-2 border-[#C5A021] dark:bg-stone-900 dark:text-white"
                  : "text-stone-500 hover:bg-stone-50/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900/50 dark:hover:text-white"
              }`}
            >
              <item.icon
                className={`mr-3 h-4 w-4 shrink-0 transition-colors duration-200 ${
                  isActive ? "text-[#C5A021]" : "text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section / Bottom */}
      <div className="border-t border-stone-100 p-4 dark:border-stone-900">
        <div className="flex items-center gap-3 px-2">
          <div className="h-7 w-7 rounded-full bg-stone-900 flex items-center justify-center border border-[#C5A021]">
            <span className="text-[10px] font-bold text-white">KW</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-stone-900 dark:text-white">Conseiller Kapex</span>
            <span className="text-[10px] text-stone-400">admin@kapex.fr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
