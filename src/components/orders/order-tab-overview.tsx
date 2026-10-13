"use client";

import React from "react";
import { CheckCircle2, CircleDashed, Loader2, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatPersianDate, toPersianDigits, formatToman } from "@/lib/utils/formatters";
import { OrderStatusBadge, PaymentBadge, TrackingCode } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

export function OverviewTab({ order }: { order: Order }) {
  const done = order.milestones.filter((m) => m.status === "COMPLETED").length;
  const progress = order.milestones.length ? Math.round((done / order.milestones.length) * 100) : 0;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "کد پیگیری", value: <TrackingCode code={order.trackingCode} /> },
    { label: "عنوان", value: order.title },
    { label: "نوع خدمت", value: order.serviceTitle },
    { label: "مشتری", value: order.clientName },
    { label: "وضعیت", value: <OrderStatusBadge status={order.status} /> },
    { label: "فوریت", value: order.priority === "URGENT" ? "فوری" : order.priority === "HIGH" ? "زیاد" : order.priority === "NORMAL" ? "معمولی" : "کم" },
    { label: "رشته / مقطع", value: `${order.fieldOfStudy} — ${order.degreeLevel}` },
    { label: "زبان", value: order.language === "fa" ? "فارسی" : order.language === "en" ? "انگلیسی" : "دو زبانه" },
    { label: "حجم کار", value: order.workVolume ?? "—" },
    { label: "تاریخ ثبت", value: formatPersianDate(order.createdAt) },
    { label: "مهلت انجام", value: order.targetDeadline ? formatPersianDate(order.targetDeadline) : "—" },
    { label: "قیمت توافقی", value: order.agreedPrice ? formatToman(order.agreedPrice) : "—" },
    { label: "وضعیت پرداخت", value: <PaymentBadge paid={order.isPaid} /> },
    { label: "کارشناس", value: order.expertName ?? "—" },
  ];

  return (
    <div className="space-y-6">
      {order.notes && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-[12px] text-slate-400">توضیحات مشتری</p>
          <p className="mt-2 text-[13.5px] leading-8 text-slate-700">{order.notes}</p>
        </div>
      )}

      <dl className="grid gap-x-10 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="border-b border-slate-100 py-3.5">
            <dt className="text-[12px] text-slate-400">{r.label}</dt>
            <dd className="mt-1.5 text-[13.5px] font-semibold leading-7">{r.value}</dd>
          </div>
        ))}
      </dl>

      {order.milestones.length > 0 && (
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-bold">پیشرفت کلی</h4>
            <span className="num text-sm font-bold text-indigo-600">{toPersianDigits(progress)}٪</span>
          </div>
          <Progress value={progress} className="mt-3" />
        </div>
      )}
    </div>
  );
}

export function MilestonesTab({ order, canEdit, onMilestoneChange }: {
  order: Order;
  canEdit: boolean;
  onMilestoneChange?: (milestoneId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => void;
}) {
  if (!order.milestones.length) {
    return <EmptyState icon={Milestone} title="هنوز مرحله‌ای تعریف نشده" description="پس از ارجاع سفارش به کارشناس، مراحل کار در اینجا نمایش داده می‌شود." />;
  }

  return (
    <ol className="relative space-y-6 pr-6">
      <div className="absolute right-[11px] top-2 bottom-2 w-px bg-slate-200" />
      {order.milestones.map((m) => {
        const meta = m.status === "COMPLETED"
          ? { icon: CheckCircle2, cls: "bg-success text-white", label: "تکمیل‌شده", ring: "border-success/30 bg-success/5" }
          : m.status === "IN_PROGRESS"
          ? { icon: Loader2, cls: "bg-indigo-600 text-white", label: "در حال انجام", ring: "border-indigo-200 bg-indigo-50/40" }
          : { icon: CircleDashed, cls: "bg-slate-100 text-slate-400", label: "در انتظار", ring: "border-slate-200 bg-white" };

        return (
          <li key={m.id} className="relative">
            <div className={cn("absolute -right-6 top-1 flex h-6 w-6 items-center justify-center rounded-full", meta.cls)}>
              <meta.icon className="h-3.5 w-3.5" />
            </div>
            <div className={cn("rounded-xl border p-4", meta.ring)}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[14px] font-bold">{m.title}</p>
                <span className="text-[11px] font-semibold text-slate-500">{meta.label}</span>
              </div>
              {m.description && <p className="mt-1.5 text-[13px] leading-7 text-slate-500">{m.description}</p>}
              <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-slate-400">
                {m.startedAt && <span>شروع: {formatPersianDate(m.startedAt, true)}</span>}
                {m.completedAt && <span>پایان: {formatPersianDate(m.completedAt, true)}</span>}
              </div>
              {canEdit && onMilestoneChange && (
                <div className="mt-3 flex gap-2">
                  {m.status !== "IN_PROGRESS" && (
                    <Button size="sm" variant="outline" onClick={() => onMilestoneChange(m.id, "IN_PROGRESS")}>شروع</Button>
                  )}
                  {m.status !== "COMPLETED" && (
                    <Button size="sm" variant="success" onClick={() => onMilestoneChange(m.id, "COMPLETED")}>تکمیل</Button>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
