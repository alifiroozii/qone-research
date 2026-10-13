"use client";

import React, { useState } from "react";
import { PanelShell } from "@/components/layout/panel-shell";
import { CLIENT_NAV } from "@/components/layout/panel-nav";

export default function ClientPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell role="CLIENT" nav={CLIENT_NAV} title="پنل مشتری">
      {children}
    </PanelShell>
  );
}
