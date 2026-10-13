"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Check, Upload, X, FileText, FileSpreadsheet, FileArchive,
  Image as ImageIcon, File, PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getServiceIcon } from "@/lib/utils/service-icons";
import { formatFileSize, formatToman, formatPersianDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";

export interface RequestForm {
  title: string;
  fieldOfStudy: string;
  degreeLevel: string;
  subject: string;
  language: "fa" | "en" | "bilingual";
  workVolume: string;
  targetDeadline: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  notes: string;
}

export function fileIconFor(name: string) {
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return FileText;
  if (n.endsWith(".xlsx") || n.endsWith(".xls")) return FileSpreadsheet;
  if (n.endsWith(".zip")) return FileArchive;
  if (n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png")) return ImageIcon;
  return File;
}

export function StepService({ services, serviceId, onSelect }: { services: ServiceItem[]; serviceId: string; onSelect: (id: string) => void }) {
  return (
    <div>
      <h3 className="text-base font-bold">مرحله ۱ — انتخاب خدمت</h3>
      <p className="mt-1.5 text-[13px] text-slate-500">خدمت موردنظر خود را از فهرست زیر انتخاب کنید.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map((s) => {
          const Icon = getServiceIcon(s.iconName);
          const active = s.id === serviceId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={cn(
                "group rounded-xl border p-4 text-right transition-all",
                active ? "border-indigo-400 bg-indigo-50/60 ring-2 ring-indigo-200" : "border-slate-200 bg-white hover:border-indigo-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", active ? "bg-indigo-600 text-white" : "bg-slate-50 text-indigo-600")}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold">{s.title}</p>
                    {active && <Check className="h-4 w-4 text-indigo-600" />}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-6 text-slate-500">{s.shortDesc}</p>
                  <p className="mt-2 text-[11px] text-slate-400">قیمت از {formatToman(s.basePrice)} · {s.turnaroundDays} روز</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepDetails({ form, setForm }: { form: RequestForm; setForm: React.Dispatch<React.SetStateAction<RequestForm>> }) {
  const upd = (patch: Partial<RequestForm>) => setForm((f) => ({ ...f, ...patch }));
  return (
    <div>
      <h3 className="text-base font-bold">مرحله ۲ — اطلاعات درخواست</h3>
      <p className="mt-1.5 text-[13px] text-slate-500">جزئیات پژوهش خود را دقیق وارد کنید تا بررسی تخصصی سریع‌تر انجام شود.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="f-title">عنوان درخواست *</Label>
          <Input id="f-title" value={form.title} onChange={(e) => upd({ title: e.target.value })} placeholder="مثال: ویرایش علمی مقاله ISI روان‌شناسی" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="f-field">رشته تحصیلی *</Label>
          <Input id="f-field" value={form.fieldOfStudy} onChange={(e) => upd({ fieldOfStudy: e.target.value })} placeholder="مثال: روان‌شناسی" required />
        </div>

        <div className="space-y-2">
          <Label>مقطع تحصیلی *</Label>
          <Select value={form.degreeLevel} onValueChange={(v) => upd({ degreeLevel: v })}>
            <SelectTrigger><SelectValue placeholder="انتخاب مقطع" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="کارشناسی">کارشناسی</SelectItem>
              <SelectItem value="کارشناسی ارشد">کارشناسی ارشد</SelectItem>
              <SelectItem value="دکتری">دکتری</SelectItem>
              <SelectItem value="سایر">سایر</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="f-subject">موضوع</Label>
          <Input id="f-subject" value={form.subject} onChange={(e) => upd({ subject: e.target.value })} placeholder="موضوع یا محور اصلی پژوهش" />
        </div>

        <div className="space-y-2">
          <Label>زبان موردنیاز</Label>
          <Select value={form.language} onValueChange={(v) => upd({ language: v as RequestForm["language"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fa">فارسی</SelectItem>
              <SelectItem value="en">انگلیسی</SelectItem>
              <SelectItem value="bilingual">دو زبانه</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="f-volume">تعداد صفحات / حجم کار</Label>
          <Input id="f-volume" value={form.workVolume} onChange={(e) => upd({ workVolume: e.target.value })} placeholder="مثال: ۲۰ صفحه" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="f-deadline">مهلت موردنظر</Label>
          <Input id="f-deadline" type="date" dir="ltr" className="text-left" value={form.targetDeadline} onChange={(e) => upd({ targetDeadline: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label>میزان فوریت</Label>
          <Select value={form.priority} onValueChange={(v) => upd({ priority: v as RequestForm["priority"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">کم</SelectItem>
              <SelectItem value="NORMAL">معمولی</SelectItem>
              <SelectItem value="HIGH">زیاد</SelectItem>
              <SelectItem value="URGENT">فوری</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="f-notes">توضیحات تکمیلی</Label>
          <Textarea id="f-notes" rows={4} value={form.notes} onChange={(e) => upd({ notes: e.target.value })} placeholder="هر اطلاعاتی که به درک بهتر درخواست شما کمک کند…" />
        </div>

      </div>
    </div>
  );
}

export function StepFiles({
  files,
  uploading,
  dragOver,
  setDragOver,
  fileInput,
  addFiles,
  removeFile,
}: {
  files: { name: string; size: number }[];
  uploading: boolean;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  fileInput: React.RefObject<HTMLInputElement | null>;
  addFiles: (list: FileList | null) => void;
  removeFile: (index: number) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-bold">مرحله ۳ — بارگذاری فایل</h3>
      <p className="mt-1.5 text-[13px] text-slate-500">
        فایل‌های مرتبط (PDF، Word، Excel، PowerPoint، ZIP یا تصویر) را اضافه کنید. در حالت نمایشی فقط اطلاعات فایل ذخیره می‌شود.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onClick={() => fileInput.current?.click()}
        className={cn(
          "mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all",
          dragOver ? "border-indigo-400 bg-indigo-50/60" : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30"
        )}
      >
        <input
          ref={fileInput}
          type="file"
          multiple
          accept=".pdf,.docx,.xlsx,.pptx,.zip,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Upload className="h-7 w-7" />
        </div>
        <p className="mt-4 text-[14px] font-bold">فایل‌ها را اینجا رها کنید یا کلیک کنید</p>
        <p className="mt-1.5 text-xs text-slate-400">PDF، DOCX، XLSX، PPTX، ZIP، JPG، PNG — حداکثر ۲۰ مگابایت</p>
        {uploading && <p className="mt-3 text-xs text-indigo-600">در حال پردازش فایل‌ها…</p>}
      </div>

      {files.length > 0 && (
        <ul className="mt-5 space-y-2">
          {files.map((f, i) => {
            const Icon = fileIconFor(f.name);
            return (
              <motion.li
                key={`${f.name}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{f.name}</p>
                  <p className="num mt-0.5 text-[11px] text-slate-400">{formatFileSize(f.size)} · آماده</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">کامل</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label="حذف فایل"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function StepReview({ service, form, files }: { service?: ServiceItem; form: RequestForm; files: { name: string; size: number }[] }) {
  const rows: { label: string; value: string }[] = [
    { label: "عنوان درخواست", value: form.title || "—" },
    { label: "نوع خدمت", value: service?.title ?? "—" },
    { label: "رشته تحصیلی", value: form.fieldOfStudy || "—" },
    { label: "مقطع تحصیلی", value: form.degreeLevel || "—" },
    { label: "موضوع", value: form.subject || "—" },
    { label: "زبان", value: form.language === "fa" ? "فارسی" : form.language === "en" ? "انگلیسی" : "دو زبانه" },
    { label: "حجم کار", value: form.workVolume || "—" },
    { label: "مهلت موردنظر", value: form.targetDeadline || "—" },
    { label: "فوریت", value: form.priority === "LOW" ? "کم" : form.priority === "NORMAL" ? "معمولی" : form.priority === "HIGH" ? "زیاد" : "فوری" },
    { label: "توضیحات", value: form.notes || "—" },
  ];

  return (
    <div>
      <h3 className="text-base font-bold">مرحله ۴ — بازبینی اطلاعات</h3>
      <p className="mt-1.5 text-[13px] text-slate-500">پیش از ثبت نهایی، اطلاعات را بررسی کنید. برای ویرایش، از دکمه «قبلی» استفاده کنید.</p>

      <dl className="mt-6 grid gap-x-8 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="border-b border-slate-100 py-3">
            <dt className="text-[12px] text-slate-400">{r.label}</dt>
            <dd className="mt-1 text-[13.5px] font-semibold leading-7">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <p className="text-[12px] text-slate-400">فایل‌های پیوست ({files.length})</p>
        {files.length === 0 ? (
          <p className="mt-2 text-[13px] text-slate-500">فایلی پیوست نشده است.</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {files.map((f, i) => {
              const Icon = fileIconFor(f.name);
              return (
                <li key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px]">
                  <Icon className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="max-w-40 truncate">{f.name}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function StepDone({ onGoOrders }: { onGoOrders: () => void }) {
  return (
    <div className="py-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
      >
        <PartyPopper className="h-10 w-10 text-success" />
      </motion.div>
      <h3 className="mt-6 text-lg font-black">درخواست شما با موفقیت ثبت شد 🎉</h3>
      <p className="mx-auto mt-3 max-w-md text-[14px] leading-8 text-slate-500">
        کد پیگیری یکتای شما در لیست سفارش‌ها ایجاد شد. تیم کارشناسی در اسرع وقت درخواست را بررسی می‌کند و پیش‌فاکتور برای شما صادر خواهد شد.
      </p>
      <Button variant="gradient" className="mt-7" onClick={onGoOrders}>
        مشاهده سفارش‌های من
      </Button>
    </div>
  );
}



