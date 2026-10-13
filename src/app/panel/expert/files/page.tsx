"use client";

import React from "react";
import { FolderOpen, Download } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { formatPersianDate, formatFileSize } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { fileIconFor } from "@/components/orders/new-request-steps";

export default function ExpertFilesPage() {
  const { user } = useAuth();
  const { db } = useData();
  const { toast } = useToast();

  const assignedIds = new Set(db.orders.filter((o) => o.expertId === user?.id).map((o) => o.id));
  const files = db.files.filter((f) => assignedIds.has(f.orderId));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">فایل‌ها</h2>
        <p className="mt-1.5 text-sm text-slate-500">فایل‌های مرتبط با پروژه‌های شما.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle">
        {files.length === 0 ? (
          <EmptyState icon={FolderOpen} title="فایلی موجود نیست" />
        ) : (
          <ul className="divide-y divide-slate-50">
            {files.map((f) => {
              const Icon = fileIconFor(f.fileName);
              return (
                <li key={f.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">{f.fileName}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{formatFileSize(f.fileSize)} · {f.uploaderName} · {formatPersianDate(f.createdAt)}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "دانلود در حالت نمایشی", description: "فایل واقعی ذخیره نشده است.", variant: "warning" })}>
                    <Download className="h-3.5 w-3.5" />
                    دانلود
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
