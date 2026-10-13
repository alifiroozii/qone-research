"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { OrderStatusBadge, TrackingCode, PriorityBadge } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatPersianDate } from "@/lib/utils/formatters";

export default function AdminNewOrdersPage() {
  const { db } = useData();
  const orders = db.orders.filter((o) => ["SUBMITTED", "PENDING_REVIEW", "REQUIRES_INFO"].includes(o.status));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">سفارش‌های جدید</h2>
        <p className="mt-1.5 text-sm text-slate-500">درخواست‌هایی که منتظر بررسی و صدور پیش‌فاکتور هستند.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {orders.length === 0 ? (
          <EmptyState icon={PlusCircle} title="سفارش جدیدی وجود ندارد" description="همه درخواست‌ها بررسی شده‌اند." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/panel/admin/orders/${o.id}`} className="block px-6 py-5 transition-colors hover:bg-slate-50/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <TrackingCode code={o.trackingCode} />
                        <OrderStatusBadge status={o.status} />
                        <PriorityBadge priority={o.priority} />
                      </div>
                      <p className="mt-2 text-[14px] font-semibold">{o.title}</p>
                      <p className="mt-1 text-[12px] text-slate-400">{o.clientName} · {o.serviceTitle} · {formatPersianDate(o.createdAt)}</p>
                    </div>
                    <span className="text-[12.5px] font-semibold text-indigo-600">بررسی و صدور پیش‌فاکتور ←</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
