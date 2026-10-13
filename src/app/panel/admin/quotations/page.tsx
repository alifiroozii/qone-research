"use client";

import React from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatPersianDate, formatToman } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export default function AdminQuotationsPage() {
  const { db } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پیش‌فاکتورها</h2>
        <p className="mt-1.5 text-sm text-slate-500">تمام پیش‌فاکتورهای صادرشده برای سفارش‌ها.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {db.quotations.length === 0 ? (
          <EmptyState icon={Receipt} title="پیش‌فاکتوری صادر نشده" description="از صفحه جزئیات سفارش می‌توانید پیش‌فاکتور صادر کنید." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-right">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[12px] text-slate-500">
                  <th className="px-5 py-3 font-semibold">شماره</th>
                  <th className="px-5 py-3 font-semibold">سفارش</th>
                  <th className="px-5 py-3 font-semibold">مبلغ</th>
                  <th className="px-5 py-3 font-semibold">وضعیت</th>
                  <th className="px-5 py-3 font-semibold">تاریخ صدور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {db.quotations.map((q) => {
                  const order = db.orders.find((o) => o.id === q.orderId);
                  const cls = q.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-600" : q.status === "REJECTED" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600";
                  const label = q.status === "ACCEPTED" ? "تأییدشده" : q.status === "REJECTED" ? "ردشده" : q.status === "EXPIRED" ? "منقضی" : "در انتظار";
                  return (
                    <tr key={q.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-[12.5px] num ltr font-semibold">{q.quotationNumber}</td>
                      <td className="px-5 py-4">
                        <Link href={`/panel/admin/orders/${q.orderId}`} className="text-[12.5px] font-semibold text-indigo-600 hover:underline">
                          {order?.trackingCode ?? "—"}
                        </Link>
                        <p className="mt-0.5 max-w-52 truncate text-[11px] text-slate-400">{order?.title ?? ""}</p>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-bold">{formatToman(q.payableAmount)}</td>
                      <td className="px-5 py-4"><span className={cn("rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold", cls)}>{label}</span></td>
                      <td className="px-5 py-4 text-[12px] text-slate-500">{formatPersianDate(q.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
