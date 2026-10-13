import { AppDatabase } from "@/types/db";
import type {
  Order,
  User,
  ServiceItem,
  ServiceCategory,
  Quotation,
  PaymentRecord,
  Message,
  FileAsset,
  Notification,
  SupportTicket,
  OrderMilestone,
} from "@/types";
import { SERVICES_LIST } from "@/lib/constants/brand";

/**
 * Seed data factory for Demo Mode.
 * Generates a coherent, fully Persian dataset: 1 admin, 3 experts,
 * 8 clients, 20 orders across all lifecycle stages, quotations,
 * payments, messages, files, notifications and support tickets.
 *
 * IMPORTANT: financial figures (payments vs. quotations vs. orders)
 * are kept internally consistent so charts and totals match.
 * Dates are anchored to a fixed "now" so the dataset is deterministic.
 */

const NOW = new Date("2026-02-15T10:30:00.000Z");
const day = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(NOW.getTime() - n * day).toISOString();
const daysAhead = (n: number) => new Date(NOW.getTime() + n * day).toISOString();

const admin: User = {
  id: "usr-admin-1",
  email: "admin@qoneresearch.com",
  username: "admin",
  phone: "09120000001",
  fullName: "سارا محمدی",
  role: "ADMIN",
  isActive: true,
};

const experts: User[] = [
  {
    id: "usr-exp-1",
    email: "rezaei@qoneresearch.com",
    username: "expert",
    phone: "09120000002",
    fullName: "دکتر حمید رضایی",
    role: "EXPERT",
    isActive: true,
    academicRank: "استادیار",
    specialties: ["آمار و تحلیل داده", "مدل‌سازی معادلات ساختاری", "SPSS"],
    rating: 4.9,
    completedProjectsCount: 87,
  },
  {
    id: "usr-exp-2",
    email: "karimi@qoneresearch.com",
    phone: "09120000003",
    fullName: "دکتر مریم کریمی",
    role: "EXPERT",
    isActive: true,
    academicRank: "دانشیار",
    specialties: ["ویرایش علمی", "نگارش انگلیسی", "انتشار در مجلات ISI"],
    rating: 4.8,
    completedProjectsCount: 124,
  },
  {
    id: "usr-exp-3",
    email: "nasiri@qoneresearch.com",
    phone: "09120000004",
    fullName: "دکتر علی نصیری",
    role: "EXPERT",
    isActive: true,
    academicRank: "استاد",
    specialties: ["پایان‌نامه و رساله", "روش تحقیق", "پروپوزال"],
    rating: 5.0,
    completedProjectsCount: 63,
  },
];


// ---------- Orders ----------
const statusFlow: Order["status"][] = [
  "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED",
  "READY_FOR_DELIVERY", "REVISION_REQUESTED", "IN_PROGRESS", "IN_PROGRESS",
  "ASSIGNED", "PAID", "AWAITING_PAYMENT", "AWAITING_CLIENT", "QUOTED",
  "PENDING_REVIEW", "PENDING_REVIEW", "PENDING_REVIEW", "REQUIRES_INFO",
  "SUBMITTED", "SUBMITTED", "CANCELLED",
];

const priorities: Order["priority"][] = [
  "NORMAL", "HIGH", "NORMAL", "URGENT", "NORMAL", "HIGH", "NORMAL",
  "LOW", "NORMAL", "HIGH", "NORMAL", "NORMAL", "URGENT", "NORMAL",
  "HIGH", "NORMAL", "NORMAL", "LOW", "NORMAL", "HIGH",
];

const languages: Order["language"][] = ["fa", "en", "bilingual"];

const PAID_STAGES: Order["status"][] = ["PAID", "ASSIGNED", "IN_PROGRESS", "READY_FOR_REVIEW", "REVISION_REQUESTED", "READY_FOR_DELIVERY", "COMPLETED"];
const ASSIGNED_STAGES: Order["status"][] = ["ASSIGNED", "IN_PROGRESS", "READY_FOR_REVIEW", "REVISION_REQUESTED", "READY_FOR_DELIVERY", "COMPLETED"];
const PRE_QUOTE: Order["status"][] = ["SUBMITTED", "PENDING_REVIEW", "REQUIRES_INFO", "CANCELLED"];

