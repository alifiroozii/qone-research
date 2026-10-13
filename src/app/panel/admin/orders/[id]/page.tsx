"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ClipboardList, XCircle, CheckCircle2 } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { OrderStatusBadge, TrackingCode, PaymentBadge } from "@/components/orders/order-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { OrderDetailTabs } from "@/components/orders/order-detail-tabs";
import { IssueQuotationButton } from "@/components/orders/issue-quotation-dialog";
import { AssignExpertButton } from "@/components/orders/assign-expert-dialog";
import { formatToman, formatPersianDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { db, repo, refresh } = useData();
  const { toast } = useToast();

  const order = db.orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white">
        <EmptyState icon={ClipboardList} title="سفارش یافت نشد" action={{ label: "بازگشت", href: "/panel/admin/orders" }} />
      </div>
    );
  }

  const needsQuote = ["SUBMITTED", "PENDING_REVIEW", "REQUIRES_INFO"].includes(order.status);
  const canComplete = ["READY_FOR_DELIVERY", "READY_FOR_REVIEW", "REVISION_REQUESTED", "IN_PROGRESS"].includes(order.status);
  const canCancel = !["COMPLETED", "CANCELLED"].includes(order.status);

  const complete = () => {
    repo.setOrderStatus(order.id, "COMPLETED", "مدیر کل", "تأیید تحویل نهایی توسط مدیر");
    refresh();
    toast({ title: "سفارش تکمیل شد", variant: "success" });
  };

  const cancel = () => {
    repo.setOrderStatus(order.id, "CANCELLED", "مدیر کل", "لغو سفارش توسط مدیر");
    refresh();
    toast({ title: "سفارش لغو شد", variant: "warning" });
  };

  return (
    <div className="space-y-6">
      <Link href="/panel/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary">
        <ArrowRight className="h-4 w-4" />
        بازگشت به مدیریت سفارش‌ها
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
            <p className="mt-1.5 text-[13px] text-slate-500">
              {order.serviceTitle} · مشتری: {order.clientName} · ثبت: {formatPersianDate(order.createdAt)}
            </p>
            {order.expertName && <p className="mt-1 text-[13px] text-slate-500">کارشناس: {order.expertName}</p>}
          </div>
          {order.agreedPrice != null && (
            <div className="rounded-xl bg-indigo-50 px-5 py-3 text-center">
              <p className="text-[11px] text-indigo-500">مبلغ</p>
              <p className="mt-1 text-lg font-black text-indigo-700">{formatToman(order.agreedPrice)}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
          {needsQuote && <IssueQuotationButton order={order} />}
          {order.isPaid && !order.expertId && <AssignExpertButton order={order} />}
          {canComplete && (
            <Button variant="success" onClick={complete}>
              <CheckCircle2 className="h-4 w-4" />
              تأیید و تکمیل سفارش
            </Button>
          )}
          {canCancel && (
            <Button variant="outline" onClick={cancel}>
              <XCircle className="h-4 w-4" />
              لغو سفارش
            </Button>
          )}
        </div>
      </div>

      <OrderDetailTabs order={order} canEditMilestones={false} />
    </div>
  );
}
