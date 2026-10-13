import React from "react";
import { PageHeader } from "@/components/marketing/page-header";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export function LegalPage({ kicker, title, desc, sections }: { kicker: string; title: string; desc: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHeader kicker={kicker} title={title} desc={desc} />
      <section className="container max-w-3xl py-14 md:py-20">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="flex items-center gap-3 text-lg font-bold">
                <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs text-indigo-600">{i + 1}</span>
                {s.title}
              </h2>
              {s.paragraphs.map((p, j) => (
                <p key={j} className="mt-3 text-[14px] leading-9 text-slate-600">{p}</p>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-7 text-slate-500">
          توجه: این متن نمونه‌ای برای نسخه نمایشی است و پیش از استفاده عملیاتی باید توسط کارشناس حقوقی بازبینی و نهایی‌سازی شود.
        </p>
      </section>
    </>
  );
}
