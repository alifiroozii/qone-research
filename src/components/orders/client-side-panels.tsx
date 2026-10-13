"use client";

import React from "react";
import Link from "next/link";
import { Bell, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { formatPersianDate, toPersianDigits } from "@/lib/utils/formatters";

export function ClientSidePanels() {
  const { user } = useAuth();
  const { db } = useData();

  const myOrders = db.orders.filter((o) => o.clientId === user?.id);
  const myOrderIds = new Set(myOrders.map((o) => o.id));
  const myNotifs = db.notifications.filter((n) => n.userId === user?.id);
  const unreadNotifs = myNotifs.filter((n) => !n.isRead).length;
  const recentNotifs = myNotifs.slice(0, 4);
  const recentMessages = db.messages.filter((m) => myOrderIds.has(m.orderId)).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="flex items-center gap-2 text-[15px] font-bold">
            <Bell className="h-4 w-4 text-indigo-500" />
            اعلان‌های جدید
          </h3>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600">{toPersianDigits(unreadNotifs)}</span>
        </div>
        {recentNotifs.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-400">اعلانی وجود ندارد.</p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {recentNotifs.map((n) => (
              <li key={n.id} className={`px-6 py-4 ${!n.isRead ? "bg-indigo-50/30" : ""}`}>
                <p className="text-[13px] font-semibold">{n.title}</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">{n.message}</p>
                <p className="mt-1.5 text-[10px] text-slate-400">{formatPersianDate(n.createdAt, true)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="flex items-center gap-2 text-[15px] font-bold">
            <MessageSquare className="h-4 w-4 text-cyan-500" />
            آخرین پیام‌ها
          </h3>
        </div>
        {recentMessages.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-400">پیامی وجود ندارد.</p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {recentMessages.map((m) => (
              <li key={m.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold">{m.senderName}</p>
                  <p className="text-[11px] text-slate-400">{formatPersianDate(m.createdAt, true)}</p>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-7 text-slate-500">{m.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50/50 p-6">
        <h3 className="font-bold text-indigo-900">راهنمای سریع</h3>
        <p className="mt-2 text-[13px] leading-7 text-indigo-900/70">
          برای ثبت درخواست جدید، ابتدا خدمت موردنظر را انتخاب کنید و سپس جزئیات پژوهش و فایل‌های مرتبط را بارگذاری کنید.
        </p>
        <Link href="/how-it-works" className="mt-4 inline-block text-[13px] font-semibold text-indigo-700 hover:underline">
          مشاهده راهنمای کامل ←
        </Link>
      </div>
    </div>
  );
}
