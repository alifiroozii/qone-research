"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CreditCard, Check, X, Info, ClipboardList } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { OrderStatusBadge, TrackingCode, PaymentBadge } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatToman } from "@/lib/utils/formatters";
import { OrderDetailTabs } from "@/components/orders/order-detail-tabs";

export default function ClientOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { db, repo, refresh } = useData();
  const { toast } = useToast();

  const order = db.orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white">
        <EmptyState icon={ClipboardList} title="سفارش یافت نشد" description="ممکن است این سفارش متعلق به شما نباشد." action={{ label: "بازگشت", href: "/panel/client/orders" }} />
      </div>
    );
  }

  const q = order.quotations[0];
  const canAcceptQuote = q && q.status === "PENDING" && order.status === "QUOTED";
  const canPay = order.status === "AWAITING_PAYMENT" && !order.isPaid && !!order.agreedPrice;

  const acceptQuote = () => {
    repo.acceptQuotation(q!.id);
    refresh();
    toast({ title: "پیش‌فاکتور تأیید شد", description: "حالا می‌توانید پرداخت آزمایشی را انجام دهید.", variant: "success" });
  };

  const rejectQuote = () => {
    repo.rejectQuotation(q!.id);
    refresh();
    toast({ title: "پیش‌فاکتور رد شد", description: "وضعیت سفارش برای بازبینی تغییر کرد.", variant: "warning" });
  };

  const payDemo = () => {
    repo.demoPay(order.id);
    refresh();
    toast({ title: "پرداخت آزمایشی ثبت شد", description: "این تراکنش صرفاً نمایشی است.", variant: "success" });
  };

  return (
    <div className="space-y-6">
      <Link href="/panel/client/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary">
        <ArrowRight className="h-4 w-4" />
        بازگشت به سفارش‌ها
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <TrackingCode code={order.trackingCode} />
              <OrderStatusBadge status={order.status} />
              <PaymentBadge paid={order.isPaid} />
            </div>
            <h2 className="mt-3 text-lg font-black md:text-xl">{order.title}</h2>
            <p className="mt-1.5 text-[13px] text-slate-500">{order.serviceTitle}</p>
          </div>
          {order.agreedPrice != null && (
            <div className="rounded-xl bg-indigo-50 px-5 py-3 text-center">
              <p className="text-[11px] text-indigo-500">مبلغ</p>
              <p className="mt-1 text-lg font-black text-indigo-700">{formatToman(order.agreedPrice)}</p>
            </div>
          )}
        </div>

        {(canAcceptQuote || canPay) && (
          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
            {canAcceptQuote && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                  <div>
                    <p className="text-[14px] font-bold text-indigo-900">پیش‌فاکتور منتظر تأیید شماست</p>
                    <p className="mt-1 text-[12.5px] leading-7 text-indigo-800/75">
                      مبلغ قابل پرداخت: {formatToman(q!.payableAmount)} — پس از تأیید، امکان پرداخت فعال می‌شود.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={rejectQuote} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium hover:bg-muted">
                    <X className="h-4 w-4" /> رد پیش‌فاکتور
                  </button>
                  <button onClick={acceptQuote} className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-l from-indigo-600 to-cyan-500 px-4 text-sm font-medium text-white shadow-sm hover:brightness-110">
                    <Check className="h-4 w-4" /> تأیید پیش‌فاکتور
                  </button>
                </div>
              </div>
            )}
            {canPay && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                  <div>
                    <p className="text-[14px] font-bold text-indigo-900">در انتظار پرداخت</p>
                    <p className="mt-1 text-[12.5px] text-indigo-800/75">پس از پرداخت، سفارش به کارشناس ارجاع داده می‌شود.</p>
                  </div>
                </div>
                <button onClick={payDemo} className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-l from-indigo-600 to-cyan-500 px-4 text-sm font-medium text-white shadow-sm hover:brightness-110">
                  <CreditCard className="h-4 w-4" />
                  پرداخت آزمایشی {formatToman(order.agreedPrice!)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <OrderDetailTabs order={order} canEditMilestones={false} />
    </div>
  );
}
