"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ShieldAlert, UserCog, Headphones, UserCircle2 } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/context/auth-context";
import { useBrand } from "@/lib/context/brand-context";
import { useToast } from "@/components/ui/use-toast";
import { getRepository } from "@/server/providers/repository";
import type { Role } from "@/types";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, demoLogin } = useAuth();
  const { brand } = useBrand();
  const { toast } = useToast();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectFor = (role: Role) =>
    role === "ADMIN" ? "/panel/admin" : role === "EXPERT" ? "/panel/expert" : "/panel/client";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const res = login(loginId, password);
      setLoading(false);
      if (!res.ok) {
        setError(res.error ?? "خطای ناشناخته");
        return;
      }
      const u = getRepository().findUserByLogin(loginId);
      toast({ title: "ورود موفق", description: "خوش آمدید.", variant: "success" });
      router.push(searchParams.get("next") ?? redirectFor(u?.role ?? "CLIENT"));
    }, 400);
  };

  const onDemo = (role: Role) => {
    const res = demoLogin(role);
    if (!res.ok) {
      setError(res.error ?? "خطا در ورود آزمایشی");
      return;
    }
    toast({ title: "ورود آزمایشی موفق", description: "شما وارد پنل نقش انتخاب‌شده شدید.", variant: "success" });
    router.push(redirectFor(role));
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-8%] h-[380px] w-[380px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-float backdrop-blur">
          <div className="flex justify-center">
            <Logo concept={brand.logoConcept} brandNameEn={brand.brandNameEn} brandNameFa={brand.brandNameFa} size="lg" />
          </div>
          <h1 className="mt-7 text-center text-xl font-black">ورود به حساب کاربری</h1>
          <p className="mt-2 text-center text-sm text-slate-500">برای ادامه، اطلاعات خود را وارد کنید</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginId">نام کاربری یا ایمیل</Label>
              <Input id="loginId" type="text" dir="ltr" className="text-left" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="admin یا you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Input id="password" type={showPass ? "text" : "password"} dir="ltr" className="text-left pl-10" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass((v) => !v)} tabIndex={-1} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="نمایش رمز">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <Button type="submit" variant="gradient" className="w-full" loading={loading}>
              <LogIn className="h-4 w-4" />
              ورود
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:underline">ثبت‌نام</Link>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-slate-400">یا</span>
            <Separator className="flex-1" />
          </div>

          <div className="mt-5">
            <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2.5 text-[11.5px] leading-6 text-slate-500">
              <p className="mb-1 font-semibold text-slate-600">حساب‌های نمایشی (رمز عبور همه: <span dir="ltr" className="font-mono font-bold text-indigo-600">demo1234</span>)</p>
              <div className="grid grid-cols-3 gap-1.5">
                <span dir="ltr" className="font-mono">admin</span>
                <span dir="ltr" className="font-mono">expert</span>
                <span dir="ltr" className="font-mono">client1</span>
                <span className="text-slate-400">مدیر</span>
                <span className="text-slate-400">کارشناس</span>
                <span className="text-slate-400">مشتری</span>
              </div>
            </div>
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              حالت آزمایشی — ورود بدون رمز عبور واقعی (بدون امنیت عملیاتی)
            </div>
            <DemoButtons onDemo={onDemo} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}

const ROLE_DEMOS: { role: Role; label: string; desc: string; icon: React.ElementType }[] = [
  { role: "CLIENT", label: "ورود به پنل مشتری", desc: "ثبت درخواست و پیگیری سفارش‌ها", icon: UserCircle2 },
  { role: "EXPERT", label: "ورود به پنل کارشناس", desc: "پروژه‌های ارجاع‌شده و گزارش پیشرفت", icon: Headphones },
  { role: "ADMIN", label: "ورود به پنل مدیر", desc: "مدیریت کامل سامانه", icon: UserCog },
];

function DemoButtons({ onDemo }: { onDemo: (r: Role) => void }) {
  return (
    <div className="grid gap-2">
      {ROLE_DEMOS.map((r) => (
        <button
          key={r.role}
          onClick={() => onDemo(r.role)}
          className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-right transition-all hover:border-indigo-300 hover:bg-indigo-50/40"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
            <r.icon size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold">{r.label}</p>
            <p className="text-[11px] text-slate-400">{r.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
