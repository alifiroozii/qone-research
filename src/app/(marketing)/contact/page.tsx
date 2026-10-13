"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/marketing/page-header";
import { useBrand } from "@/lib/context/brand-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const { brand } = useBrand();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "خطا", description: "لطفاً نام، ایمیل و متن پیام را وارد کنید.", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Demo mode: no backend — acknowledge locally.
    setTimeout(() => {
      setLoading(false);
      toast({ title: "پیام شما ثبت شد", description: "در نسخه نمایشی، پیامی به سرور ارسال نمی‌شود.", variant: "success" });
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 700);
  };

  const contactInfo = [
    { icon: Phone, label: "تلفن پشتیبانی", value: brand.supportPhone, ltr: false },
    { icon: Mail, label: "ایمیل", value: brand.supportEmail, ltr: true },
    { icon: MapPin, label: "آدرس", value: brand.addressFa, ltr: false },
  ];

  return (
    <>
      <PageHeader
        kicker="ارتباط با ما"
        title="تماس با ما"
        desc="برای دریافت راهنمایی، پرسش درباره خدمات یا هرگونه انتقاد و پیشنهاد، با ما در تماس باشید."
      />
      <section className="container py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            {contactInfo.map((c) => (
              <Card key={c.label} className="border-slate-200">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{c.label}</p>
                    <p className={`mt-1 text-sm font-semibold ${c.ltr ? "ltr" : ""}`}>{c.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-[13px] leading-7 text-amber-800">
              توجه: این سامانه در حال حاضر در حالت نمایشی است و فرم تماس صرفاً جنبه آزمایشی دارد.
            </div>
          </div>

          <Card className="border-slate-200 lg:col-span-3">
            <CardContent className="p-7">
              <h2 className="text-lg font-bold">فرم تماس</h2>
              <form onSubmit={submit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="c-name">نام و نام خانوادگی</Label>
                    <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: سارا محمدی" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-email">ایمیل</Label>
                    <Input id="c-email" type="email" dir="ltr" className="text-left" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-subject">موضوع (اختیاری)</Label>
                  <Input id="c-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="موضوع پیام" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-message">متن پیام</Label>
                  <Textarea id="c-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="پیام خود را بنویسید…" />
                </div>
                <Button type="submit" variant="gradient" loading={loading}>
                  <Send className="h-4 w-4" />
                  ارسال پیام
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
