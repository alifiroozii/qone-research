"use client";

import React, { useState } from "react";
import { LifeBuoy, Send } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { formatPersianDate } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CATEGORIES = ["سفارش‌ها", "پرداخت", "فنی", "سایر"];

export default function ClientSupportPage() {
  const { user } = useAuth();
  const { db, repo, refresh } = useData();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const myTickets = db.supportTickets.filter((t) => t.userId === user?.id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !user) {
      toast({ title: "خطا", description: "موضوع و متن تیکت را وارد کنید.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      repo.createSupportTicket({ userId: user.id, subject: subject.trim(), category, message: message.trim() });
      refresh();
      setLoading(false);
      setSubject("");
      setMessage("");
      toast({ title: "تیکت پشتیبانی ثبت شد", description: "کارشناسان پشتیبانی به‌زودی پاسخ می‌دهند.", variant: "success" });
    }, 500);
  };

  const statusCls = (s: string) =>
    s === "OPEN" ? "bg-blue-50 text-blue-600" : s === "IN_PROGRESS" ? "bg-amber-50 text-amber-600" : s === "CLOSED" || s === "RESOLVED" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500";
  const statusLabel = (s: string) =>
    s === "OPEN" ? "باز" : s === "IN_PROGRESS" ? "در حال بررسی" : s === "WAITING_USER" ? "در انتظار پاسخ شما" : s === "RESOLVED" ? "حل‌شده" : "بسته‌شده";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پشتیبانی</h2>
        <p className="mt-1.5 text-sm text-slate-500">تیکت جدید ثبت کنید یا وضعیت تیکت‌های قبلی را دنبال کنید.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h3 className="font-bold">ثبت تیکت جدید</h3>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label>موضوع</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="موضوع تیکت" />
            </div>
            <div className="space-y-2">
              <Label>دسته‌بندی</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>شرح مسئله</Label>
              <Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="مشکل یا درخواست خود را شرح دهید…" />
            </div>
            <Button type="submit" variant="gradient" loading={loading} className="w-full">
              <Send className="h-4 w-4" />
              ارسال تیکت
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-bold">تیکت‌های من ({myTickets.length})</h3>
            </div>
            {myTickets.length === 0 ? (
              <EmptyState icon={LifeBuoy} title="تیکتی ثبت نکرده‌اید" />
            ) : (
              <ul className="divide-y divide-slate-50">
                {myTickets.map((t) => (
                  <li key={t.id} className="px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="num ltr rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{t.ticketNumber}</span>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold", statusCls(t.status))}>{statusLabel(t.status)}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{formatPersianDate(t.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-[14px] font-semibold">{t.subject}</p>
                    <div className="mt-3 space-y-2">
                      {t.messages.map((m) => (
                        <div key={m.id} className={cn("rounded-xl p-3 text-[12.5px] leading-7", m.senderRole === "ADMIN" ? "bg-indigo-50 text-indigo-900" : "bg-slate-50 text-slate-700")}>
                          <p className="text-[11px] font-bold opacity-70">{m.senderName}</p>
                          <p className="mt-1">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle", className)}>{children}</div>;
}
