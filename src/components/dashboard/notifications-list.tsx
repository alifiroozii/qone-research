"use client";

import React from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { formatPersianDate } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotificationsList() {
  const { user } = useAuth();
  const { db, repo, refresh } = useData();
  const { toast } = useToast();

  const notifs = db.notifications.filter((n) => n.userId === user?.id);
  const unread = notifs.filter((n) => !n.isRead).length;

  const markAll = () => {
    if (!user) return;
    repo.markAllNotificationsRead(user.id);
    refresh();
    toast({ title: "همه اعلان‌ها خوانده شد", variant: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black md:text-2xl">اعلان‌ها</h2>
          <p className="mt-1.5 text-sm text-slate-500">رویدادهای مهم مربوط به حساب شما.</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" onClick={markAll}>
            <CheckCheck className="h-4 w-4" />
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {notifs.length === 0 ? (
          <EmptyState icon={Bell} title="اعلانی وجود ندارد" description="اعلان‌های مربوط به سفارش‌ها، پرداخت‌ها و پیام‌ها اینجا نمایش داده می‌شوند." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {notifs.map((n) => (
              <li key={n.id} className={cn("px-6 py-4 transition-colors hover:bg-slate-50/50", !n.isRead && "bg-indigo-50/30")}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {!n.isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                    <div>
                      <p className="text-[14px] font-semibold">{n.title}</p>
                      <p className="mt-1 text-[12.5px] leading-7 text-slate-500">{n.message}</p>
                      <p className="mt-1.5 text-[11px] text-slate-400">{formatPersianDate(n.createdAt, true)}</p>
                      {n.link && (
                        <Link href={n.link} className="mt-2 inline-block text-[12px] font-semibold text-indigo-600 hover:underline">
                          مشاهده ←
                        </Link>
                      )}
                    </div>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => { repo.markNotificationRead(n.id); refresh(); }}
                      className="shrink-0 text-[11px] text-slate-400 hover:text-indigo-600"
                    >
                      خواندم
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
