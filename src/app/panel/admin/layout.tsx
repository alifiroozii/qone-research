import React from "react";
import { PanelShell } from "@/components/layout/panel-shell";
import { ADMIN_NAV } from "@/components/layout/panel-nav";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell role="ADMIN" nav={ADMIN_NAV} title="پنل مدیریت">
      {children}
    </PanelShell>
  );
}
