"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-indigo-600 via-indigo-500 to-cyan-500 px-8 py-14 text-center shadow-glow md:px-16 md:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -top-20 right-10 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-black text-white md:text-3xl">
              آماده‌اید پژوهش خود را حرفه‌ای‌تر پیش ببرید؟
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-8 text-white/85">
              همین حالا درخواست خود را ثبت کنید و از مشاوره تخصصی، پیگیری شفاف و همراهی متخصصان بهره‌مند شوید.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90">
                  ثبت درخواست جدید
                  <ArrowLeft />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  تماس با ما
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
