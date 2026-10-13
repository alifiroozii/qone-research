"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { formatPersianDate } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn } from "@/lib/utils";

export default function ClientMessagesPage() {
  const { user } = useAuth();
  const { db } = useData();

  const myOrders = db.orders.filter((o) => o.clientId === user?.id);
  const myOrderIds = new Set(myOrders.map((o) => o.id));
  const msgs = db.messages.filter((m) => myOrderIds.has(m.orderId));
  const latestByOrder = myOrders
    .map((o) => ({ order: o, last: msgs.filter((m) => m.orderId === o.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] }))
    .filter((x) => x.last);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پیام‌ها</h2>
        <p className="mt-1.5 text-sm text-slate-500">گفت‌وگوهای مرتبط با سفارش‌های شما.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {latestByOrder.length === 0 ? (
          <EmptyState icon={MessageSquare} title="پیامی وجود ندارد" description="پس از ارجاع سفارش به کارشناس، گفت‌وگو در اینجا نمایش داده می‌شود." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {latestByOrder.map(({ order, last }) => (
              <li key={order.id}>
                <Link href={`/panel/client/orders/${order.id}`} className="block px-6 py-4 transition-colors hover:bg-slate-50/60">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="num ltr inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{order.trackingCode}</p>
                      <p className="mt-2 truncate text-[14px] font-semibold">{order.title}</p>
                      <p className={cn("mt-1.5 line-clamp-1 text-[12.5px]", !last.isRead ? "font-semibold text-indigo-700" : "text-slate-500")}>
                        {last.senderName}: {last.content}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">{formatPersianDate(last.createdAt, true)}</span>
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
