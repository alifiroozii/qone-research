"use client";

import React from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { formatPersianDate, formatToman } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn } from "@/lib/utils";

export default function ClientQuotationsPage() {
  const { user } = useAuth();
  const { db } = useData();

  const myOrders = db.orders.filter((o) => o.clientId === user?.id);
  const myOrderIds = new Set(myOrders.map((o) => o.id));
  const quotes = db.quotations.filter((q) => myOrderIds.has(q.orderId));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پیش‌فاکتورها</h2>
        <p className="mt-1.5 text-sm text-slate-500">پیش‌فاکتورهای صادرشده برای سفارش‌های شما.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {quotes.length === 0 ? (
          <EmptyState icon={Receipt} title="پیش‌فاکتوری وجود ندارد" description="پس از بررسی درخواست توسط مدیر، پیش‌فاکتور در اینجا نمایش داده می‌شود." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {quotes.map((q) => {
              const order = myOrders.find((o) => o.id === q.orderId);
              const statusCls = q.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-600" : q.status === "REJECTED" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600";
              const statusLabel = q.status === "ACCEPTED" ? "تأییدشده" : q.status === "REJECTED" ? "ردشده" : "در انتظار تأیید";
              return (
                <li key={q.id}>
                  <Link href={`/panel/client/orders/${q.orderId}`} className="block px-6 py-5 transition-colors hover:bg-slate-50/60">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="num ltr rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{q.quotationNumber}</span>
                          <span className={cn("rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold", statusCls)}>{statusLabel}</span>
                        </div>
                        <p className="mt-2 text-[14px] font-semibold">{order?.title ?? "—"}</p>
                        <p className="mt-1 text-[11px] text-slate-400">صادرشده: {formatPersianDate(q.createdAt)} · اعتبار تا {formatPersianDate(q.expiresAt)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] text-slate-400">مبلغ قابل پرداخت</p>
                        <p className="mt-1 text-base font-black text-indigo-600">{formatToman(q.payableAmount)}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
