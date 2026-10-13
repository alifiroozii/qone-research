"use client";

import React from "react";
import { useData } from "@/lib/context/data-context";
import { getServiceIcon } from "@/lib/utils/service-icons";
import { formatToman, toPersianDigits } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";

export default function AdminServicesPage() {
  const { db } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">خدمات و تعرفه‌ها</h2>
        <p className="mt-1.5 text-sm text-slate-500">فهرست خدمات فعال و قیمت پایه آن‌ها.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {db.services.map((s) => {
          const Icon = getServiceIcon(s.iconName);
          const count = db.orders.filter((o) => o.serviceId === s.id).length;
          return (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[15px] font-bold">{s.title}</h3>
                    <Badge variant={s.isActive ? "success" : "secondary"}>{s.isActive ? "فعال" : "غیرفعال"}</Badge>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-7 text-slate-500">{s.shortDesc}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-[12px]">
                    <span className="text-slate-500">قیمت پایه: <b className="text-foreground">{formatToman(s.basePrice)}</b></span>
                    <span className="text-slate-500">زمان: <b className="text-foreground">{toPersianDigits(s.turnaroundDays)} روز</b></span>
                    <span className="text-slate-500">سفارش‌ها: <b className="text-foreground">{toPersianDigits(count)}</b></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12.5px] leading-7 text-amber-800">
        در حالت نمایشی، ویرایش خدمات غیرفعال است. در نسخه عملیاتی مدیر می‌تواند عنوان، توضیحات، قیمت، آیکون و ترتیب نمایش هر خدمت را تغییر دهد.
      </div>
    </div>
  );
}
