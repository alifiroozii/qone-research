"use client";

import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { toPersianDigits } from "@/lib/utils/formatters";
import { ChartCard } from "@/components/dashboard/stat-card";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  fontSize: 12,
  fontFamily: "Vazirmatn, sans-serif",
  direction: "rtl" as const,
};

export function OrdersTrendChart({ data }: { data: { month: string; orders: number; completed: number }[] }) {
  return (
    <ChartCard title="روند سفارش‌ها" subtitle="تعداد سفارش‌های ثبت‌شده و تکمیل‌شده در ماه‌های اخیر">
      <div className="h-72" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Vazirmatn" }} tickLine={false} axisLine={false} reversed />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [toPersianDigits(v), ""]} />
            <Area type="monotone" dataKey="orders" name="ثبت‌شده" stroke="#4F46E5" strokeWidth={2.5} fill="url(#gradOrders)" />
            <Area type="monotone" dataKey="completed" name="تکمیل‌شده" stroke="#06B6D4" strokeWidth={2.5} fill="url(#gradCompleted)" />
            <Legend formatter={(v) => <span style={{ fontSize: 12, fontFamily: "Vazirmatn" }}>{v}</span>} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

const PIE_COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#64748B"];

export function StatusPieChart({ data }: { data: { label: string; count: number }[] }) {
  return (
    <ChartCard title="سفارش‌ها بر اساس وضعیت" subtitle="توزیع فعلی سفارش‌ها">
      <div className="h-72" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={3} strokeWidth={0}>
              {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => toPersianDigits(v)} />
            <Legend formatter={(v) => <span style={{ fontSize: 11, fontFamily: "Vazirmatn" }}>{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function RevenueBarChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <ChartCard title="درآمد ماهانه" subtitle="مبالغ ثبت‌شده (تومان)">
      <div className="h-72" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Vazirmatn" }} tickLine={false} axisLine={false} reversed />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1_000_000).toLocaleString("fa-IR")}M`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${toPersianDigits(v.toLocaleString("fa-IR"))} تومان`, "درآمد"]} />
            <Bar dataKey="revenue" name="درآمد" fill="#4F46E5" radius={[8, 8, 0, 0]} maxBarSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function ServicesBarChart({ data }: { data: { title: string; count: number }[] }) {
  return (
    <ChartCard title="محبوب‌ترین خدمات" subtitle="بر اساس تعداد سفارش">
      <div className="h-72" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 6, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="title" width={170} tick={{ fontSize: 10.5, fill: "#64748b", fontFamily: "Vazirmatn" }} tickLine={false} axisLine={false} reversed />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [toPersianDigits(v), "سفارش"]} />
            <Bar dataKey="count" name="سفارش" fill="#06B6D4" radius={[0, 8, 8, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
