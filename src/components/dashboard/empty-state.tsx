"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
        <Icon className="h-8 w-8 text-slate-300" />
      </div>
      <h3 className="mt-5 text-[15px] font-bold text-slate-700">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-[13px] leading-7 text-slate-400">{description}</p>}
      {action && (
        <Link href={action.href} className="mt-6">
          <Button variant="gradient" size="sm">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
