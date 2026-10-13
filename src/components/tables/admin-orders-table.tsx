"use client";

import React from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { OrderStatusBadge, TrackingCode, PaymentBadge } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatPersianDate, toPersianDigits } from "@/lib/utils/formatters";
import type { Order } from "@/types";

export function AdminOrdersTable({
  items, page, totalPages, total, pageSize, setPage,
}: {
  items: Order[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  setPage: (p: number) => void;
}) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        <EmptyState icon={ClipboardList} title="سفارشی یافت نشد" description="با فیلترهای انتخابی نتیجه‌ای وجود ندارد." />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-right">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[12px] text-slate-500">
              <th className="px-5 py-3 font-semibold">کد پیگیری</th>
              <th className="px-5 py-3 font-semibold">عنوان / خدمت</th>
              <th className="px-5 py-3 font-semibold">مشتری</th>
              <th className="px-5 py-3 font-semibold">وضعیت</th>
              <th className="px-5 py-3 font-semibold">پرداخت</th>
              <th className="px-5 py-3 font-semibold">تاریخ ثبت</th>
              <th className="px-5 py-3 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-5 py-4"><TrackingCode code={o.trackingCode} /></td>
                <td className="px-5 py-4">
                  <p className="max-w-56 truncate text-[13px] font-semibold">{o.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{o.serviceTitle}</p>
                </td>
                <td className="px-5 py-4 text-[13px]">{o.clientName}</td>
                <td className="px-5 py-4"><OrderStatusBadge status={o.status} /></td>
                <td className="px-5 py-4"><PaymentBadge paid={o.isPaid} /></td>
                <td className="px-5 py-4 text-[12px] text-slate-500">{formatPersianDate(o.createdAt)}</td>
                <td className="px-5 py-4">
                  <Link href={`/panel/admin/orders/${o.id}`} className="text-[12.5px] font-semibold text-indigo-600 hover:underline">
                    مشاهده و مدیریت
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
        <p className="text-[12px] text-slate-500">
          نمایش {toPersianDigits((page - 1) * pageSize + 1)} تا {toPersianDigits(Math.min(page * pageSize, total))} از {toPersianDigits(total)} سفارش
        </p>
        <div className="flex gap-1.5">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium disabled:opacity-40 hover:bg-muted">
            قبلی
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg text-[13px] font-semibold ${p === page ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white hover:bg-muted"}`}
            >
              {toPersianDigits(p)}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium disabled:opacity-40 hover:bg-muted">
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}
