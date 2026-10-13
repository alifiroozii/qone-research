"use client";

import React from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatPersianDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export default function ExpertSchedulePage() {
  const { user } = useAuth();
  const { db } = useData();

  const orders = db.orders
    .filter((o) => o.expertId === user?.id && !["COMPLETED", "CANCELLED"].includes(o.status))
    .sort((a, b) => new Date(a.targetDeadline ?? "9999").getTime() - new Date(b.targetDeadline ?? "9999").getTime());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">زمان‌بندی</h2>
        <p className="mt-1.5 text-sm text-slate-500">پروژه‌ها بر اساس نزدیکی مهلت.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState icon={CalendarClock} title="پروژه‌ای در برنامه نیست" />
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => {
            const isLate = o.targetDeadline ? new Date(o.targetDeadline).getTime() < Date.now() : false;
            return (
              <Link key={o.id} href={`/panel/expert/assigned/${o.id}`} className="card-hover block rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-bold">{o.title}</p>
                    <p className="num mt-1.5 text-[12px] text-slate-400 ltr">کد: {o.trackingCode}</p>
                  </div>
                  <div className={cn(
                    "rounded-xl px-4 py-2 text-center",
                    isLate ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-700"
                  )}>
                    <p className="text-[11px] font-medium">{isLate ? "گذشته از مهلت" : "مهلت تحویل"}</p>
                    <p className="mt-0.5 text-[13px] font-bold">{o.targetDeadline ? formatPersianDate(o.targetDeadline) : "—"}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
