"use client";

import React, { useMemo } from "react";
import { useData } from "@/lib/context/data-context";
import { dashboardSummary, monthlySeries, topServices, expertPerformance } from "@/server/services/analytics";
import { OrdersTrendChart, RevenueBarChart, ServicesBarChart } from "@/components/charts/admin-charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { ClipboardList, Clock, TrendingUp, Users } from "lucide-react";
import { toPersianDigits, formatToman } from "@/lib/utils/formatters";

export default function AdminReportsPage() {
  const { db } = useData();
  const summary = useMemo(() => dashboardSummary(db), [db]);
  const monthly = useMemo(() => monthlySeries(db), [db]);
  const topSrv = useMemo(() => topServices(db), [db]);
  const perf = useMemo(() => expertPerformance(db), [db]);

  const delayed = db.orders.filter((o) => {
    if (["COMPLETED", "CANCELLED"].includes(o.status) || !o.targetDeadline) return false;
    return new Date(o.targetDeadline).getTime() < Date.now();
  }).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black md:text-2xl">گزارش‌ها</h2>
          <p className="mt-1.5 text-sm text-slate-500">تحلیل عملکرد سامانه بر اساس داده‌های نمایشی.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="کل سفارش‌ها" value={toPersianDigits(summary.total)} icon={ClipboardList} tone="indigo" />
        <StatCard label="سفارش‌های تأخیردار" value={toPersianDigits(delayed)} icon={Clock} tone="rose" hint="گذشته از مهلت تعیین‌شده" />
        <StatCard label="کل درآمد ثبت‌شده" value={formatToman(summary.revenue)} icon={TrendingUp} tone="emerald" />
        <StatCard label="مشتریان فعال" value={toPersianDigits(summary.clients)} icon={Users} tone="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersTrendChart data={monthly} />
        <RevenueBarChart data={monthly} />
        <ServicesBarChart data={topSrv} />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
          <h3 className="text-[15px] font-bold">عملکرد کارشناسان</h3>
          <ul className="mt-5 divide-y divide-slate-50">
            {perf.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13.5px] font-semibold">{p.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{toPersianDigits(p.active)} فعال · {toPersianDigits(p.completed)} تکمیل‌شده</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[12px] font-bold text-indigo-700">★ {p.rating.toLocaleString("fa-IR")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
