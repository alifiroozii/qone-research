"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Handshake, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge, TrackingCode } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { formatPersianDate, toPersianDigits } from "@/lib/utils/formatters";
import { progressOf } from "@/components/orders/client-orders-overview";

export default function ExpertAssignedPage() {
  const { user } = useAuth();
  const { db } = useData();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");

  const orders = useMemo(() => {
    let list = db.orders.filter((o) => o.expertId === user?.id);
    if (q.trim()) {
      const n = q.trim().toLowerCase();
      list = list.filter((o) => o.trackingCode.toLowerCase().includes(n) || o.title.toLowerCase().includes(n) || o.clientName.toLowerCase().includes(n));
    }
    if (filter === "ACTIVE") list = list.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status));
    return list;
  }, [db.orders, user?.id, q, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پروژه‌های ارجاع‌شده</h2>
        <p className="mt-1.5 text-sm text-slate-500">پروژه‌هایی که مدیر به شما ارجاع داده است.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو…" className="pr-10" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">همه پروژه‌ها</SelectItem>
            <SelectItem value="ACTIVE">فقط فعال‌ها</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {orders.length === 0 ? (
          <EmptyState icon={Handshake} title="پروژه‌ای یافت نشد" description="هنوز پروژه‌ای به شما ارجاع نشده است." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/panel/expert/assigned/${o.id}`} className="block px-6 py-5 transition-colors hover:bg-slate-50/60">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TrackingCode code={o.trackingCode} />
                        <OrderStatusBadge status={o.status} />
                      </div>
                      <p className="mt-2.5 text-[14.5px] font-semibold">{o.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{o.clientName} · {o.serviceTitle} · {formatPersianDate(o.createdAt)}</p>
                    </div>
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
