"use client";

import React from "react";
import { PageHeader } from "@/components/marketing/page-header";
import { CtaSection } from "@/components/marketing/cta-section";
import { useBrand } from "@/lib/context/brand-context";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, HeartHandshake, Scale } from "lucide-react";

const VALUES = [
  { icon: Target, title: "مأموریت ما", desc: "ارتقای سطح کیفی پژوهش‌های دانشگاهی با ارائه مشاوره تخصصی، ویرایش حرفه‌ای و راهنمایی شفاف در تمام مراحل نگارش و انتشار." },
  { icon: Eye, title: "چشم‌انداز ما", desc: "تبدیل شدن به مرجعی معتبر برای خدمات پژوهشی فارسی‌زبان با استانداردهای بین‌المللی و تجربه کاربری ممتاز." },
  { icon: HeartHandshake, title: "ارزش‌های ما", desc: "شفافیت، محرمانگی، تعهد به اخلاق پژوهش و احترام به حقوق مالکیت فکری پژوهشگران، ستون‌های کار ماست." },
  { icon: Scale, title: "محدودیت‌های اخلاقی", desc: "ما از انجام خدماتی که منجر به جعل علمی، انتساب نادرست نویسندگی یا دور زدن مقررات دانشگاهی شود، به‌شدت پرهیز می‌کنیم." },
];

export default function AboutPage() {
  const { brand } = useBrand();
  return (
    <>
      <PageHeader
        kicker="درباره ما"
        title={`آشنایی با ${brand.brandNameFa}`}
        desc={brand.sloganFa}
      />
      <section className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold">ما کیستیم؟</h2>
          <p className="mt-4 text-[15px] leading-9 text-slate-600">
            {brand.brandNameFa} یک سامانه جامع برای مدیریت و ارائه خدمات مشاوره و پشتیبانی پژوهشی است. ما فرایند پیچیده سفارش،
            بررسی تخصصی، قیمت‌گذاری، اجرا و تحویل را در یک بستر یکپارچه و شفاف قرار داده‌ایم تا پژوهشگران بتوانند با آرامش
            خاطر روی کار علمی خود تمرکز کنند.
          </p>
          <p className="mt-4 text-[15px] leading-9 text-slate-600">
            تیم ما متشکل از اساتید، پژوهشگران و متخصصان حوزه‌های مختلف علمی است که تجربه عملی در نگارش، ویرایش، تحلیل آماری و
            انتشار مقالات علمی دارند. ما به اخلاق پژوهش پایبندیم و خدمات خود را در چارچوبی قانونی و شرافتمندانه ارائه می‌دهیم.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <Card key={v.title} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-bold">{v.title}</h3>
                  <p className="mt-2 text-[13px] leading-8 text-slate-600">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
