"use client";

import React from "react";
import { Receipt, History } from "lucide-react";
import { formatPersianDate, formatToman, getOrderStatusMeta } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { Order } from "@/types";

export function PaymentsTab({ order }: { order: Order }) {
  const q = order.quotations[0];
  const payments = order.payments;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="flex items-center gap-2 text-[14px] font-bold">
          <Receipt className="h-4 w-4 text-indigo-500" />
          پیش‌فاکتور
        </h4>
        {!q ? (
          <p className="mt-3 text-[13px] text-slate-400">هنوز پیش‌فاکتوری صادر نشده است.</p>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-[13px]">
              <span className="text-slate-500">شماره پیش‌فاکتور</span>
              <span className="num ltr font-semibold">{q.quotationNumber}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-[13px]">
              <span className="text-slate-500">مبلغ کل</span>
              <span className="font-semibold">{formatToman(q.totalAmount)}</span>
            </div>
            {q.discountAmount > 0 && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-[13px]">
                <span className="text-slate-500">تخفیف</span>
                <span className="font-semibold text-emerald-600">−{formatToman(q.discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-bold">مبلغ قابل پرداخت</span>
              <span className="font-black text-indigo-600">{formatToman(q.payableAmount)}</span>
            </div>
            <div className="flex flex-wrap justify-between gap-2 pt-2 text-[11px] text-slate-400">
              <span>اعتبار تا: {formatPersianDate(q.expiresAt)}</span>
              <span>زمان تحویل: {q.deliveryDays} روز</span>
            </div>
            {q.terms && <p className="rounded-lg bg-slate-50 p-3 text-[12px] leading-7 text-slate-500">{q.terms}</p>}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="text-[14px] font-bold">سوابق پرداخت</h4>
        {payments.length === 0 ? (
          <p className="mt-3 text-[13px] text-slate-400">پرداختی ثبت نشده است.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-50">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[13px]">
                <div>
                  <p className="num ltr font-semibold">{p.paymentCode}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {p.gateway === "DEMO" ? "پرداخت آزمایشی" : p.gateway} · {formatPersianDate(p.createdAt, true)}
                  </p>
                </div>
                <span className="font-bold">{formatToman(p.amount)}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-emerald-600">موفق</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function HistoryTab({ order }: { order: Order }) {
  const history = [...order.statusHistory].reverse();
  if (!history.length) {
    return <EmptyState icon={History} title="تاریخچه‌ای ثبت نشده" />;
  }
  return (
    <ol className="relative space-y-5 pr-6">
      <div className="absolute right-[11px] top-2 bottom-2 w-px bg-slate-200" />
      {history.map((h) => (
        <li key={h.id} className="relative">
          <div className="absolute right-[-9px] top-1.5 h-[18px] w-[18px] rounded-full border-4 border-white bg-indigo-500" />
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13.5px] font-bold">
                {getOrderStatusMeta(h.fromStatus).label}
                <span className="mx-2 text-slate-300">→</span>
                {getOrderStatusMeta(h.toStatus).label}
              </p>
              <span className="text-[11px] text-slate-400">{formatPersianDate(h.createdAt, true)}</span>
            </div>
            {h.note && <p className="mt-1.5 text-[12.5px] leading-7 text-slate-500">{h.note}</p>}
            <p className="mt-1 text-[11px] text-slate-400">توسط: {h.changedByName}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