function makeMilestones(orderId: string, count: number): OrderMilestone[] {
  const titles = [
    "بررسی اولیه و جمع‌بندی نیازها",
    "تدوین ساختار و چارچوب نظری",
    "اجرای تحلیل / نگارش بدنه",
    "بازبینی نهایی و اصلاحات",
  ];
  return Array.from({ length: count }, (_, i) => {
    const done = i < count - 1;
    return {
      id: `${orderId}-ms-${i + 1}`,
      orderId,
      title: titles[i] ?? `مرحله ${i + 1}`,
      orderIndex: i,
      status: done ? "COMPLETED" : i === count - 1 ? "IN_PROGRESS" : "PENDING",
      startedAt: done ? daysAgo(20 - i * 3) : i === count - 1 ? daysAgo(3) : undefined,
      completedAt: done ? daysAgo(17 - i * 3) : undefined,
    };
  });
}

const orders: Order[] = [];
const quotations: Quotation[] = [];
const payments: PaymentRecord[] = [];
const messages: Message[] = [];
const files: FileAsset[] = [];
const notifications: Notification[] = [];

const clientNames = [
  ["زهرا احمدی", "دانشگاه تهران", "روان‌شناسی"],
  ["محمد حسینی", "دانشگاه شیراز", "مدیریت بازرگانی"],
  ["فاطمه رضوی", "دانشگاه فردوسی مشهد", "علوم کامپیوتر"],
  ["امیر صادقی", "صنعتی امیرکبیر", "مهندسی صنایع"],
  ["نازنین موسوی", "دانشگاه اصفهان", "علوم تربیتی"],
  ["رضا قاسمی", "دانشگاه علم و صنعت", "مهندسی برق"],
  ["سمیرا کاظمی", "دانشگاه علامه طباطبایی", "حقوق"],
  ["حسین مرادی", "دانشگاه رازی کرمانشاه", "زیست‌شناسی"],
] as const;

const clients: User[] = clientNames.map((c, i) => ({
  id: `usr-cli-${i + 1}`,
  email: `client${i + 1}@example.com`,
  username: `client${i + 1}`,
  phone: `0912111000${i + 1}`,
  fullName: c[0],
  role: "CLIENT",
  isActive: true,
  university: c[1],
  major: c[2],
  degree: i % 3 === 0 ? "دکتری" : i % 3 === 1 ? "کارشناسی ارشد" : "کارشناسی",
}));

const users = [admin, ...experts, ...clients];

const serviceCategories: ServiceCategory[] = [
  { id: "cat-1", name: "مشاوره و راهنمایی پژوهشی", slug: "consulting", sortOrder: 1 },
  { id: "cat-2", name: "نگارش و ویرایش علمی", slug: "writing", sortOrder: 2 },
  { id: "cat-3", name: "تحلیل داده و روش‌شناسی", slug: "analysis", sortOrder: 3 },
];

const categoryOf: Record<string, string> = {
  "srv-1": "cat-1", "srv-2": "cat-1", "srv-3": "cat-1", "srv-8": "cat-1",
  "srv-4": "cat-2", "srv-7": "cat-2", "srv-9": "cat-2", "srv-10": "cat-2",
  "srv-5": "cat-3", "srv-6": "cat-3",
};

const services: ServiceItem[] = SERVICES_LIST.map((s) => ({
  ...s,
  categoryId: categoryOf[s.id],
}));

