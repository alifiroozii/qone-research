"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/lib/context/brand-context";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.65, 0.32, 0.9] as const } },
};

export function HeroSection() {
  const { brand } = useBrand();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute top-40 left-[-8%] h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden>
          <defs>
            <pattern id="hero-grid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#94a3b8" strokeWidth="0.5" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="container relative py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div initial="hidden" animate="show" variants={containerVariants}>
            <motion.span variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              {brand.brandNameFa} — سامانه جامع خدمات پژوهشی
            </motion.span>

            <motion.h1 variants={itemVariants} className="mt-6 text-3xl leading-[1.4] font-black tracking-tight sm:text-4xl lg:text-[2.6rem]">
              پژوهش حرفه‌ای، با برنامه‌ریزی دقیق و{" "}
              <span className="text-gradient">همراهی متخصصان</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-6 max-w-xl text-[15px] leading-8 text-slate-600 md:text-base">
              سامانه یکپارچه ثبت درخواست، مشاوره، پیگیری و مدیریت خدمات تخصصی پژوهشی؛ از ایده تا انتشار، در کنار شما هستیم.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button variant="gradient" size="lg" className="group">
                  ثبت درخواست جدید
                  <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg">آشنایی با خدمات</Button>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> پیگیری شفاف با کد یکتا</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> گفت‌وگوی اختصاصی با کارشناس</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> پرداخت مرحله‌ای و شفاف</span>
            </motion.div>
          </motion.div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const { brand } = useBrand();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative hidden lg:block"
    >
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-float backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-[11px] text-slate-400">داشبورد پیگیری سفارش</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "سفارش فعال", value: "۳", color: "text-indigo-600 bg-indigo-50" },
            { label: "در حال انجام", value: "۲", color: "text-cyan-600 bg-cyan-50" },
            { label: "تکمیل‌شده", value: "۸", color: "text-emerald-600 bg-emerald-50" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-50 p-3 text-center">
              <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${s.color}`}>{s.value}</div>
              <p className="mt-2 text-[11px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {[
            { t: "ویرایش علمی مقاله ISI", p: 62, c: "bg-indigo-500" },
            { t: "تحلیل آماری پایان‌نامه", p: 38, c: "bg-cyan-500" },
            { t: "مشاوره انتخاب مجله", p: 90, c: "bg-emerald-500" },
          ].map((r) => (
            <div key={r.t} className="rounded-xl border border-slate-100 bg-white p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{r.t}</span>
                <span className="num text-slate-400">{r.p}٪</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${r.c}`} style={{ width: `${r.p}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-elevated">
        <p className="text-xs text-slate-400">کد پیگیری</p>
        <p className="num mt-1 text-sm font-bold text-indigo-600">QR-2026-000125</p>
      </div>
      <span className="sr-only">{brand.brandNameFa}</span>
    </motion.div>
  );
}

