"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { OrderStatusBadge, TrackingCode, PaymentBadge } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Progress } from "@/components/ui/progress";
import { formatPersianDate, toPersianDigits } from "@/lib/utils/formatters";
import type { Order } from "@/types";

export function progressOf(milestones: { status: string }[]) {
  if (!milestones.length) return 0;
  const done = milestones.filter((m) => m.status === "COMPLETED").length;
  return Math.round((done / milestones.length) * 100);
}

export function OrdersOverview({ orders }: { orders: Order[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-[15px] font-bold">آخرین سفارش‌ها</h3>
        <Link href="/panel/client/orders" className="text-xs font-semibold text-indigo-600 hover:underline">مشاهده همه</Link>
      </div>
      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="هنوز سفارشی ثبت نکرده‌اید"
          description="با ثبت اولین درخواست، روند پژوهش خود را با ما آغاز کنید."
          action={{ label: "ثبت درخواست جدید", href: "/panel/client/new-request" }}
        />
      ) : (
        <ul className="divide-y divide-slate-50">
          {orders.map((o, i) => (
            <motion.li key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/panel/client/orders/${o.id}`} className="block px-6 py-4 transition-colors hover:bg-slate-50/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <TrackingCode code={o.trackingCode} />
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <p className="mt-2 truncate text-[14px] font-semibold">{o.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{o.serviceTitle} · ثبت: {formatPersianDate(o.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <PaymentBadge paid={o.isPaid} />
                    {o.milestones.length > 0 && (
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>پیشرفت</span>
                          <span className="num">{toPersianDigits(progressOf(o.milestones))}٪</span>
                        </div>
                        <Progress value={progressOf(o.milestones)} className="mt-1 h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
