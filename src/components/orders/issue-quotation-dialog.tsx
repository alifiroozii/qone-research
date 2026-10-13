"use client";

import React, { useState } from "react";
import { Receipt, Plus, Trash2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import type { Order } from "@/types";

export function IssueQuotationButton({ order }: { order: Order }) {
  const { repo, refresh } = useData();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ description: string; unitPrice: number; quantity: number }[]>([
    { description: order.serviceTitle, unitPrice: order.agreedPrice ?? 5000000, quantity: 1 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState(10);
  const [revisions, setRevisions] = useState(2);

  const total = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const payable = Math.max(0, total - discount);

  const submit = () => {
    repo.issueQuotation(
      order.id,
      { items, discountAmount: discount, deliveryDays, includedRevisions: revisions, terms: `زمان تحویل ${deliveryDays} روز. شامل ${revisions} نوبت اصلاح رایگان.` },
      "مدیر کل"
    );
    refresh();
    setOpen(false);
    toast({ title: "پیش‌فاکتور صادر شد", description: `مبلغ قابل پرداخت: ${payable.toLocaleString("fa-IR")} تومان`, variant: "success" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient">
          <Receipt className="h-4 w-4" />
          صدور پیش‌فاکتور
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>صدور پیش‌فاکتور — {order.trackingCode}</DialogTitle>
        </DialogHeader>
        <QuoteForm
          items={items}
          setItems={setItems}
          discount={discount}
          setDiscount={setDiscount}
          deliveryDays={deliveryDays}
          setDeliveryDays={setDeliveryDays}
          revisions={revisions}
          setRevisions={setRevisions}
          total={total}
          payable={payable}
          onSubmit={submit}
        />
      </DialogContent>
    </Dialog>
  );
}

function QuoteForm({
  items, setItems, discount, setDiscount, deliveryDays, setDeliveryDays, revisions, setRevisions, total, payable, onSubmit,
}: {
  items: { description: string; unitPrice: number; quantity: number }[];
  setItems: React.Dispatch<React.SetStateAction<{ description: string; unitPrice: number; quantity: number }[]>>;
  discount: number;
  setDiscount: (v: number) => void;
  deliveryDays: number;
  setDeliveryDays: (v: number) => void;
  revisions: number;
  setRevisions: (v: number) => void;
  total: number;
  payable: number;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>ردیف‌های هزینه</Label>
          <button
            type="button"
            onClick={() => setItems((its) => [...its, { description: "", unitPrice: 0, quantity: 1 }])}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-indigo-600 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            افزودن ردیف
          </button>
        </div>

        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 rounded-xl border border-slate-200 p-3">
            <div className="col-span-12 sm:col-span-6">
              <Input
                value={it.description}
                onChange={(e) => setItems((its) => its.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
                placeholder="شرح خدمات"
              />
            </div>
            <div className="col-span-5 sm:col-span-2">
              <Input
                type="number"
                dir="ltr"
                className="text-left"
                value={it.unitPrice || ""}
                onChange={(e) => setItems((its) => its.map((x, j) => (j === i ? { ...x, unitPrice: Number(e.target.value) || 0 } : x)))}
                placeholder="قیمت"
              />
            </div>
            <div className="col-span-5 sm:col-span-2">
              <Input
                type="number"
                dir="ltr"
                className="text-left"
                value={it.quantity}
                onChange={(e) => setItems((its) => its.map((x, j) => (j === i ? { ...x, quantity: Number(e.target.value) || 1 } : x)))}
              />
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setItems((its) => its.filter((_, j) => j !== i))}
                disabled={items.length === 1}
                className="text-slate-400 hover:text-red-500 disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>تخفیف (تومان)</Label>
          <Input type="number" dir="ltr" className="text-left" value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>زمان تحویل (روز)</Label>
          <Input type="number" dir="ltr" className="text-left" value={deliveryDays} onChange={(e) => setDeliveryDays(Number(e.target.value) || 1)} />
        </div>
        <div className="space-y-2">
          <Label>تعداد اصلاحات مجاز</Label>
          <Input type="number" dir="ltr" className="text-left" value={revisions} onChange={(e) => setRevisions(Number(e.target.value) || 0)} />
        </div>
      </div>

      <div className="rounded-xl bg-indigo-50 p-4">
        <div className="flex justify-between text-[13px]">
          <span className="text-slate-500">مجموع</span>
          <span className="font-semibold">{total.toLocaleString("fa-IR")} تومان</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-indigo-100 pt-2 text-[14px]">
          <span className="font-bold">مبلغ قابل پرداخت</span>
          <span className="font-black text-indigo-700">{payable.toLocaleString("fa-IR")} تومان</span>
        </div>
      </div>

      <Button variant="gradient" className="w-full" onClick={onSubmit}>
        <Send className="h-4 w-4" />
        صدور و ارسال پیش‌فاکتور
      </Button>
    </div>
  );
}
