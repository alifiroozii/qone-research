"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import type { Order } from "@/types";

export function AssignExpertButton({ order }: { order: Order }) {
  const { db, repo, refresh } = useData();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [expertId, setExpertId] = useState("");

  const experts = db.users.filter((u) => u.role === "EXPERT" && u.isActive);

  const submit = () => {
    if (!expertId) {
      toast({ title: "خطا", description: "یک کارشناس انتخاب کنید.", variant: "destructive" });
      return;
    }
    repo.assignExpert(order.id, expertId, "مدیر کل");
    refresh();
    setOpen(false);
    toast({ title: "سفارش ارجاع شد", description: "کارشناس انتخاب‌شده از طریق اعلان مطلع می‌شود.", variant: "success" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={order.isPaid ? "default" : "outline"} disabled={!order.isPaid} title={order.isPaid ? "" : "ابتدا پرداخت انجام شود"}>
          <UserPlus className="h-4 w-4" />
          ارجاع به کارشناس
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ارجاع سفارش {order.trackingCode} به کارشناس</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>انتخاب کارشناس</Label>
            <Select value={expertId} onValueChange={setExpertId}>
              <SelectTrigger><SelectValue placeholder="کارشناس را انتخاب کنید" /></SelectTrigger>
              <SelectContent>
                {experts.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.fullName} — {e.specialties?.[0] ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="rounded-lg bg-slate-50 p-3 text-[12px] leading-7 text-slate-500">
            پس از ارجاع، مراحل کار به‌صورت خودکار تعریف می‌شود و کارشناس می‌تواند پیشرفت را ثبت کند.
          </p>
          <Button variant="gradient" className="w-full" onClick={submit}>
            <UserPlus className="h-4 w-4" />
            تأیید ارجاع
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
