"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/branding/Logo";
import { useBrand } from "@/lib/context/brand-context";
import {
  LayoutDashboard, PlusCircle, ClipboardList, MessageSquare, FolderOpen,
  Receipt, CreditCard, Bell, LifeBuoy, User, Settings, Users,
  CalendarClock, UserCog, Send, Handshake, PieChart, BookOpen,
} from "lucide-react";
import type { NavItem } from "@/components/layout/panel-nav";

const PANEL_ICON_MAP: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  plus: PlusCircle,
  orders: ClipboardList,
  messages: MessageSquare,
  files: FolderOpen,
  receipt: Receipt,
  payments: CreditCard,
  bell: Bell,
  support: LifeBuoy,
  user: User,
  settings: Settings,
  users: Users,
  schedule: CalendarClock,
  expert: UserCog,
  send: Send,
  handshake: Handshake,
  reports: PieChart,
  services: BookOpen,
};

export function PanelSidebar({
  nav,
  badges = {},
  collapsed,
  onNavigate,
}: {
  nav: NavItem[];
  badges?: Partial<Record<NonNullable<NavItem["badgeKey"]>, number>>;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { brand } = useBrand();

  return (
    <div className={cn("flex h-full flex-col border-l border-slate-200 bg-white transition-all duration-300", collapsed ? "w-[76px]" : "w-64")}>
      <div className={cn("flex h-16 shrink-0 items-center border-b border-slate-100", collapsed ? "justify-center px-2" : "px-5")}>
        <Link href="/" aria-label="صفحه اصلی">
          <Logo
            concept={brand.logoConcept}
            brandNameEn={brand.brandNameEn}
            brandNameFa={brand.brandNameFa}
            size="sm"
            variant={collapsed ? "icon" : "full"}
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {nav.map((item) => {
            const base = item.href.split("/").slice(0, 3).join("/");
            const active = pathname === base && item.href === base ? true : item.href === pathname || (item.href !== base && pathname.startsWith(item.href + "/"));
            const badge = item.badgeKey ? badges[item.badgeKey] : 0;
            const Icon = PANEL_ICON_MAP[item.icon] ?? LayoutDashboard;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-gradient-to-l from-indigo-50 to-cyan-50/40 text-indigo-700"
                      : "text-slate-600 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {active && <span className="absolute right-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-indigo-600" />}
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && !!badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
