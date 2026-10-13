"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ClipboardList, PlusCircle, PlayCircle, CheckCircle2, CreditCard,
  Users, UserCog, Wallet,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrdersTrendChart, StatusPieChart, RevenueBarChart, ServicesBarChart } from "@/components/charts/admin-charts";
import { useData } from "@/lib/context/data-context";
import { dashboardSummary, monthlySeries, topServices } from "@/server/services/analytics";
import { getOrderStatusMeta, toPersianDigits, formatToman } from "@/lib/utils/formatters";

export default function AdminDashboardPage() {
  const { db } = useData();
  const summary = useMemo(() => dashboardSummary(db), [db]);
  const monthly = useMemo(() => monthlySeries(db), [db]);
  const topSrv = useMemo(() => topServices(db), [db]);

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    db.orders.forEach((o) => {
      const label = getOrderStatusMeta(o.status).label;
      counts[label] = (counts[label] ?? 0) + 1;
    });
    return Object.entries(counts).map(([label, count]) => ({ label, count }));
  }, [db.orders]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black md:text-2xl">داشبورد مدیریت</h2>
        <p className="mt-1.5 text-sm text-slate-500">نمای کلی از عملکرد سامانه بر اساس داده‌های لحظه‌ای.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="کل سفارش‌ها" value={toPersianDigits(summary.total)} icon={ClipboardList} tone="indigo" />
        <StatCard label="سفارش‌های جدید" value={toPersianDigits(summary.newOrders)} icon={PlusCircle} tone="cyan" />
        <StatCard label="در حال انجام" value={toPersianDigits(summary.inProgress)} icon={PlayCircle} tone="amber" />
        <StatCard label="تکمیل‌شده" value={toPersianDigits(summary.completed)} icon={CheckCircle2} tone="emerald" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="درآمد ثبت‌شده" value={formatToman(summary.revenue)} icon={Wallet} tone="emerald" hint="فقط پرداخت‌های موفق (آزمایشی)" />
        <StatCard label="در انتظار پرداخت" value={formatToman(summary.pendingPayments)} icon={CreditCard} tone="amber" />
        <StatCard label="تعداد مشتریان" value={toPersianDigits(summary.clients)} icon={Users} tone="violet" />
        <StatCard label="کارشناسان فعال" value={toPersianDigits(summary.activeExperts)} icon={UserCog} tone="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersTrendChart data={monthly} />
        <StatusPieChart data={pieData} />
        <RevenueBarChart data={monthly} />
        <ServicesBarChart data={topSrv} />
      </div>
    </div>
  );
}
