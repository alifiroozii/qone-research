"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  kicker?: string;
  title: string;
  desc?: string;
}

export function PageHeader({ kicker, title, desc }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <div className="container relative py-16 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {kicker && <span className="text-xs font-bold tracking-wider text-indigo-600">{kicker}</span>}
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
          {desc && <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-slate-600">{desc}</p>}
        </motion.div>
      </div>
    </section>
  );
}
