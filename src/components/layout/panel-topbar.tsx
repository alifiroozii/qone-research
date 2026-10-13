"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, RefreshCcw } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth-context";
import { useBrand } from "@/lib/context/brand-context";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { formatPersianDate } from "@/lib/utils/formatters";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<Role, string> = { ADMIN: "مدیر کل", EXPERT: "کارشناس", CLIENT: "مشتری" };

export function PanelTopbar({
  title,
  onToggleSidebar,
  onOpenMobileNav,
}: {
  title: string;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
}) {
  const { user, logout } = useAuth();
  const { brand } = useBrand();
  const { db, resetDemoData } = useData();
  const { toast } = useToast();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);

  const myNotifs = user ? db.notifications.filter((n) => n.userId === user.id) : [];
  const unread = myNotifs.filter((n) => !n.isRead).length;
  const notifHref = user?.role === "ADMIN" ? "/panel/admin/notifications" : user?.role === "EXPERT" ? "/panel/expert/notifications" : "/panel/client/notifications";

  const resetDemo = () => {
    resetDemoData();
    toast({ title: "داده‌های نمایشی بازنشانی شد", variant: "success" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
      <button onClick={onOpenMobileNav} className="lg:hidden" aria-label="منو">
        <Menu className="h-5 w-5" />
      </button>
      <button onClick={onToggleSidebar} className="hidden lg:inline-flex" aria-label="جمع کردن سایدبار">
        <Logo concept={brand.logoConcept} variant="icon" size="sm" />
      </button>

      <h1 className="flex-1 truncate text-[15px] font-bold">{title}</h1>

      <Button variant="ghost" size="sm" onClick={resetDemo} title="بازنشانی داده‌های نمایشی" className="hidden sm:inline-flex">
        <RefreshCcw className="h-4 w-4" />
        <span className="hidden md:inline">بازنشانی داده</span>
      </Button>

      <div className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors hover:bg-muted"
          aria-label="اعلان‌ها"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute left-0 top-12 z-50 w-80 animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-float">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold">اعلان‌ها</p>
                <Link href={notifHref} onClick={() => setNotifOpen(false)} className="text-xs text-indigo-600 hover:underline">مشاهده همه</Link>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {myNotifs.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-400">اعلانی وجود ندارد.</p>
                ) : (
                  myNotifs.slice(0, 6).map((n) => (
                    <div key={n.id} className={cn("border-b border-slate-50 px-4 py-3 last:border-0", !n.isRead && "bg-indigo-50/40")}>
                      <p className="text-[13px] font-semibold">{n.title}</p>
                      <p className="mt-1 text-xs leading-6 text-slate-500">{n.message}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{formatPersianDate(n.createdAt, true)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden text-left md:block">
          <p className="text-[13px] font-bold leading-5">{user?.name}</p>
          <p className="text-[11px] text-slate-400">{user ? ROLE_LABEL[user.role] : ""}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white">
          {user?.name?.[0] ?? "؟"}
        </div>
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="خروج"
          title="خروج از حساب"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}

/** Mobile slide-over navigation used on small screens. */
export function MobileNav({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-float">
        {children}
      </div>
    </div>
  );
}
