"use client";

import React, { useMemo, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/lib/context/data-context";
import { AdminOrdersTable } from "@/components/tables/admin-orders-table";
import type { OrderStatus } from "@/types";

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const { db } = useData();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [expert, setExpert] = useState("ALL");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);

  const experts = db.users.filter((u) => u.role === "EXPERT");

  const filtered = useMemo(() => {
    let list = [...db.orders];
    if (q.trim()) {
      const n = q.trim().toLowerCase();
      list = list.filter((o) =>
        o.trackingCode.toLowerCase().includes(n) ||
        o.title.toLowerCase().includes(n) ||
        o.clientName.toLowerCase().includes(n) ||
        o.serviceTitle.toLowerCase().includes(n)
      );
    }
    if (status !== "ALL") list = list.filter((o) => o.status === (status as OrderStatus));
    if (expert !== "ALL") list = list.filter((o) => o.expertId === expert);
    list.sort((a, b) => {
      const d = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortNewest ? d : -d;
    });
    return list;
  }, [db.orders, q, status, expert, sortNewest]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">مدیریت سفارش‌ها</h2>
        <p className="mt-1.5 text-sm text-slate-500">جست‌وجو، فیلتر و مدیریت تمام سفارش‌های سامانه.</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="جست‌وجو با کد، عنوان، مشتری یا خدمت…" className="pr-10" />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-full lg:w-52"><SelectValue placeholder="وضعیت" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">همه وضعیت‌ها</SelectItem>
            <SelectItem value="SUBMITTED">ثبت‌شده</SelectItem>
            <SelectItem value="PENDING_REVIEW">در انتظار بررسی</SelectItem>
            <SelectItem value="QUOTED">پیش‌فاکتور صادرشده</SelectItem>
            <SelectItem value="AWAITING_PAYMENT">در انتظار پرداخت</SelectItem>
            <SelectItem value="PAID">پرداخت‌شده</SelectItem>
            <SelectItem value="ASSIGNED">ارجاع‌شده</SelectItem>
            <SelectItem value="IN_PROGRESS">در حال انجام</SelectItem>
            <SelectItem value="COMPLETED">تکمیل‌شده</SelectItem>
            <SelectItem value="CANCELLED">لغوشده</SelectItem>
          </SelectContent>
        </Select>
        <Select value={expert} onValueChange={(v) => { setExpert(v); setPage(1); }}>
          <SelectTrigger className="w-full lg:w-52"><SelectValue placeholder="کارشناس" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">همه کارشناسان</SelectItem>
            {experts.map((e) => <SelectItem key={e.id} value={e.id}>{e.fullName}</SelectItem>)}
          </SelectContent>
        </Select>
        <button
          onClick={() => setSortNewest((v) => !v)}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-input bg-card px-3.5 text-sm font-medium shadow-sm hover:bg-muted"
        >
          <ArrowUpDown className="h-4 w-4" />
          {sortNewest ? "جدیدترین" : "قدیمی‌ترین"}
        </button>
      </div>

      <AdminOrdersTable items={pageItems} page={safePage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} setPage={setPage} />
    </div>
  );
}
