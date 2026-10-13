"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/branding/Logo";
import { useBrand } from "@/lib/context/brand-context";
import { Phone, Mail, MapPin } from "lucide-react";

export function MarketingFooter() {
  const { brand } = useBrand();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo concept={brand.logoConcept} brandNameEn={brand.brandNameEn} brandNameFa={brand.brandNameFa} size="md" />
            <p className="mt-4 text-sm leading-7 text-slate-500">
              {brand.sloganFa}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/services" className="hover:text-primary transition-colors">خدمات</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">نحوه ثبت درخواست</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">درباره ما</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">سؤالات متداول</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">حقوقی</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">حریم خصوصی</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">شرایط استفاده</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">تماس با ما</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">ارتباط با ما</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary shrink-0" /><span className="num">{brand.supportPhone}</span></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary shrink-0" /><span className="ltr">{brand.supportEmail}</span></li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary shrink-0 mt-1" /><span>{brand.addressFa}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          تمامی حقوق متعلق به {brand.brandNameFa} ({brand.brandNameEn}) می‌باشد. این نسخه یک نمایش آزمایشی است.
        </div>
      </div>
    </footer>
  );
}
