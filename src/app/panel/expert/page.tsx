"use client";

import React from "react";
import Link from "next/link";
import { Handshake, PlayCircle, CheckCircle2, MessageSquare, ArrowLeft } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrderStatusBadge, TrackingCode } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { formatPersianDate, toPersianDigits } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";

export default function ExpertDashboardPage() {
  const { user } = useAuth();
  const { db } = useData();

  const assigned = db.orders.filter((o) => o.expertId === user?.id);
  const active = assigned.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status));
  const completed = assigned.filter((o) => o.status === "COMPLETED");
  const myOrderIds = new Set(assigned.map((o) => o.id));
  const unreadMessages = db.messages.filter((m) => myOrderIds.has(m.orderId) && m.senderId !== user?.id && !m.isRead);
  const latest = assigned.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black md:text-2xl">سلام {user?.name} 👋</h2>
          <p className="mt-1.5 text-sm text-slate-500">پروژه‌های ارجاع‌شده و وضعیت وظایف شما.</p>
        </div>
        <Link href="/panel/expert/assigned">
          <Button variant="gradient" className="group">
            پروژه‌های ارجاع‌شده
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="کل پروژه‌های ارجاع‌شده" value={toPersianDigits(assigned.length)} icon={Handshake} tone="indigo" />
        <StatCard label="پروژه‌های فعال" value={toPersianDigits(active.length)} icon={PlayCircle} tone="cyan" />
        <StatCard label="تکمیل‌شده" value={toPersianDigits(completed.length)} icon={CheckCircle2} tone="emerald" />
        <StatCard label="پیام خوانده‌نشده" value={toPersianDigits(unreadMessages.length)} icon={MessageSquare} tone="rose" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-[15px] font-bold">آخرین پروژه‌ها</h3>
          <Link href="/panel/expert/assigned" className="text-xs font-semibold text-indigo-600 hover:underline">مشاهده همه</Link>
        </div>
        {latest.length === 0 ? (
          <EmptyState icon={Handshake} title="هنوز پروژه‌ای به شما ارجاع نشده" description="پس از ارجاع پروژه توسط مدیر، در اینجا نمایش داده می‌شود." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {latest.map((o) => (
              <li key={o.id}>
                <Link href={`/panel/expert/assigned/${o.id}`} className="block px-6 py-4 transition-colors hover:bg-slate-50/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TrackingCode code={o.trackingCode} />
                        <OrderStatusBadge status={o.status} />
                      </div>
                      <p className="mt-2 truncate text-[14px] font-semibold">{o.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{o.serviceTitle} · مشتری: {o.clientName} · {formatPersianDate(o.createdAt)}</p>
                    </div>
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
