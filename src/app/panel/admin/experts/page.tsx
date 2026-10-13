"use client";

import React from "react";
import { UserCog, Star, FolderCheck, Activity } from "lucide-react";
import { useData } from "@/lib/context/data-context";
import { EmptyState } from "@/components/dashboard/empty-state";
import { toPersianDigits } from "@/lib/utils/formatters";

export default function AdminExpertsPage() {
  const { db } = useData();
  const experts = db.users.filter((u) => u.role === "EXPERT");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">مدیریت کارشناسان</h2>
        <p className="mt-1.5 text-sm text-slate-500">کارشناسان سامانه، تخصص‌ها و میزان بار کاری.</p>
      </div>

      {experts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState icon={UserCog} title="کارشناسی ثبت نشده" description="در نسخه عملیاتی، کارشناسان توسط مدیر ایجاد می‌شوند." />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {experts.map((e) => {
            const assigned = db.orders.filter((o) => o.expertId === e.id);
            const active = assigned.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status));
            const completed = assigned.filter((o) => o.status === "COMPLETED");
            return (
              <div key={e.id} className="card-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-lg font-black text-white">
                    {e.fullName.replace("دکتر ", "")[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-bold">{e.fullName}</h3>
                    <p className="mt-0.5 text-[12px] text-slate-400">{e.academicRank ?? "کارشناس"}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[12px] text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="num font-semibold">{e.rating?.toLocaleString("fa-IR") ?? "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(e.specialties ?? []).map((s) => (
                    <span key={s} className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">{s}</span>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-indigo-600"><Activity className="h-3.5 w-3.5" /></div>
                    <p className="mt-1 text-lg font-black">{toPersianDigits(active.length)}</p>
                    <p className="text-[10.5px] text-slate-400">فعال</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-emerald-600"><FolderCheck className="h-3.5 w-3.5" /></div>
                    <p className="mt-1 text-lg font-black">{toPersianDigits(completed.length)}</p>
                    <p className="text-[10.5px] text-slate-400">تکمیل‌شده</p>
                  </div>
                  <div>
                    <p className="mt-1 text-lg font-black">{toPersianDigits(assigned.length)}</p>
                    <p className="text-[10.5px] text-slate-400">کل ارجاع‌ها</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[12.5px] leading-7 text-amber-800">
        در حالت نمایشی، ایجاد و ویرایش کارشناس فعال نیست. در نسخه عملیاتی، مدیر می‌تواند کارشناس جدید ایجاد، تخصص‌ها را تعیین و حساب را فعال/غیرفعال کند.
      </div>
    </div>
  );
}
