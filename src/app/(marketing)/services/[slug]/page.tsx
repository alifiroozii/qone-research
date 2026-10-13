"use client";

import React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { SERVICES_LIST } from "@/lib/constants/brand";
import { getServiceIcon } from "@/lib/utils/service-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatToman } from "@/lib/utils/formatters";
import { CtaSection } from "@/components/marketing/cta-section";

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const service = SERVICES_LIST.find((s) => s.slug === params.slug);
  if (!service) return notFound();
  const Icon = getServiceIcon(service.iconName);
  const related = SERVICES_LIST.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>
        <div className="container relative py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-primary">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-primary">خدمات</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{service.title}</span>
          </nav>

          <div className="mt-8 flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-indigo-600">
              <Icon className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black tracking-tight md:text-3xl">{service.title}</h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-8 text-slate-600">{service.shortDesc}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Badge variant="info"><Clock className="h-3 w-3" /> زمان تقریبی: {service.turnaroundDays} روز</Badge>
                <Badge variant="success">قیمت از {formatToman(service.basePrice)}</Badge>
              </div>
            </div>
            <Link href={`/register?service=${service.slug}`} className="shrink-0">
              <Button variant="gradient" size="lg" className="group">
                ثبت درخواست این خدمت
                <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold">توضیحات کامل خدمت</h2>
            <p className="mt-4 text-[15px] leading-9 text-slate-600">{service.fullDesc}</p>

            <h2 className="mt-10 text-xl font-bold">خدمات و سرفصل‌ها</h2>
            <ul className="mt-5 space-y-4">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10">
                    <Check className="h-3.5 w-3.5 text-success" />
                  </div>
                  <span className="text-[14px] leading-7 text-slate-700">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
              <h3 className="font-bold text-indigo-900">نکته مهم درباره اخلاق پژوهش</h3>
              <p className="mt-3 text-[13px] leading-8 text-indigo-900/75">
                خدمات این سامانه صرفاً جنبه مشاوره، آموزش، ویرایش و ارتقای کیفیت پژوهش شما را دارد. ما به هیچ عنوان در انجام
                پژوهش به جای شما، جعل علمی یا انتساب نادرست نویسندگی مشارکت نمی‌کنیم و پایبندی به اخلاق پژوهش را الزامی می‌دانیم.
              </p>
            </div>
          </div>
          <ServiceSidebar service={service} related={related} />
        </div>
      </section>
      <CtaSection />
    </>
  );
}

function ServiceSidebar({ service, related }: { service: (typeof SERVICES_LIST)[number]; related: typeof SERVICES_LIST }) {
  return (
    <aside className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold">خلاصه خدمت</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <dt className="text-slate-500">زمان تقریبی</dt>
              <dd className="num font-semibold">{service.turnaroundDays} روز کاری</dd>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <dt className="text-slate-500">قیمت از</dt>
              <dd className="font-semibold text-indigo-600">{formatToman(service.basePrice)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">نوبت اصلاح</dt>
              <dd className="font-semibold">۲ نوبت رایگان</dd>
            </div>
          </dl>
          <Link href={`/register?service=${service.slug}`} className="mt-6 block">
            <Button variant="gradient" className="w-full">شروع ثبت درخواست</Button>
          </Link>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-4 font-bold">خدمات مرتبط</h3>
        <div className="space-y-3">
          {related.map((r) => {
            const RI = getServiceIcon(r.iconName);
            return (
              <Link key={r.id} href={`/services/${r.slug}`} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors hover:border-indigo-200">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <RI className="h-5 w-5" />
                </div>
                <span className="flex-1 text-[13px] font-semibold group-hover:text-indigo-600">{r.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