statusFlow.forEach((status, idx) => {
  const client = clients[idx % clients.length];
  const service = services[idx % services.length];
  const expert = experts[idx % experts.length];
  const id = `ord-${String(idx + 1).padStart(3, "0")}`;
  const trackingCode = `QR-2026-${String(idx + 125).padStart(6, "0")}`;
  const created = daysAgo(45 - idx * 2);
  const isPaid = PAID_STAGES.includes(status);
  const isQuoted = !PRE_QUOTE.includes(status);
  const isAssigned = ASSIGNED_STAGES.includes(status);
  const price = service.basePrice + (idx % 4) * 500000;
  const discount = idx % 3 === 0 ? 500000 : 0;
  const payable = price - discount;
  const msCount = 3 + (idx % 2);

  const order: Order = {
    id,
    trackingCode,
    title: `${service.title} — ${client.major ?? "پژوهش"}`,
    serviceId: service.id,
    serviceTitle: service.title,
    clientId: client.id,
    clientName: client.fullName,
    clientEmail: client.email,
    expertId: isAssigned ? expert.id : undefined,
    expertName: isAssigned ? expert.fullName : undefined,
    status,
    priority: priorities[idx],
    fieldOfStudy: client.major ?? "عمومی",
    degreeLevel: client.degree ?? "کارشناسی ارشد",
    workVolume: `${4 + (idx % 5)} صفحه`,
    language: languages[idx % 3],
    targetDeadline: daysAhead(5 + (idx % 10)),
    notes: "خلاصه درخواست ثبت‌شده توسط مشتری برای بررسی تخصصی.",
    agreedPrice: isQuoted ? payable : undefined,
    currency: "IRT",
    isPaid,
    createdAt: created,
    updatedAt: daysAgo(Math.max(0, 30 - idx)),
    milestones: isAssigned ? makeMilestones(id, msCount) : [],
    statusHistory: [
      { id: `${id}-h1`, orderId: id, fromStatus: "SUBMITTED", toStatus: status, note: "ثبت اولیه سفارش", changedByName: "سیستم", createdAt: created },
    ],
    quotations: [],
    invoices: [],
    payments: [],
    messages: [],
    files: [],
    deliverables: [],
    revisions: [],
  };

  if (isQuoted) {
    const q: Quotation = {
      id: `qt-${id}`,
      quotationNumber: `QT-2026-${String(idx + 1).padStart(4, "0")}`,
      orderId: id,
      totalAmount: price,
      discountAmount: discount,
      payableAmount: payable,
      expiresAt: daysAhead(10),
      deliveryDays: service.turnaroundDays,
      includedRevisions: 2,
      terms: "پرداخت کامل پیش از شروع کار. شامل ۲ نوبت اصلاح رایگان می‌باشد.",
      status: isPaid ? "ACCEPTED" : "PENDING",
      createdAt: daysAgo(40 - idx * 2),
      items: [{ id: `qt-${id}-i1`, description: service.title, unitPrice: payable, quantity: 1, total: payable }],
    };
    quotations.push(q);
    order.quotations = [q];
  }

  if (isPaid) {
    const p: PaymentRecord = {
      id: `pay-${id}`,
      paymentCode: `PAY-2026-${String(idx + 89).padStart(4, "0")}`,
      invoiceId: undefined,
      orderId: id,
      amount: payable,
      gateway: "DEMO",
      status: "COMPLETED",
      referenceId: `DEMO${id.toUpperCase()}`,
      trackingNumber: `${1000000 + idx}`,
      paidAt: daysAgo(25 - idx),
      createdAt: daysAgo(25 - idx),
    };
    payments.push(p);
    order.payments = [p];
  }

  if (isAssigned) {
    const m: Message = {
      id: `msg-${id}-1`,
      orderId: id,
      senderId: expert.id,
      senderName: expert.fullName,
      senderRole: "EXPERT",
      content: "سلام، پروژه شما در دست بررسی است. در صورت نیاز به فایل‌های تکمیلی اطلاع می‌دهم.",
      isRead: idx % 2 === 0,
      createdAt: daysAgo(10 - (idx % 5)),
    };
    messages.push(m);
    order.messages = [m];
  }

  if (idx % 2 === 0) {
    const f: FileAsset = {
      id: `file-${id}-1`,
      orderId: id,
      uploaderId: client.id,
      uploaderName: client.fullName,
      fileName: `${client.major ?? "research"}-draft-${idx + 1}.pdf`,
      fileType: "application/pdf",
      fileSize: 1_200_000 + idx * 120_000,
      fileUrl: "#",
      category: "CLIENT_UPLOAD",
      isFinal: false,
      version: 1,
      createdAt: daysAgo(43 - idx * 2),
    };
    files.push(f);
    order.files = [f];
  }

  notifications.push({
    id: `not-${id}-c`,
    userId: client.id,
    title: "به‌روزرسانی سفارش",
    message: `وضعیت سفارش ${trackingCode} به‌روزرسانی شد.`,
    link: `/panel/client/orders/${id}`,
    type: "ORDER",
    isRead: idx % 3 === 0,
    createdAt: daysAgo(20 - idx),
  });

  orders.push(order);
});

