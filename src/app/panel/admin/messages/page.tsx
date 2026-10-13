"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatPersianDate, toPersianDigits } from "@/lib/utils/formatters";

export default function AdminMessagesPage() {
  const { db } = useData();

  const byOrder = db.orders
    .map((o) => ({ order: o, last: [...o.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0], count: o.messages.length }))
    .filter((x) => x.count > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پیام‌ها</h2>
        <p className="mt-1.5 text-sm text-slate-500">گفت‌وگوهای سفارش‌ها در یک نگاه.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {byOrder.length === 0 ? (
          <EmptyState icon={MessageSquare} title="پیامی وجود ندارد" />
        ) : (
          <ul className="divide-y divide-slate-50">
            {byOrder.map(({ order, last, count }) => (
              <li key={order.id}>
                <Link href={`/panel/admin/orders/${order.id}`} className="block px-6 py-4 transition-colors hover:bg-slate-50/60">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="num ltr inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{order.trackingCode}</p>
                      <p className="mt-2 truncate text-[14px] font-semibold">{order.title}</p>
                      <p className="mt-1.5 line-clamp-1 text-[12.5px] text-slate-500">{last.senderName}: {last.content}</p>
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="text-[11px] text-slate-400">{formatPersianDate(last.createdAt, true)}</p>
                      <p className="mt-1 text-[11px] font-semibold text-indigo-600">{toPersianDigits(count)} پیام</p>
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
