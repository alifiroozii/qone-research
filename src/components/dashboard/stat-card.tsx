"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  indigo: "bg-indigo-50 text-indigo-600",
  cyan: "bg-cyan-50 text-cyan-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
} as const;

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  hint?: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ label, value, icon: Icon, tone = "indigo", hint, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle"
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", TONES[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-black tracking-tight">{value}</p>
      <p className="mt-1 text-[13px] text-slate-500">{label}</p>
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </motion.div>
  );
}

export function ChartCard({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
