"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, Wallet } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatPersianDate, formatToman } from "@/lib/utils/formatters";

export default function AdminPaymentsPage() {
  const { db } = useData();
  const total = db.payments.reduce((s, p) => s + (p.status === "COMPLETED" ? p.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">مدیریت پرداخت‌ها</h2>
        <p className="mt-1.5 text-sm text-slate-500">تمام تراکنش‌های ثبت‌شده (آزمایشی).</p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[12px] text-emerald-700">مجموع درآمد ثبت‌شده (آزمایشی)</p>
            <p className="mt-1 text-xl font-black text-emerald-800">{formatToman(total)}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {db.payments.length === 0 ? (
          <EmptyState icon={CreditCard} title="پرداختی ثبت نشده" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-right">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[12px] text-slate-500">
                  <th className="px-5 py-3 font-semibold">کد پرداخت</th>
                  <th className="px-5 py-3 font-semibold">سفارش</th>
                  <th className="px-5 py-3 font-semibold">مبلغ</th>
                  <th className="px-5 py-3 font-semibold">درگاه</th>
                  <th className="px-5 py-3 font-semibold">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {db.payments.map((p) => {
                  const order = db.orders.find((o) => o.id === p.orderId);
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-[12.5px] num ltr font-semibold">{p.paymentCode}</td>
                      <td className="px-5 py-4">
                        <Link href={`/panel/admin/orders/${p.orderId}`} className="text-[12.5px] font-semibold text-indigo-600 hover:underline">
                          {order?.trackingCode ?? "—"}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-bold">{formatToman(p.amount)}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-amber-600">
                          {p.gateway === "DEMO" ? "آزمایشی" : p.gateway}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-slate-500">{formatPersianDate(p.createdAt, true)}</td>
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
