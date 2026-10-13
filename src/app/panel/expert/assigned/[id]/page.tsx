"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ClipboardList, ShieldAlert } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { OrderStatusBadge, TrackingCode, PaymentBadge } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { OrderDetailTabs } from "@/components/orders/order-detail-tabs";
import { formatPersianDate } from "@/lib/utils/formatters";

export default function ExpertOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { db } = useData();
  const order = db.orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white">
        <EmptyState icon={ClipboardList} title="پروژه یافت نشد" action={{ label: "بازگشت", href: "/panel/expert/assigned" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/panel/expert/assigned" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary">
        <ArrowRight className="h-4 w-4" />
        بازگشت به پروژه‌ها
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <div className="flex flex-wrap items-center gap-2.5">
          <TrackingCode code={order.trackingCode} />
          <OrderStatusBadge status={order.status} />
          <PaymentBadge paid={order.isPaid} />
        </div>
        <h2 className="mt-3 text-lg font-black md:text-xl">{order.title}</h2>
        <p className="mt-1.5 text-[13px] text-slate-500">
          {order.serviceTitle} · مشتری: {order.clientName} · ثبت: {formatPersianDate(order.createdAt)}
        </p>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-7 text-amber-800">
          <ShieldAlert className="mt-1 h-4 w-4 shrink-0" />
          <span>اطلاعات مشتری فقط برای انجام این پروژه در دسترس شماست. هرگونه استفاده خارج از چارچوب پروژه مجاز نیست.</span>
        </div>
      </div>

      <OrderDetailTabs order={order} canEditMilestones={true} />
    </div>
  );
}
