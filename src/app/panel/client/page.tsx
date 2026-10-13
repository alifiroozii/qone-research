"use client";

import React from "react";
import Link from "next/link";
import {
  ClipboardList, PlayCircle, CheckCircle2, CreditCard, MessageSquare,
  PlusCircle, ArrowLeft,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { toPersianDigits } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { OrdersOverview } from "@/components/orders/client-orders-overview";
import { ClientSidePanels } from "@/components/orders/client-side-panels";

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const { db } = useData();

  const myOrders = db.orders.filter((o) => o.clientId === user?.id);
  const active = myOrders.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status));
  const completed = myOrders.filter((o) => o.status === "COMPLETED");
  const pendingPayments = myOrders.filter((o) => o.status === "AWAITING_PAYMENT");
  const myOrderIds = new Set(myOrders.map((o) => o.id));
  const unreadMessages = db.messages.filter((m) => myOrderIds.has(m.orderId) && m.senderId !== user?.id && !m.isRead);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black md:text-2xl">سلام {user?.name} 👋</h2>
          <p className="mt-1.5 text-sm text-slate-500">وضعیت سفارش‌ها و فعالیت‌های شما در یک نگاه.</p>
        </div>
        <Link href="/panel/client/new-request">
          <Button variant="gradient" className="group">
            <PlusCircle className="h-4 w-4" />
            ثبت درخواست جدید
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="کل درخواست‌ها" value={toPersianDigits(myOrders.length)} icon={ClipboardList} tone="indigo" />
        <StatCard label="سفارش‌های فعال" value={toPersianDigits(active.length)} icon={PlayCircle} tone="cyan" />
        <StatCard label="تکمیل‌شده" value={toPersianDigits(completed.length)} icon={CheckCircle2} tone="emerald" />
        <StatCard label="پرداخت در انتظار" value={toPersianDigits(pendingPayments.length)} icon={CreditCard} tone="amber" />
        <StatCard label="پیام خوانده‌نشده" value={toPersianDigits(unreadMessages.length)} icon={MessageSquare} tone="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrdersOverview orders={myOrders.slice(0, 5)} />
        </div>
        <ClientSidePanels />
      </div>
    </div>
  );
}
