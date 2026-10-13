"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge, TrackingCode, PaymentBadge, PriorityBadge } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { formatPersianDate, toPersianDigits } from "@/lib/utils/formatters";
import { progressOf } from "@/components/orders/client-orders-overview";
import type { OrderStatus } from "@/types";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "ALL", label: "همه وضعیت‌ها" },
  { value: "ACTIVE", label: "در حال انجام" },
  { value: "COMPLETED", label: "تکمیل‌شده" },
  { value: "AWAITING_PAYMENT", label: "در انتظار پرداخت" },
  { value: "CANCELLED", label: "لغوشده" },
];

export default function ClientOrdersPage() {
  const { user } = useAuth();
  const { db } = useData();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  const orders = useMemo(() => {
    let list = db.orders.filter((o) => o.clientId === user?.id);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((o) => o.trackingCode.toLowerCase().includes(needle) || o.title.toLowerCase().includes(needle) || o.serviceTitle.toLowerCase().includes(needle));
    }
    if (status === "ACTIVE") list = list.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status));
    else if (status !== "ALL") list = list.filter((o) => o.status === (status as OrderStatus));
    return list;
  }, [db.orders, user?.id, q, status]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">سفارش‌های من</h2>
        <p className="mt-1.5 text-sm text-slate-500">تمام درخواست‌ها و سفارش‌های ثبت‌شده شما.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو با کد پیگیری یا عنوان…" className="pr-10" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="سفارشی یافت نشد"
            description="با فیلترهای انتخابی سفارشی وجود ندارد یا هنوز درخواستی ثبت نکرده‌اید."
            action={{ label: "ثبت درخواست جدید", href: "/panel/client/new-request" }}
          />
        ) : (
          <ul className="divide-y divide-slate-50">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/panel/client/orders/${o.id}`} className="block px-6 py-5 transition-colors hover:bg-slate-50/60">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TrackingCode code={o.trackingCode} />
                        <OrderStatusBadge status={o.status} />
                        <PriorityBadge priority={o.priority} />
                      </div>
                      <p className="mt-2.5 text-[14.5px] font-semibold">{o.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{o.serviceTitle} · ثبت: {formatPersianDate(o.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <PaymentBadge paid={o.isPaid} />
                      {o.milestones.length > 0 && (
                        <div className="w-36">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
