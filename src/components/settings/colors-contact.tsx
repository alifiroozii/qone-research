"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const COLOR_FIELDS = [
  ["primaryColor", "رنگ اصلی"],
  ["secondaryColor", "رنگ مکمل"],
  ["accentColor", "رنگ تأکیدی"],
] as const;

export function ColorsAndContact({ form, upd }: { form: Record<string, string>; upd: (p: Record<string, string>) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
      <h3 className="text-[15px] font-bold">رنگ‌ها، تماس و سئو</h3>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-3 gap-3 lg:col-span-2">
          {COLOR_FIELDS.map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form[key]}
                  onChange={(e) => upd({ [key]: e.target.value })}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  aria-label={label}
                />
                <Input dir="ltr" className="text-left" value={form[key]} onChange={(e) => upd({ [key]: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label>تلفن پشتیبانی</Label>
          <Input value={form.supportPhone} onChange={(e) => upd({ supportPhone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>ایمیل</Label>
          <Input dir="ltr" className="text-left" value={form.supportEmail} onChange={(e) => upd({ supportEmail: e.target.value })} />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label>دامنه</Label>
          <Input dir="ltr" className="text-left" value={form.domain} onChange={(e) => upd({ domain: e.target.value })} />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label>آدرس</Label>
          <Textarea rows={2} value={form.addressFa} onChange={(e) => upd({ addressFa: e.target.value })} />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label>عنوان سئو</Label>
          <Input value={form.seoTitle} onChange={(e) => upd({ seoTitle: e.target.value })} />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label>توضیحات سئو</Label>
          <Textarea rows={2} value={form.seoDescription} onChange={(e) => upd({ seoDescription: e.target.value })} />
        </div>
      </div>
      <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12.5px] leading-7 text-amber-800">
        تغییرات در حالت نمایشی فقط در مرورگر شما ذخیره می‌شوند.
      </p>
    </div>
  );
}
