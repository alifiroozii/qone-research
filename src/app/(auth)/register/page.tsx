"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/context/auth-context";
import { useBrand } from "@/lib/context/brand-context";
import { useToast } from "@/components/ui/use-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { brand } = useBrand();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.password) {
      setError("لطفاً همه فیلدهای الزامی را تکمیل کنید.");
      return;
    }
    if (form.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }
    setLoading(true);
    // Demo mode: registration acknowledges locally; real accounts are created
    // by the admin in a production build with a real database.
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "ثبت‌نام در حالت نمایشی",
        description: "در نسخه عملیاتی حساب مشتری ساخته می‌شود. برای آزمایش، از ورود آزمایشی استفاده کنید.",
        variant: "warning",
      });
      // Auto sign-in as demo client so the user can continue exploring.
      login("client1@example.com", "demo1234");
      router.push("/panel/client");
    }, 700);
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
          <h1 className="mt-7 text-center text-xl font-black">ساخت حساب کاربری</h1>
          <p className="mt-2 text-center text-sm text-slate-500">ثبت‌نام ویژه مشتریان — کارشناس و مدیر توسط مدیریت ایجاد می‌شوند</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="r-name">نام و نام خانوادگی</Label>
              <Input id="r-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: سارا محمدی" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-email">ایمیل</Label>
              <Input id="r-email" type="email" dir="ltr" className="text-left" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-pass">رمز عبور</Label>
              <Input id="r-pass" type="password" dir="ltr" className="text-left" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="حداقل ۶ کاراکتر" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-confirm">تکرار رمز عبور</Label>
              <Input id="r-confirm" type="password" dir="ltr" className="text-left" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="تکرار رمز عبور" required />
            </div>

            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <Button type="submit" variant="gradient" className="w-full" loading={loading}>
              <UserPlus className="h-4 w-4" />
              ثبت‌نام
            </Button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[12px] leading-6 text-amber-700">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            این فرم در حالت نمایشی است؛ حساب واقعی ساخته نمی‌شود و اطلاعات شما ذخیره نخواهد شد.
          </div>

          <div className="mt-6 text-center text-sm text-slate-500">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:underline">ورود</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
