"use client";

import React from "react";
import { Mail, Phone, GraduationCap, Building2, Shield } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import type { Role } from "@/types";

const ROLE_LABEL: Record<Role, string> = { ADMIN: "مدیر کل", EXPERT: "کارشناس", CLIENT: "مشتری" };

export function ProfileView() {
  const { user } = useAuth();
  const { db } = useData();

  const full = user ? db.users.find((u) => u.id === user.id) : undefined;
  if (!full) return null;

  const rows: { icon: React.ElementType; label: string; value: string; ltr?: boolean }[] = [
    { icon: Mail, label: "ایمیل", value: full.email, ltr: true },
    { icon: Phone, label: "تلفن", value: full.phone ?? "—", ltr: true },
  ];
  if (full.role === "CLIENT") {
    rows.push(
      { icon: Building2, label: "دانشگاه", value: full.university ?? "—" },
      { icon: GraduationCap, label: "رشته", value: full.major ?? "—" },
      { icon: GraduationCap, label: "مقطع", value: full.degree ?? "—" }
    );
  }
  if (full.role === "EXPERT") {
    rows.push(
      { icon: GraduationCap, label: "مرتبه علمی", value: full.academicRank ?? "—" },
      { icon: GraduationCap, label: "تخصص‌ها", value: (full.specialties ?? []).join("، ") || "—" }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">پروفایل</h2>
        <p className="mt-1.5 text-sm text-slate-500">اطلاعات حساب کاربری شما.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle md:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-2xl font-black text-white">
            {full.fullName[0]}
          </div>
          <div>
            <h3 className="text-lg font-black">{full.fullName}</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[12px] font-semibold text-indigo-700">
                <Shield className="h-3 w-3" />
                {ROLE_LABEL[full.role]}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-600">فعال</span>
            </div>
          </div>
        </div>

        <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3 border-b border-slate-100 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <r.icon className="h-4 w-4" />
              </div>
              <div>
                <dt className="text-[11px] text-slate-400">{r.label}</dt>
                <dd className={`mt-0.5 text-[13.5px] font-semibold ${r.ltr ? "ltr" : ""}`}>{r.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12.5px] leading-7 text-amber-800">
          در حالت نمایشی، ویرایش پروفایل فعال نیست. با اتصال دیتابیس واقعی، امکان ویرایش اطلاعات و تغییر رمز عبور فراهم می‌شود.
        </div>
      </div>
    </div>
  );
}
