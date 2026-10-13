"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { formatPersianDate, formatToman } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function ClientPaymentsPage() {
  const { user } = useAuth();
  const { db } = useData();

  const myOrders = db.orders.filter((o) => o.clientId === user?.id);
  const myOrderIds = new Set(myOrders.map((o) => o.id));
  const payments = db.payments.filter((p) => myOrderIds.has(p.orderId));
  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پرداخت‌ها</h2>
        <p className="mt-1.5 text-sm text-slate-500">سوابق پرداخت آزمایشی شما.</p>
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 px-6 py-4 text-[13px] text-indigo-800">
        توجه: پرداخت‌های این نسخه کاملاً آزمایشی هستند و هیچ مبلغ واقعی جابه‌جا نمی‌شود.
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {payments.length === 0 ? (
          <EmptyState icon={CreditCard} title="پرداختی ثبت نشده" description="پس از تأیید پیش‌فاکتور، امکان پرداخت آزمایشی فعال می‌شود." />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-bold">سوابق ({payments.length})</h3>
              <p className="text-[13px] text-slate-500">مجموع: <span className="font-black text-indigo-600">{formatToman(total)}</span></p>
            </div>
            <ul className="divide-y divide-slate-50">
              {payments.map((p) => {
                const order = myOrders.find((o) => o.id === p.orderId);
                return (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="num ltr rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{p.paymentCode}</span>
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-amber-600">پرداخت آزمایشی</span>
                      </div>
                      <p className="mt-2 text-[13.5px] font-semibold">{order?.title ?? "—"}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{formatPersianDate(p.createdAt, true)}</p>
                    </div>
                    <span className="text-base font-black">{formatToman(p.amount)}</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
