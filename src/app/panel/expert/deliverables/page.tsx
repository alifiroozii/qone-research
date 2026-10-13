"use client";

import React from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { EmptyState } from "@/components/dashboard/empty-state";
import { OrderStatusBadge, TrackingCode } from "@/components/orders/order-badges";
import { formatPersianDate, toPersianDigits } from "@/lib/utils/formatters";

export default function ExpertDeliverablesPage() {
  const { user } = useAuth();
  const { db } = useData();

  const orders = db.orders.filter((o) => o.expertId === user?.id && o.milestones.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">تحویل‌ها</h2>
        <p className="mt-1.5 text-sm text-slate-500">وضعیت پیشرفت و آمادگی تحویل پروژه‌ها.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState icon={Send} title="تحویلی در دست نیست" description="پس از ارجاع پروژه، وضعیت تحویل آن در اینجا نمایش داده می‌شود." />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((o) => {
            const done = o.milestones.filter((m) => m.status === "COMPLETED").length;
            const total = o.milestones.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <Link key={o.id} href={`/panel/expert/assigned/${o.id}`} className="card-hover block rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
                <div className="flex flex-wrap items-center gap-2">
                  <TrackingCode code={o.trackingCode} />
                  <OrderStatusBadge status={o.status} />
                </div>
                <p className="mt-2.5 text-[14px] font-bold">{o.title}</p>
                <div className="mt-3 flex items-center justify-between text-[12px] text-slate-500">
                  <span>{toPersianDigits(done)} از {toPersianDigits(total)} مرحله تکمیل</span>
                  <span className="num font-bold text-indigo-600">{toPersianDigits(pct)}٪</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-l from-indigo-600 to-cyan-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-3 text-[11px] text-slate-400">مهلت: {o.targetDeadline ? formatPersianDate(o.targetDeadline) : "—"}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
