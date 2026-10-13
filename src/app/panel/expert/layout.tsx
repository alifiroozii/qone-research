import React from "react";
import { PanelShell } from "@/components/layout/panel-shell";
import { EXPERT_NAV } from "@/components/layout/panel-nav";

export default function ExpertPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell role="EXPERT" nav={EXPERT_NAV} title="پنل کارشناس">
      {children}
    </PanelShell>
  );
}
