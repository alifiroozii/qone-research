"use client";

import React, { useState } from "react";
import { LifeBuoy, Send } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatPersianDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export default function AdminSupportPage() {
  const { db, repo, refresh } = useData();
  const { toast } = useToast();
  const [reply, setReply] = useState<Record<string, string>>({});

  const sendReply = (ticketId: string) => {
    const text = (reply[ticketId] ?? "").trim();
    if (!text) return;
    repo.addTicketReply(ticketId, { id: "usr-admin-1", name: "مدیر کل", role: "ADMIN" }, text);
    refresh();
    setReply((r) => ({ ...r, [ticketId]: "" }));
    toast({ title: "پاسخ ثبت شد", variant: "success" });
  };

  const statusCls = (s: string) =>
    s === "OPEN" ? "bg-blue-50 text-blue-600" : s === "IN_PROGRESS" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600";
  const statusLabel = (s: string) => s === "OPEN" ? "باز" : s === "IN_PROGRESS" ? "در حال بررسی" : "حل‌شده/بسته";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پشتیبانی</h2>
        <p className="mt-1.5 text-sm text-slate-500">تیکت‌های کاربران و پاسخ مدیریت.</p>
      </div>

      {db.supportTickets.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState icon={LifeBuoy} title="تیکتی وجود ندارد" />
        </div>
      ) : (
        <div className="space-y-5">
          {db.supportTickets.map((t) => (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="num ltr rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{t.ticketNumber}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold", statusCls(t.status))}>{statusLabel(t.status)}</span>
                  <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[10.5px] font-medium text-slate-500">{t.category}</span>
                </div>
                <span className="text-[11px] text-slate-400">{t.userName} · {formatPersianDate(t.createdAt)}</span>
              </div>
              <h3 className="mt-3 text-[15px] font-bold">{t.subject}</h3>

              <div className="mt-4 space-y-2">
                {t.messages.map((m) => (
                  <div key={m.id} className={cn("rounded-xl p-3.5 text-[12.5px] leading-7", m.senderRole === "ADMIN" ? "bg-indigo-50 text-indigo-900" : "bg-slate-50 text-slate-700")}>
                    <p className="text-[11px] font-bold opacity-70">{m.senderName}</p>
                    <p className="mt-1">{m.message}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-end gap-2">
                <Textarea
                  rows={2}
                  value={reply[t.id] ?? ""}
                  onChange={(e) => setReply((r) => ({ ...r, [t.id]: e.target.value }))}
                  placeholder="پاسخ به این تیکت…"
                  className="flex-1 resize-none"
                />
                <Button variant="gradient" onClick={() => sendReply(t.id)} disabled={!(reply[t.id] ?? "").trim()} className="h-[52px]">
                  <Send className="h-4 w-4" />
                  پاسخ
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
