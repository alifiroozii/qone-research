"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getOrderStatusMeta, getPriorityMeta, toPersianDigits } from "@/lib/utils/formatters";
import type { OrderStatus, Priority } from "@/types";

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = getOrderStatusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        meta.badgeBg, meta.badgeText, meta.badgeBorder,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotColor)} />
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const meta = getPriorityMeta(priority);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", meta.colorClass, className)}>
      {meta.label}
    </span>
  );
}

export function TrackingCode({ code, className }: { code: string; className?: string }) {
  return (
    <span className={cn("num ltr rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600", className)}>
      {code}
    </span>
  );
}

export function PaymentBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">پرداخت‌شده</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">پرداخت‌نشده</span>
  );
}

export function PersianNumber({ value, className }: { value: number; className?: string }) {
  return <span className={cn("num", className)}>{toPersianDigits(value)}</span>;
}
