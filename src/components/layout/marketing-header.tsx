"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/lib/context/brand-context";
import { useAuth } from "@/lib/context/auth-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/services", label: "خدمات" },
  { href: "/how-it-works", label: "نحوه ثبت درخواست" },
  { href: "/about", label: "درباره ما" },
  { href: "/faq", label: "سؤالات متداول" },
  { href: "/contact", label: "تماس با ما" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const { brand } = useBrand();
  const { user, hydrated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const panelHref = user ? (user.role === "ADMIN" ? "/panel/admin" : user.role === "EXPERT" ? "/panel/expert" : "/panel/client") : null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-subtle" : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container flex h-16 md:h-[70px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="صفحه اصلی">
          <Logo concept={brand.logoConcept} brandNameEn={brand.brandNameEn} brandNameFa={brand.brandNameFa} size="md" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-slate-600 hover:text-foreground"
                )}
              >
                {item.label}
                {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {hydrated && user && panelHref ? (
            <Link href={panelHref}>
              <Button variant="outline" size="sm">پنل کاربری</Button>
            </Link>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">ورود</Button></Link>
              <Link href="/register"><Button variant="gradient" size="sm">ثبت‌نام</Button></Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/70"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="منو"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-[15px] font-medium transition-colors",
                    active ? "bg-primary/5 text-primary" : "text-slate-700 hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 flex gap-2">
              {hydrated && user && panelHref ? (
                <Link href={panelHref} className="flex-1"><Button variant="gradient" className="w-full">پنل کاربری</Button></Link>
              ) : (
                <>
                  <Link href="/login" className="flex-1"><Button variant="outline" className="w-full">ورود</Button></Link>
                  <Link href="/register" className="flex-1"><Button variant="gradient" className="w-full">ثبت‌نام</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
