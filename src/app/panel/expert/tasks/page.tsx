"use client";

import React from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { EmptyState } from "@/components/dashboard/empty-state";
import { OrderStatusBadge, TrackingCode } from "@/components/orders/order-badges";
import { Progress } from "@/components/ui/progress";
import { toPersianDigits } from "@/lib/utils/formatters";
import { progressOf } from "@/components/orders/client-orders-overview";

export default function ExpertTasksPage() {
  const { user } = useAuth();
  const { db } = useData();

  const orders = db.orders.filter((o) => o.expertId === user?.id && !["COMPLETED", "CANCELLED"].includes(o.status));
  const allTasks = orders.flatMap((o) =>
    o.milestones.filter((m) => m.status !== "COMPLETED").map((m) => ({ order: o, milestone: m }))
  ).slice(0, 12);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">وظایف من</h2>
        <p className="mt-1.5 text-sm text-slate-500">مراحل ناتمامی که نیاز به اقدام شما دارند.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {allTasks.length === 0 ? (
          <EmptyState icon={ClipboardList} title="وظیفه‌ای باقی نمانده" description="همه مراحل پروژه‌های شما تکمیل شده است. آفرین!" />
        ) : (
          <ul className="divide-y divide-slate-50">
            {allTasks.map(({ order, milestone }) => (
              <li key={milestone.id}>
                <Link href={`/panel/expert/assigned/${order.id}`} className="block px-6 py-4 transition-colors hover:bg-slate-50/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TrackingCode code={order.trackingCode} />
                        <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${milestone.status === "IN_PROGRESS" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                          {milestone.status === "IN_PROGRESS" ? "در حال انجام" : "در انتظار شروع"}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] font-semibold">{milestone.title}</p>
                      <p className="mt-1 truncate text-[12px] text-slate-400">{order.title}</p>
                    </div>
                    <div className="w-36">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>پیشرفت پروژه</span>
                        <span className="num">{toPersianDigits(progressOf(order.milestones))}٪</span>
                      </div>
                      <Progress value={progressOf(order.milestones)} className="mt-1 h-1.5" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
