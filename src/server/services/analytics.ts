import { AppDatabase } from "@/types/db";

/**
 * Analytics helpers — derive dashboard metrics from the live demo DB.
 * Kept pure so charts and stat cards always reflect the current data.
 */

const MONTHS_FA = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

/** Map an ISO date to the last 6 Persian month buckets ending at "now". */
export function monthlySeries(db: AppDatabase) {
  const now = new Date();
  const endIdx = (now.getMonth() + 11) % 12; // heuristic month index in a Jalali-ish rolling window
  const buckets = Array.from({ length: 6 }, (_, i) => ({
    month: MONTHS_FA[(endIdx - 5 + i + 12) % 12],
    orders: 0,
    revenue: 0,
    completed: 0,
  }));
  db.orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const diffDays = (now.getTime() - d.getTime()) / 86400000;
    // spread orders across the 6 buckets by age (~30 days per bucket)
    const b = 5 - Math.min(5, Math.floor(diffDays / 30));
    if (buckets[b]) {
      buckets[b].orders += 1;
      buckets[b].revenue += o.agreedPrice ?? 0;
      if (o.status === "COMPLETED") buckets[b].completed += 1;
    }
  });
  return buckets;
}

export function statusBreakdown(db: AppDatabase) {
  const counts: Record<string, number> = {};
  db.orders.forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

export function topServices(db: AppDatabase, limit = 6) {
  const counts: Record<string, { title: string; count: number }> = {};
  db.orders.forEach((o) => {
    counts[o.serviceId] = counts[o.serviceId] ?? { title: o.serviceTitle, count: 0 };
    counts[o.serviceId].count += 1;
  });
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function expertPerformance(db: AppDatabase) {
  return db.users
    .filter((u) => u.role === "EXPERT")
    .map((u) => {
      const assigned = db.orders.filter((o) => o.expertId === u.id);
      const completed = assigned.filter((o) => o.status === "COMPLETED").length;
      const active = assigned.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status)).length;
      return {
        id: u.id,
        name: u.fullName,
        rating: u.rating ?? 0,
        completed,
        active,
        total: assigned.length,
      };
    });
}

export function dashboardSummary(db: AppDatabase) {
  const total = db.orders.length;
  const newOrders = db.orders.filter((o) => ["SUBMITTED", "PENDING_REVIEW"].includes(o.status)).length;
  const inProgress = db.orders.filter((o) => ["ASSIGNED", "IN_PROGRESS", "READY_FOR_REVIEW", "REVISION_REQUESTED", "PAID", "AWAITING_PAYMENT", "AWAITING_CLIENT", "QUOTED"].includes(o.status)).length;
  const completed = db.orders.filter((o) => o.status === "COMPLETED").length;
  const revenue = db.payments.reduce((s, p) => s + (p.status === "COMPLETED" ? p.amount : 0), 0);
  const pendingPayments = db.orders.filter((o) => o.status === "AWAITING_PAYMENT").reduce((s, o) => s + (o.agreedPrice ?? 0), 0);
  const clients = db.users.filter((u) => u.role === "CLIENT").length;
  const activeExperts = db.users.filter((u) => u.role === "EXPERT" && u.isActive).length;
  return { total, newOrders, inProgress, completed, revenue, pendingPayments, clients, activeExperts };
}
