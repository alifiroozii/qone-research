"use client";

import React, { useState } from "react";
import { PanelGuard } from "@/components/layout/panel-guard";
import { PanelSidebar } from "@/components/layout/panel-sidebar";
import { PanelTopbar, MobileNav } from "@/components/layout/panel-topbar";
import type { NavItem } from "@/components/layout/panel-nav";
import { useData } from "@/lib/context/data-context";
import { useAuth } from "@/lib/context/auth-context";

/**
 * Shared shell for all three panels: guard + collapsible sidebar +
 * topbar + mobile slide-over nav + computed badges.
 */
export function PanelShell({
  role,
  nav,
  title,
  children,
}: {
  role: "ADMIN" | "EXPERT" | "CLIENT";
  nav: NavItem[];
  title: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { db } = useData();
  const { user } = useAuth();

  const orders = user ? db.orders : [];
  const userOrders = role === "CLIENT" ? orders.filter((o) => o.clientId === user?.id)
    : role === "EXPERT" ? orders.filter((o) => o.expertId === user?.id)
    : orders;

  const myMessages = user ? db.messages.filter((m) => userOrders.some((o) => o.id === m.orderId) && m.senderId !== user.id && !m.isRead) : [];
  const myNotifs = user ? db.notifications.filter((n) => n.userId === user.id && !n.isRead) : [];
  const myTickets = user ? db.supportTickets.filter((t) => t.userId === user.id && t.status !== "CLOSED") : [];
  const pendingQuotations = role === "ADMIN" ? db.quotations.filter((q) => q.status === "PENDING") : [];

  const badges = {
    orders: userOrders.length,
    unreadMessages: myMessages.length,
    unreadNotifications: myNotifs.length,
    tickets: myTickets.length,
    pendingQuotations: pendingQuotations.length,
  };

  const sidebar = (
    <PanelSidebar nav={nav} badges={badges} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
  );

  return (
    <PanelGuard role={role}>
      <div className="flex min-h-screen bg-slate-50/70">
        <aside className="sticky top-0 hidden h-screen lg:block">{sidebar}</aside>

        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)}>
          {sidebar}
        </MobileNav>

        <div className="flex min-w-0 flex-1 flex-col">
          <PanelTopbar title={title} onToggleSidebar={() => setCollapsed((v) => !v)} onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </PanelGuard>
  );
}
