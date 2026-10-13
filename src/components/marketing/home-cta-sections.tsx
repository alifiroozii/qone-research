"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading, fadeUp } from "@/components/marketing/home-sections";
import { useBrand } from "@/lib/context/brand-context";

const FEATURES = [
  { icon: ShieldCheck, title: "تضمین محرمانگی", desc: "اطلاعات پژوهشی شما محرمانه می‌ماند و در چارچوب تعهدات واقعی حفظ می‌شود." },
  { icon: Users, title: "متخصصان دانشگاهی", desc: "همراهی اساتید و پژوهشگران با تجربه در حوزه‌های تخصصی مختلف." },
  { icon: Zap, title: "پیگیری شفاف", desc: "کد پیگیری یکتا، تایم‌لاین مراحل و گفت‌وگوی اختصاصی برای هر سفارش." },
  { icon: CheckCircle2, title: "کیفیت استاندارد", desc: "روند کار منطبق با استانداردهای نگارش و انتشارات علمی معتبر." },
];

export function FeaturesSection() {
  const { brand } = useBrand();
  return (
    <section className="container py-20 md:py-24">
      <SectionHeading kicker="مزیت‌ها" title={`چرا ${brand.brandNameFa}؟`} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-subtle"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-base font-bold">{f.title}</h3>
            <p className="mt-2.5 text-[13px] leading-7 text-slate-500">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  { q: "خدمات سامانه دقیقاً چیست و چه کمکی به من می‌کند؟", a: "ما در زمینه مشاوره، ویرایش علمی، تحلیل آماری و راهنمایی گام‌به‌گام نگارش پژوهش در کنار شما هستیم. هدف ما ارتقای کیفیت کار پژوهشی شما در چارچوب اصول علمی و اخلاق پژوهش است؛ نه انجام کار به جای شما یا انتساب نادرست نویسندگی." },
  { q: "چگونه می‌توانم از وضعیت سفارش خود مطلع شوم؟", a: "پس از ثبت درخواست، یک کد پیگیری یکتا دریافت می‌کنید. از طریق پنل کاربری می‌توانید مراحل پیشرفت، پیام‌ها، فایل‌ها و پرداخت‌های خود را به‌صورت لحظه‌ای دنبال کنید." },
  { q: "آیا امکان اصلاح کار پس از تحویل وجود دارد؟", a: "بله. تعداد نوبت‌های اصلاح مجاز در پیش‌فاکتور مشخص می‌شود و می‌توانید درخواست اصلاح ثبت کنید." },
];

export function FaqSection() {
  return (
    <section className="border-t border-slate-100 bg-slate-50/60 py-20 md:py-24">
      <div className="container max-w-3xl">
        <SectionHeading kicker="سؤالات متداول" title="پاسخ پرسش‌های رایج" />
        <Accordion type="single" collapsible className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 shadow-subtle">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className={i === FAQS.length - 1 ? "border-b-0" : ""}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 text-center">
          <Link href="/faq"><Button variant="ghost">مشاهده همه سؤالات</Button></Link>
        </div>
      </div>
    </section>
  );
}
