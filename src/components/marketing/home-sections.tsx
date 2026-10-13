"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ClipboardList, Search, Calculator,
  CreditCard, PlayCircle, MessageSquare, PackageCheck,
} from "lucide-react";
import { SERVICES_LIST } from "@/lib/constants/brand";
import { getServiceIcon } from "@/lib/utils/service-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function SectionHeading({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-bold tracking-wider text-indigo-600">{kicker}</span>
      <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{title}</h2>
      {desc && <p className="mt-4 text-[15px] leading-8 text-slate-600">{desc}</p>}
    </div>
  );
}

export function ServicesSection() {
  return (
    <section className="container py-20 md:py-24">
      <SectionHeading
        kicker="خدمات تخصصی"
        title="خدمات پژوهشی ما"
        desc="طیف گسترده‌ای از خدمات مشاوره، نگارش، ویرایش و تحلیل علمی برای مقاطع مختلف تحصیلی."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES_LIST.slice(0, 6).map((s, i) => {
          const Icon = getServiceIcon(s.iconName);
          return (
            <motion.div
              key={s.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/services/${s.slug}`} className="group block h-full">
                <div className="card-hover h-full rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-indigo-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                      {s.turnaroundDays} روز کاری
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold group-hover:text-indigo-600 transition-colors">{s.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-7 text-slate-500 line-clamp-2">{s.shortDesc}</p>
                  <div className="mt-5 flex items-center text-sm font-semibold text-indigo-600">
                    مشاهده جزئیات
                    <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <Link href="/services"><Button variant="outline" size="lg">مشاهده همه خدمات</Button></Link>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: ClipboardList, title: "ثبت درخواست", desc: "فرم چندمرحله‌ای را با جزئیات پژوهش خود تکمیل کنید." },
  { icon: Search, title: "بررسی تخصصی", desc: "درخواست شما توسط کارشناسان مربوطه بررسی می‌شود." },
  { icon: Calculator, title: "دریافت پیش‌فاکتور", desc: "قیمت و زمان‌بندی شفاف ارائه می‌شود." },
  { icon: CreditCard, title: "پرداخت", desc: "پس از تأیید پیش‌فاکتور، پرداخت را انجام دهید." },
  { icon: PlayCircle, title: "شروع خدمات", desc: "کارشناس اختصاص‌یافته کار را آغاز می‌کند." },
  { icon: MessageSquare, title: "پیگیری مراحل", desc: "وضعیت پیشرفت را به‌صورت لحظه‌ای دنبال کنید." },
  { icon: PackageCheck, title: "تحویل", desc: "خروجی نهایی تحویل و در صورت نیاز اصلاح می‌شود." },
];

export function StepsSection() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-20 md:py-24">
      <div className="container">
        <SectionHeading
          kicker="فرایند همکاری"
          title="از ثبت درخواست تا تحویل"
          desc="مسیر شفاف و مرحله‌به‌مرحله همکاری با سامانه."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.06 }}
              className={cn("relative", i % 2 === 1 ? "lg:mt-8" : "")}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-glow">
                    <step.icon size={22} />
                  </div>
                  <div>
                    <span className="num text-xs font-bold text-indigo-500">مرحله {i + 1}</span>
                    <h3 className="text-base font-bold">{step.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-7 text-slate-500">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/how-it-works"><Button variant="gradient">راهنمای کامل نحوه ثبت درخواست</Button></Link>
        </div>
      </div>
    </section>
  );
}
