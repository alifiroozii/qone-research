"use client";

import React, { useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import { NewRequestView } from "@/components/orders/new-request-view";
import type { RequestForm } from "@/components/orders/new-request-steps";

const MAX_SIZE = 20 * 1024 * 1024;

function NewRequestInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { db, repo, refresh } = useData();
  const { toast } = useToast();

  const services = db.services.filter((s) => s.isActive);
  const presetSlug = searchParams.get("service");
  const presetService = services.find((s) => s.slug === presetSlug);

  const [step, setStep] = useState(presetService ? 1 : 0);
  const [serviceId, setServiceId] = useState(presetService?.id ?? "");
  const [form, setForm] = useState<RequestForm>({
    title: "", fieldOfStudy: "", degreeLevel: "", subject: "",
    language: "fa", workVolume: "", targetDeadline: "", priority: "NORMAL", notes: "",
  });
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const service = services.find((s) => s.id === serviceId);

  const canNext = useMemo(() => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!form.title && !!form.fieldOfStudy && !!form.degreeLevel;
    return true;
  }, [step, serviceId, form]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setUploading(true);
    const added: { name: string; size: number }[] = [];
    Array.from(list).forEach((f) => {
      if (f.size > MAX_SIZE) {
        toast({ title: "حجم فایل بیش از حد مجاز", description: `${f.name} حذف شد.`, variant: "destructive" });
        return;
      }
      added.push({ name: f.name, size: f.size });
    });
    setTimeout(() => {
      setFiles((prev) => [...prev, ...added]);
      setUploading(false);
      if (added.length) toast({ title: `${added.length} فایل اضافه شد`, description: "در حالت نمایشی، فقط اطلاعات فایل نگهداری می‌شود.", variant: "success" });
    }, 400);
  };

  const submit = () => {
    if (!user) return;
    setSubmitting(true);
    setTimeout(() => {
      const order = repo.createOrder({
        title: form.title,
        serviceId,
        clientId: user.id,
        fieldOfStudy: form.fieldOfStudy,
        degreeLevel: form.degreeLevel,
        language: form.language,
        workVolume: form.workVolume || undefined,
        targetDeadline: form.targetDeadline || undefined,
        priority: form.priority,
        notes: form.notes || undefined,
        fileNames: files.map((f) => f.name),
      });
      refresh();
      setSubmitting(false);
      setStep(4);
      toast({ title: "درخواست با موفقیت ثبت شد", description: `کد پیگیری شما: ${order.trackingCode}`, variant: "success" });
    }, 800);
  };

  return <NewRequestView step={step} setStep={setStep} serviceId={serviceId} setServiceId={setServiceId} form={form} setForm={setForm} files={files} setFiles={setFiles} uploading={uploading} dragOver={dragOver} setDragOver={setDragOver} fileInput={fileInput} services={services} service={service} canNext={canNext} addFiles={addFiles} submit={submit} submitting={submitting} onGoOrders={() => router.push("/panel/client/orders")} />;
}

export default function NewRequestPage() {
  return (
    <Suspense>
      <NewRequestInner />
    </Suspense>
  );
}
