"use client";

import React, { useState } from "react";
import { Send, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { formatPersianDate, formatFileSize } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn } from "@/lib/utils";
import type { Order, Role } from "@/types";
import { fileIconFor } from "@/components/orders/new-request-steps";

export function MessagesTab({ order }: { order: Order }) {
  const { user } = useAuth();
  const { repo, refresh } = useData();
  const { toast } = useToast();
  const [text, setText] = useState("");

  const messages = [...order.messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const send = () => {
    if (!text.trim() || !user) return;
    repo.sendMessage(order.id, { id: user.id, name: user.name, role: user.role as Role }, text.trim());
    refresh();
    setText("");
    toast({ title: "پیام ارسال شد", variant: "success" });
  };

  return (
    <div className="flex h-[520px] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-1">
        {messages.length === 0 && (
          <EmptyState icon={Send} title="هنوز پیامی رد و بدل نشده" description="اولین پیام را برای شروع گفت‌وگو ارسال کنید." />
        )}
        {messages.map((m) => {
          const mine = m.senderId === user?.id;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-start" : "justify-end")}>
              <div className={cn(
                "max-w-[78%] rounded-2xl px-4 py-3",
                mine ? "bg-gradient-to-l from-indigo-600 to-cyan-500 text-white rounded-bl-md" : "bg-slate-100 text-slate-800 rounded-br-md"
              )}>
                <p className={cn("text-[11px] font-semibold", mine ? "text-white/75" : "text-slate-500")}>{m.senderName}</p>
                <p className="mt-1 text-[13.5px] leading-8 whitespace-pre-wrap">{m.content}</p>
                <p className={cn("mt-1.5 text-[10px]", mine ? "text-white/60" : "text-slate-400")}>{formatPersianDate(m.createdAt, true)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-end gap-2 border-t border-slate-100 pt-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder="پیام خود را بنویسید… (Enter برای ارسال)"
          className="flex-1 resize-none"
        />
        <Button variant="gradient" onClick={send} disabled={!text.trim()} className="h-[52px]">
          <Send className="h-4 w-4" />
          ارسال
        </Button>
      </div>
    </div>
  );
}

export function FilesTab({ order }: { order: Order }) {
  const { toast } = useToast();
  if (!order.files.length) {
    return <EmptyState icon={FileText} title="فایلی موجود نیست" description="فایل‌های ارسالی و دریافتی این سفارش در اینجا نمایش داده می‌شوند." />;
  }
  return (
    <ul className="space-y-3">
      {order.files.map((f) => {
        const Icon = fileIconFor(f.fileName);
        return (
          <li key={f.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold">{f.fileName}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {formatFileSize(f.fileSize)} · {f.uploaderName} · {formatPersianDate(f.createdAt)}
              </p>
            </div>
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold",
              f.category === "DELIVERABLE" ? "bg-emerald-50 text-emerald-600" : f.category === "REVISION" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
            )}>
              {f.category === "DELIVERABLE" ? "خروجی" : f.category === "REVISION" ? "نسخه اصلاحی" : "فایل مشتری"}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast({ title: "دانلود در حالت نمایشی", description: "فایل واقعی در سرور ذخیره نشده است.", variant: "warning" })}
            >
              <Download className="h-3.5 w-3.5" />
              دانلود
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
