"use client";

import React, { useState } from "react";
import { Save, RotateCcw, Palette } from "lucide-react";
import { useBrand } from "@/lib/context/brand-context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/branding/Logo";
import { ColorsAndContact } from "@/components/settings/colors-contact";

export default function AdminSettingsPage() {
  const { brand, updateBrand, resetBrand } = useBrand();
  const { toast } = useToast();
  const [form, setForm] = useState({ ...brand });
  const upd = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const save = () => {
    updateBrand(form);
    toast({ title: "تنظیمات برند ذخیره شد", description: "تغییرات در سراسر سایت اعمال شد.", variant: "success" });
  };

  const reset = () => {
    resetBrand();
    setForm({ ...brand });
    toast({ title: "تنظیمات به حالت پیش‌فرض بازگشت", variant: "warning" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black md:text-2xl">تنظیمات</h2>
          <p className="mt-1.5 text-sm text-slate-500">مدیریت هویت برند، رنگ‌ها و اطلاعات تماس سامانه.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            بازنشانی
          </Button>
          <Button variant="gradient" onClick={save}>
            <Save className="h-4 w-4" />
            ذخیره تغییرات
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <h3 className="flex items-center gap-2 text-[15px] font-bold">
          <Palette className="h-4 w-4 text-indigo-500" />
          پیش‌نمایش لوگو
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-8 rounded-xl bg-slate-50 p-6">
          <Logo concept={form.logoConcept} brandNameEn={form.brandNameEn} brandNameFa={form.brandNameFa} size="lg" />
          <Logo concept={form.logoConcept} variant="icon" size="lg" />
          <Logo concept={form.logoConcept} brandNameEn={form.brandNameEn} brandNameFa={form.brandNameFa} size="sm" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <h3 className="text-[15px] font-bold">هویت برند</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>نام فارسی</Label>
            <Input value={form.brandNameFa} onChange={(e) => upd({ brandNameFa: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>نام انگلیسی</Label>
            <Input dir="ltr" className="text-left" value={form.brandNameEn} onChange={(e) => upd({ brandNameEn: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>شعار (فارسی)</Label>
            <Input value={form.sloganFa} onChange={(e) => upd({ sloganFa: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>مفهوم لوگو</Label>
            <Select value={form.logoConcept} onValueChange={(v) => upd({ logoConcept: v as typeof form.logoConcept })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="concept1">طرح اول — حرف Q هندسی</SelectItem>
                <SelectItem value="concept2">طرح دوم — دانش و فناوری</SelectItem>
                <SelectItem value="concept3">طرح سوم — نماد انتزاعی</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ColorsAndContact form={form} upd={upd} />
    </div>
  );
}
