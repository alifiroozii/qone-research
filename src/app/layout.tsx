import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import { BrandProvider } from "@/lib/context/brand-context";
import { DataProvider } from "@/lib/context/data-context";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "سامانه هوشمند خدمات پژوهشی Qone Research",
  description:
    "سامانه جامع مدیریت و مشاوره خدمات پژوهشی، تحلیل آماری، ویرایش علمی و هدایت پروژه‌های دانشگاهی.",
  keywords: ["پژوهش", "مشاوره علمی", "ویرایش مقاله", "تحلیل آماری", "پایان‌نامه"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4F46E5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <BrandProvider>
          <DataProvider>
            <AuthProvider>
              <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
              <Toaster />
            </AuthProvider>
          </DataProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
