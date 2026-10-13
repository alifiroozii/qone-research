"use client";

import React from "react";
import { PageHeader } from "@/components/marketing/page-header";
import { StepsSection } from "@/components/marketing/home-sections";
import { CtaSection } from "@/components/marketing/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, FileUp, Receipt, CreditCard, PlayCircle, MessageSquare, PackageCheck } from "lucide-react";

const DETAILS = [
  { icon: ClipboardList, title: "۱. ثبت درخواست", desc: "در پنل کاربری، خدمت مورد نظر را انتخاب و فرم چندمرحله‌ای شامل جزئیات پژوهش، رشته، مقطع، مهلت و فوریت را تکمیل کنید. فایل‌های مرتبط (PDF، Word، اکسل و…) را نیز می‌توانید ضمیمه کنید." },
  { icon: FileUp, title: "۲. بررسی تخصصی", desc: "درخواست شما توسط تیم کارشناسی بررسی و در صورت نیاز، توضیحات تکمیلی از شما درخواست می‌شود. این مرحله معمولاً کوتاه است." },
  { icon: Receipt, title: "۳. صدور پیش‌فاکتور", desc: "پس از بررسی، پیش‌فاکتوری شامل ردیف‌های هزینه، مهلت اعتبار، زمان تحویل پیشنهادی و تعداد اصلاحات مجاز صادر و برای شما ارسال می‌شود." },
  { icon: CreditCard, title: "۴. تأیید و پرداخت", desc: "پیش‌فاکتور را تأیید یا در صورت نیاز اصلاح می‌کنید و سپس پرداخت را انجام می‌دهید. (در نسخه نمایشی، پرداخت آزمایشی است.)" },
  { icon: PlayCircle, title: "۵. شروع و پیگیری", desc: "کارشناس اختصاص‌یافته، کار را در مراحل تعریف‌شده آغاز می‌کند و می‌توانید پیشرفت را در تایم‌لاین سفارش دنبال کنید." },
  { icon: MessageSquare, title: "۶. گفت‌وگو و تحویل", desc: "از طریق پیام‌رسان داخلی با کارشناس در ارتباط باشید و نسخه‌های تحویلی را دریافت کنید." },
  { icon: PackageCheck, title: "۷. تأیید نهایی", desc: "در صورت نیاز درخواست اصلاح ثبت کنید و پس از رضایت، تحویل نهایی را تأیید و سفارش را تکمیل کنید." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        kicker="راهنما"
        title="نحوه ثبت درخواست و روند همکاری"
        desc="مسیر همکاری شفاف و مرحله‌به‌مرحله از ثبت درخواست تا تحویل نهایی."
      />
      <StepsSection />
      <section className="container py-16 md:py-20">
        <h2 className="text-center text-2xl font-black">جزئیات هر مرحله</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {DETAILS.map((d) => (
            <Card key={d.title} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <d.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{d.title}</h3>
                    <p className="mt-2 text-[13px] leading-8 text-slate-600">{d.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
