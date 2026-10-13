"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { SERVICES_LIST } from "@/lib/constants/brand";
import { getServiceIcon } from "@/lib/utils/service-icons";
import { Badge } from "@/components/ui/badge";
import { formatToman } from "@/lib/utils/formatters";
import { CtaSection } from "@/components/marketing/cta-section";

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        kicker="فهرست خدمات"
        title="خدمات تخصصی پژوهشی"
        desc="خدمات ما در حوزه‌های مشاوره، نگارش، ویرایش، تحلیل آماری و انتشار علمی، متناسب با نیاز مقاطع مختلف تحصیلی ارائه می‌شود."
      />
      <section className="container py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES_LIST.map((s, i) => {
            const Icon = getServiceIcon(s.iconName);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
              >
                <Link href={`/services/${s.slug}`} className="group block h-full">
                  <div className="card-hover flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-indigo-600">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{s.title}</h3>
                          <Badge variant="secondary" className="shrink-0">
                            <Clock className="h-3 w-3" />
                            {s.turnaroundDays} روز
                          </Badge>
                        </div>
                        <p className="mt-2 text-[13px] leading-7 text-slate-500">{s.shortDesc}</p>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2.5">
                      {s.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[13px] leading-6 text-slate-600">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-success" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between pt-6">
                      <div>
                        <p className="text-[11px] text-slate-400">قیمت از</p>
                        <p className="text-sm font-bold text-foreground">{formatToman(s.basePrice)}</p>
                      </div>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                        جزئیات و ثبت درخواست
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