// ---------- Support tickets ----------
const supportTickets: SupportTicket[] = [
  {
    id: "tck-1",
    ticketNumber: "TCK-2026-0007",
    userId: clients[0].id,
    userName: clients[0].fullName,
    subject: "پرسش درباره مهلت تحویل سفارش",
    category: "سفارش‌ها",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    messages: [
      {
        id: "tck-1-m1",
        ticketId: "tck-1",
        senderId: clients[0].id,
        senderName: clients[0].fullName,
        senderRole: "CLIENT",
        message: "سلام، امکان تسریع تحویل سفارش QR-2026-000125 وجود دارد؟",
        createdAt: daysAgo(3),
      },
      {
        id: "tck-1-m2",
        ticketId: "tck-1",
        senderId: admin.id,
        senderName: admin.fullName,
        senderRole: "ADMIN",
        message: "سلام، درخواست شما بررسی شد. کارشناس تا پایان هفته نسخه اولیه را ارسال می‌کند.",
        createdAt: daysAgo(1),
      },
    ],
  },
  {
    id: "tck-2",
    ticketNumber: "TCK-2026-0008",
    userId: clients[2].id,
    userName: clients[2].fullName,
    subject: "مشکل در بارگذاری فایل",
    category: "فنی",
    priority: "HIGH",
    status: "OPEN",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    messages: [
      {
        id: "tck-2-m1",
        ticketId: "tck-2",
        senderId: clients[2].id,
        senderName: clients[2].fullName,
        senderRole: "CLIENT",
        message: "فایل اکسل من هنگام آپلود خطا می‌دهد. حجم آن ۱۲ مگابایت است.",
        createdAt: daysAgo(1),
      },
    ],
  },
];

[
  { u: admin.id, t: "سفارش جدید ثبت شد", m: "یک درخواست جدید با کد QR-2026-000138 منتظر بررسی است.", l: "/panel/admin/orders", read: false, d: 1 },
  { u: admin.id, t: "پرداخت آزمایشی موفق", m: "پرداخت سفارش QR-2026-000134 با موفقیت ثبت شد.", l: "/panel/admin/payments", read: false, d: 2 },
  { u: experts[0].id, t: "ارجاع پروژه جدید", m: "پروژه‌ای به شما ارجاع شد. لطفاً بررسی کنید.", l: "/panel/expert/assigned", read: false, d: 1 },
  { u: experts[1].id, t: "پیام جدید", m: "پیام جدیدی در یکی از پروژه‌های شما ثبت شده است.", l: "/panel/expert/messages", read: true, d: 4 },
].forEach((n, i) => {
  notifications.push({
    id: `not-extra-${i}`,
    userId: n.u,
    title: n.t,
    message: n.m,
    link: n.l,
    type: "ORDER",
    isRead: n.read,
    createdAt: daysAgo(n.d),
  });
});

export function createSeedDatabase(): AppDatabase {
  return {
    users,
    serviceCategories,
    services,
    orders,
    quotations,
    payments,
    messages,
    files,
    notifications,
    supportTickets,
    revisions: [],
    deliverables: [],
  };
}

export const DEMO_ACCOUNTS = [
  { role: "ADMIN" as const, label: "مدیر کل", email: admin.email, name: admin.fullName, password: "demo1234" },
  { role: "EXPERT" as const, label: "کارشناس", email: experts[0].email, name: experts[0].fullName, password: "demo1234" },
  { role: "CLIENT" as const, label: "مشتری", email: clients[0].email, name: clients[0].fullName, password: "demo1234" },
];

export { NOW, daysAgo, daysAhead };

