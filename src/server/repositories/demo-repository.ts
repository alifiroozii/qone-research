import { AppDatabase, DB_KEY } from "@/types/db";
import { createSeedDatabase } from "@/data/mock/seed";
import { readStore, writeStore } from "@/lib/storage";
import type { Notification, OrderStatus } from "@/types";

/**
 * Demo Repository — the swappable data layer.
 *
 * In Demo Mode the source of truth is an AppDatabase snapshot persisted
 * in the browser (localStorage). When PostgreSQL is wired up later, the
 * UI can consume an equivalent Prisma-backed repository implementing the
 * same method surface without changing components.
 *
 * NOTE: This is NOT a secure backend. Authorization must be enforced on
 * a real server once a database is connected.
 */
export class DemoRepository {
  private db: AppDatabase;

  constructor(db?: AppDatabase) {
    this.db = db ?? readStore<AppDatabase>(DB_KEY, createSeedDatabase());
  }

  snapshot(): AppDatabase {
    return this.db;
  }

  protected commit() {
    writeStore(DB_KEY, this.db);
  }

  protected uid(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  protected now() {
    return new Date().toISOString();
  }

  protected notify(userId: string, title: string, message: string, link?: string, type: Notification["type"] = "ORDER") {
    this.db.notifications.unshift({
      id: this.uid("not"),
      userId,
      title,
      message,
      link,
      type,
      isRead: false,
      createdAt: this.now(),
    });
  }

  // ----- Generic collection accessors -----
  users() { return this.db.users; }
  services() { return this.db.services; }
  serviceCategories() { return this.db.serviceCategories; }
  orders() { return this.db.orders; }
  notifications() { return this.db.notifications; }
  supportTickets() { return this.db.supportTickets; }

  findUserByEmail(email: string) {
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserByLogin(login: string) {
    const q = login.trim().toLowerCase();
    return this.db.users.find((u) => u.email.toLowerCase() === q || (u.username && u.username.toLowerCase() === q));
  }
  findUser(id: string) {
    return this.db.users.find((u) => u.id === id);
  }
  findOrder(id: string) {
    return this.db.orders.find((o) => o.id === id);
  }
  findService(id: string) {
    return this.db.services.find((s) => s.id === id);
  }
  findServiceBySlug(slug: string) {
    return this.db.services.find((s) => s.slug === slug);
  }

  resetToSeed() {
    this.db = createSeedDatabase();
    this.commit();
  }

  static reseed() {
    const repo = new DemoRepository(createSeedDatabase());
    repo.commit();
    return repo;
  }

  // ================= Mutations =================

  createOrder(input: {
    title: string;
    serviceId: string;
    clientId: string;
    fieldOfStudy: string;
    degreeLevel: string;
    language: "fa" | "en" | "bilingual";
    workVolume?: string;
    targetDeadline?: string;
    priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    notes?: string;
    fileNames?: string[];
  }) {
    const service = this.findService(input.serviceId);
    const client = this.findUser(input.clientId);
    const now = this.now();
    const seq = 139 + this.db.orders.length;
    const order = {
      id: this.uid("ord"),
      trackingCode: `QR-2026-${String(seq).padStart(6, "0")}`,
      title: input.title,
      serviceId: input.serviceId,
      serviceTitle: service?.title ?? "خدمات پژوهشی",
      clientId: input.clientId,
      clientName: client?.fullName ?? "مشتری",
      clientEmail: client?.email ?? "",
      status: "SUBMITTED" as const,
      priority: input.priority,
      fieldOfStudy: input.fieldOfStudy,
      degreeLevel: input.degreeLevel,
      workVolume: input.workVolume,
      language: input.language,
      targetDeadline: input.targetDeadline,
      notes: input.notes,
      agreedPrice: undefined as number | undefined,
      currency: "IRT",
      isPaid: false,
      createdAt: now,
      updatedAt: now,
      milestones: [],
      statusHistory: [
        { id: this.uid("h"), orderId: "", fromStatus: "SUBMITTED" as const, toStatus: "SUBMITTED" as const, note: "ثبت اولیه سفارش توسط مشتری", changedByName: client?.fullName ?? "مشتری", createdAt: now },
      ],
      quotations: [],
      invoices: [],
      payments: [],
      messages: [],
      files: (input.fileNames ?? []).map((name) => ({
        id: this.uid("file"),
        orderId: "",
        uploaderId: input.clientId,
        uploaderName: client?.fullName ?? "مشتری",
        fileName: name,
        fileType: "application/octet-stream",
        fileSize: 500_000,
        fileUrl: "#",
        category: "CLIENT_UPLOAD" as const,
        isFinal: false,
        version: 1,
        createdAt: now,
      })),
      deliverables: [],
      revisions: [],
    };
    order.statusHistory[0].orderId = order.id;
    order.files.forEach((f) => (f.orderId = order.id));
    this.db.orders = [order, ...this.db.orders];
    this.notify("usr-admin-1", "سفارش جدید ثبت شد", `درخواست جدیدی با کد ${order.trackingCode} ثبت شد و منتظر بررسی است.`, "/panel/admin/orders");
    this.commit();
    return order;
  }

  setOrderStatus(orderId: string, toStatus: OrderStatus, changedByName: string, note?: string) {
    const order = this.findOrder(orderId);
    if (!order) return;
    order.statusHistory.push({
      id: this.uid("h"),
      orderId,
      fromStatus: order.status,
      toStatus,
      note,
      changedByName,
      createdAt: this.now(),
    });
    order.status = toStatus;
    order.updatedAt = this.now();
    this.commit();
  }

  issueQuotation(orderId: string, data: { items: { description: string; unitPrice: number; quantity: number }[]; discountAmount: number; deliveryDays: number; includedRevisions: number; terms?: string }, issuedBy: string) {
    const order = this.findOrder(orderId);
    if (!order) return;
    const total = data.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const payable = Math.max(0, total - data.discountAmount);
    const q = {
      id: this.uid("qt"),
      quotationNumber: `QT-2026-${String(this.db.quotations.length + 1).padStart(4, "0")}`,
      orderId,
      totalAmount: total,
      discountAmount: data.discountAmount,
      payableAmount: payable,
      expiresAt: new Date(Date.now() + 10 * 86400000).toISOString(),
      deliveryDays: data.deliveryDays,
      includedRevisions: data.includedRevisions,
      terms: data.terms,
      status: "PENDING" as const,
      createdAt: this.now(),
      items: data.items.map((it) => ({ id: this.uid("qi"), ...it, total: it.unitPrice * it.quantity })),
    };
    this.db.quotations.unshift(q);
    order.quotations = [q, ...order.quotations];
    order.agreedPrice = payable;
    this.setOrderStatus(orderId, "QUOTED", issuedBy, "صدور پیش‌فاکتور");
    this.notify(order.clientId, "پیش‌فاکتور صادر شد", `پیش‌فاکتور ${q.quotationNumber} برای سفارش شما صادر شد.`, "/panel/client/quotations");
    this.commit();
    return q;
  }

  acceptQuotation(quotationId: string) {
    const q = this.db.quotations.find((x) => x.id === quotationId);
    if (!q) return;
    q.status = "ACCEPTED";
    const order = this.findOrder(q.orderId);
    if (order) {
      order.agreedPrice = q.payableAmount;
      this.setOrderStatus(q.orderId, "AWAITING_PAYMENT", "مشتری", "تأیید پیش‌فاکتور توسط مشتری");
    }
    this.commit();
  }

  rejectQuotation(quotationId: string, reason?: string) {
    const q = this.db.quotations.find((x) => x.id === quotationId);
    if (!q) return;
    q.status = "REJECTED";
    this.setOrderStatus(q.orderId, "REQUIRES_INFO", "مشتری", reason ?? "رد پیش‌فاکتور و درخواست بازبینی قیمت");
    this.commit();
  }

  demoPay(orderId: string) {
    const order = this.findOrder(orderId);
    if (!order) return;
    const amount = order.agreedPrice ?? 0;
    const payment = {
      id: this.uid("pay"),
      paymentCode: `PAY-2026-${String(89 + this.db.payments.length).padStart(4, "0")}`,
      invoiceId: undefined as string | undefined,
      orderId,
      amount,
      gateway: "DEMO",
      status: "COMPLETED" as const,
      referenceId: `DEMO${orderId.toUpperCase()}`,
      trackingNumber: `${2000000 + this.db.payments.length}`,
      paidAt: this.now(),
      createdAt: this.now(),
    };
    this.db.payments.unshift(payment);
    order.payments = [payment, ...order.payments];
    order.isPaid = true;
    this.setOrderStatus(orderId, "PAID", "مشتری", "پرداخت آزمایشی موفق");
    this.notify(order.clientId, "پرداخت آزمایشی موفق", `پرداخت سفارش ${order.trackingCode} با موفقیت ثبت شد (حالت آزمایشی).`, `/panel/client/orders/${orderId}`, "PAYMENT");
    this.commit();
    return payment;
  }

  assignExpert(orderId: string, expertId: string, adminName: string) {
    const order = this.findOrder(orderId);
    const expert = this.findUser(expertId);
    if (!order || !expert) return;
    order.expertId = expertId;
    order.expertName = expert.fullName;
    order.milestones = [
      "بررسی اولیه و جمع‌بندی نیازها",
      "تدوین ساختار و چارچوب نظری",
      "اجرای تحلیل / نگارش بدنه",
      "بازبینی نهایی و اصلاحات",
    ].map((title, i) => ({ id: this.uid("ms"), orderId, title, orderIndex: i, status: "PENDING" as const }));
    this.setOrderStatus(orderId, "ASSIGNED", adminName, `ارجاع به کارشناس ${expert.fullName}`);
    this.notify(expertId, "ارجاع پروژه جدید", `پروژه‌ای با کد ${order.trackingCode} به شما ارجاع شد.`, "/panel/expert/assigned");
    this.commit();
  }

  updateMilestone(orderId: string, milestoneId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED", byName: string) {
    const order = this.findOrder(orderId);
    if (!order) return;
    const ms = order.milestones.find((m) => m.id === milestoneId);
    if (!ms) return;
    const now = this.now();
    ms.status = status;
    if (status === "IN_PROGRESS") ms.startedAt = now;
    if (status === "COMPLETED") {
      ms.completedAt = now;
      ms.startedAt = ms.startedAt ?? now;
    }
    order.updatedAt = now;
    if (order.milestones.every((m) => m.status === "COMPLETED") && order.status === "IN_PROGRESS") {
      this.setOrderStatus(orderId, "READY_FOR_REVIEW", byName, "همه مراحل تکمیل شد");
    } else if (order.status === "ASSIGNED" && order.milestones.some((m) => m.status === "IN_PROGRESS")) {
      this.setOrderStatus(orderId, "IN_PROGRESS", byName, "شروع اجرای مرحله");
    }
    this.commit();
  }

  sendMessage(orderId: string, sender: { id: string; name: string; role: "ADMIN" | "EXPERT" | "CLIENT" }, content: string) {
    const order = this.findOrder(orderId);
    if (!order) return;
    const msg = {
      id: this.uid("msg"),
      orderId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      content,
      isRead: false,
      createdAt: this.now(),
    };
    this.db.messages.unshift(msg);
    order.messages = [msg, ...order.messages];
    this.commit();
    return msg;
  }

  createSupportTicket(input: { userId: string; subject: string; category: string; message: string }) {
    const user = this.findUser(input.userId);
    const now = this.now();
    const ticket = {
      id: this.uid("tck"),
      ticketNumber: `TCK-2026-${String(this.db.supportTickets.length + 9).padStart(4, "0")}`,
      userId: input.userId,
      userName: user?.fullName ?? "مشتری",
      subject: input.subject,
      category: input.category,
      priority: "MEDIUM" as const,
      status: "OPEN" as const,
      createdAt: now,
      updatedAt: now,
      messages: [
        { id: this.uid("tm"), ticketId: "", senderId: input.userId, senderName: user?.fullName ?? "مشتری", senderRole: "CLIENT" as const, message: input.message, createdAt: now },
      ],
    };
    ticket.messages[0].ticketId = ticket.id;
    this.db.supportTickets.unshift(ticket);
    this.commit();
    return ticket;
  }

  addTicketReply(ticketId: string, sender: { id: string; name: string; role: "ADMIN" | "CLIENT" }, message: string) {
    const ticket = this.db.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    ticket.messages.push({ id: this.uid("tm"), ticketId, senderId: sender.id, senderName: sender.name, senderRole: sender.role, message, createdAt: this.now() });
    ticket.updatedAt = this.now();
    this.commit();
  }

  markNotificationRead(id: string) {
    const n = this.db.notifications.find((x) => x.id === id);
    if (n) {
      n.isRead = true;
      this.commit();
    }
  }

  markAllNotificationsRead(userId: string) {
    this.db.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    this.commit();
  }
}



