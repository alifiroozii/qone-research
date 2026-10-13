"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StepService, StepDetails, StepFiles, StepReview, StepDone,
  type RequestForm,
} from "@/components/orders/new-request-steps";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";

const STEPS = ["انتخاب خدمت", "اطلاعات درخواست", "بارگذاری فایل", "بازبینی", "ثبت نهایی"];

interface ViewProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  serviceId: string;
  setServiceId: (id: string) => void;
  form: RequestForm;
  setForm: React.Dispatch<React.SetStateAction<RequestForm>>;
  files: { name: string; size: number }[];
  setFiles: React.Dispatch<React.SetStateAction<{ name: string; size: number }[]>>;
  uploading: boolean;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  fileInput: React.RefObject<HTMLInputElement | null>;
  services: ServiceItem[];
  service?: ServiceItem;
  canNext: boolean;
  addFiles: (list: FileList | null) => void;
  submit: () => void;
  submitting: boolean;
  onGoOrders: () => void;
}

export function NewRequestView(props: ViewProps) {
  const { step, setStep, serviceId, setServiceId, form, setForm, files, setFiles, uploading, dragOver, setDragOver, fileInput, services, service, canNext, addFiles, submit, submitting, onGoOrders } = props;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-black md:text-2xl">ثبت درخواست جدید</h2>
        <p className="mt-1.5 text-sm text-slate-500">مراحل زیر را به ترتیب تکمیل کنید. امکان بازگشت و ویرایش وجود دارد.</p>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-7 text-amber-800">
        <Info className="mt-1 h-4 w-4 shrink-0" />
        <span>حالت نمایشی: این درخواست در مرورگر شما ذخیره می‌شود و هیچ اطلاعاتی به سرور ارسال نمی‌گردد.</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
        <ol className="flex items-center">
          {STEPS.map((label, i) => {
            const state = i < step ? "done" : i === step ? "current" : "todo";
            return (
              <li key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors",
                    state === "done" && "bg-success text-white",
                    state === "current" && "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-glow",
                    state === "todo" && "bg-slate-100 text-slate-400"
                  )}>
                    {state === "done" ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={cn("hidden text-[13px] font-semibold sm:block", state === "current" ? "text-foreground" : "text-slate-400")}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mx-3 hidden h-px flex-1 bg-slate-200 sm:block">
                    <div className={cn("h-full bg-indigo-500 transition-all duration-500", i < step ? "w-full" : "w-0")} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle md:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            {step === 0 && <StepService services={services} serviceId={serviceId} onSelect={setServiceId} />}
            {step === 1 && <StepDetails form={form} setForm={setForm} />}
            {step === 2 && (
              <StepFiles
                files={files}
                uploading={uploading}
                dragOver={dragOver}
                setDragOver={setDragOver}
                fileInput={fileInput}
                addFiles={addFiles}
                removeFile={(i) => setFiles((f) => f.filter((_, j) => j !== i))}
              />
            )}
            {step === 3 && <StepReview service={service} form={form} files={files} />}
            {step === 4 && <StepDone onGoOrders={onGoOrders} />}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ArrowRight className="h-4 w-4" />
              قبلی
            </Button>
            {step < 3 ? (
              <Button variant="gradient" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
                بعدی
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="gradient" onClick={submit} loading={submitting}>
                ثبت نهایی درخواست
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
