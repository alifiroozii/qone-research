"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab, MilestonesTab } from "@/components/orders/order-tab-overview";
import { MessagesTab, FilesTab } from "@/components/orders/order-tab-chat-files";
import { PaymentsTab, HistoryTab } from "@/components/orders/order-tab-payments-history";
import { useData } from "@/lib/context/data-context";
import { useToast } from "@/components/ui/use-toast";
import type { Order } from "@/types";

export function OrderDetailTabs({
  order,
  canEditMilestones,
}: {
  order: Order;
  canEditMilestones: boolean;
}) {
  const [tab, setTab] = useState("overview");
  const { repo, refresh } = useData();
  const { toast } = useToast();

  const onMilestoneChange = (milestoneId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    repo.updateMilestone(order.id, milestoneId, status, "کارشناس");
    refresh();
    toast({ title: "مرحله به‌روزرسانی شد", variant: "success" });
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-slate-100/80 p-1.5">
        <TabsTrigger value="overview">نمای کلی</TabsTrigger>
        <TabsTrigger value="milestones">مراحل پیشرفت</TabsTrigger>
        <TabsTrigger value="messages">پیام‌ها</TabsTrigger>
        <TabsTrigger value="files">فایل‌ها</TabsTrigger>
        <TabsTrigger value="payments">پرداخت‌ها</TabsTrigger>
        <TabsTrigger value="history">تاریخچه</TabsTrigger>
      </TabsList>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <TabsContent value="overview" className="mt-0"><OverviewTab order={order} /></TabsContent>
        <TabsContent value="milestones" className="mt-0">
          <MilestonesTab order={order} canEdit={canEditMilestones} onMilestoneChange={canEditMilestones ? onMilestoneChange : undefined} />
        </TabsContent>
        <TabsContent value="messages" className="mt-0"><MessagesTab order={order} /></TabsContent>
        <TabsContent value="files" className="mt-0"><FilesTab order={order} /></TabsContent>
        <TabsContent value="payments" className="mt-0"><PaymentsTab order={order} /></TabsContent>
        <TabsContent value="history" className="mt-0"><HistoryTab order={order} /></TabsContent>
      </div>
    </Tabs>
  );
}
