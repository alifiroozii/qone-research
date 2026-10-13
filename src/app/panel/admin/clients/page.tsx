"use client";

import React, { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useData } from "@/lib/context/data-context";
import { EmptyState } from "@/components/dashboard/empty-state";
import { toPersianDigits } from "@/lib/utils/formatters";

export default function AdminClientsPage() {
  const { db } = useData();
  const [q, setQ] = useState("");

  const clients = useMemo(() => {
    let list = db.users.filter((u) => u.role === "CLIENT");
    if (q.trim()) {
      const n = q.trim().toLowerCase();
      list = list.filter((u) => u.fullName.toLowerCase().includes(n) || u.email.toLowerCase().includes(n) || (u.university ?? "").toLowerCase().includes(n));
    }
    return list;
  }, [db.users, q]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">مدیریت مشتریان</h2>
        <p className="mt-1.5 text-sm text-slate-500">فهرست مشتریان ثبت‌نام‌شده و آمار سفارش‌های آن‌ها.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو با نام، ایمیل یا دانشگاه…" className="pr-10" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {clients.length === 0 ? (
          <EmptyState icon={Users} title="مشتری‌ای یافت نشد" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-right">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[12px] text-slate-500">
                  <th className="px-5 py-3 font-semibold">نام</th>
                  <th className="px-5 py-3 font-semibold">ایمیل</th>
                  <th className="px-5 py-3 font-semibold">دانشگاه / رشته</th>
                  <th className="px-5 py-3 font-semibold">تعداد سفارش</th>
                  <th className="px-5 py-3 font-semibold">تاریخ عضویت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clients.map((u) => {
                  const count = db.orders.filter((o) => o.clientId === u.id).length;
                  return (
                    <tr key={u.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-[13px] font-semibold">{u.fullName}</td>
                      <td className="px-5 py-4 text-[12.5px] ltr">{u.email}</td>
                      <td className="px-5 py-4 text-[12.5px] text-slate-500">{u.university ?? "—"} / {u.major ?? "—"}</td>
                      <td className="px-5 py-4 text-[13px] font-semibold">{toPersianDigits(count)}</td>
                      <td className="px-5 py-4 text-[12.5px] text-slate-500">{u.phone ?? "—"}</td>
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
