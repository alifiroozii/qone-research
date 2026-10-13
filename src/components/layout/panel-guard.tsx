"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Loader2 } from "lucide-react";

/**
 * Client-side role guard for demo panels.
 *
 * NOTE: Hiding UI is not a security boundary. In production, every
 * sensitive route and data access must be re-verified on the server.
 */
export function PanelGuard({ role, children }: { role: "ADMIN" | "EXPERT" | "CLIENT"; children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/login?next=/panel/${role.toLowerCase()}`);
    } else if (user.role !== role) {
      const home = user.role === "ADMIN" ? "/panel/admin" : user.role === "EXPERT" ? "/panel/expert" : "/panel/client";
      router.replace(home);
    }
  }, [hydrated, user, role, router]);

  if (!hydrated || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm">در حال بررسی دسترسی…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
