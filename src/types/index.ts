export type Role = "ADMIN" | "EXPERT" | "CLIENT";

export type OrderStatus =
  | "SUBMITTED"            // ۱. ثبت‌شده
  | "PENDING_REVIEW"       // ۲. در انتظار بررسی
  | "REQUIRES_INFO"        // ۳. نیازمند اطلاعات بیشتر
  | "QUOTED"               // ۴. پیش‌فاکتور صادرشده
  | "AWAITING_CLIENT"      // ۵. در انتظار تأیید مشتری
  | "AWAITING_PAYMENT"     // ۶. در انتظار پرداخت
  | "PAID"                 // ۷. پرداخت‌شده
  | "ASSIGNED"             // ۸. ارجاع‌شده به کارشناس
  | "IN_PROGRESS"          // ۹. در حال انجام
  | "READY_FOR_REVIEW"     // ۱۰. آماده بررسی مدیر
  | "REVISION_REQUESTED"   // ۱۱. نیازمند اصلاح
  | "READY_FOR_DELIVERY"   // ۱۲. آماده تحویل
  | "COMPLETED"            // ۱۳. تکمیل‌شده
  | "PAUSED"               // ۱۴. متوقف‌شده
  | "CANCELLED";           // ۱۵. لغوشده

export type MilestoneStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type QuotationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type InvoiceStatus = "UNPAID" | "PAID" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type Priority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type FileCategory = "CLIENT_UPLOAD" | "REFERENCE" | "DELIVERABLE" | "REVISION";

export interface User {
  id: string;
  email: string;
  username?: string;
  phone?: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
  isActive: boolean;
  university?: string;
  major?: string;
  degree?: string;
  academicRank?: string;
  specialties?: string[];
  rating?: number;
  completedProjectsCount?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

export interface ServiceItem {
  id: string;
  categoryId?: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  basePrice: number; // in Toman
  turnaroundDays: number;
  isActive: boolean;
  features: string[];
  sortOrder: number;
}

export interface OrderMilestone {
  id: string;
  orderId: string;
  title: string;
  description?: string;
  orderIndex: number;
  status: MilestoneStatus;
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  note?: string;
  changedByName: string;
  createdAt: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // QUOT-2026-0012
  orderId: string;
  totalAmount: number;
  discountAmount: number;
  payableAmount: number;
  expiresAt: string;
  deliveryDays: number;
  includedRevisions: number;
  terms?: string;
  status: QuotationStatus;
  createdAt: string;
  items: QuotationItem[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-2026-0012
  quotationId?: string;
  orderId: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  paidAt?: string;
}

export interface PaymentRecord {
  id: string;
  paymentCode: string; // PAY-2026-0089
  orderId: string;
  invoiceId?: string;
  amount: number;
  gateway: string;
  status: PaymentStatus;
  referenceId?: string;
  trackingNumber?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  content: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FileAsset {
  id: string;
  orderId: string;
  uploaderId: string;
  uploaderName: string;
  fileName: string;
  fileType: string;
  fileSize: number; // bytes
  fileUrl: string;
  category: FileCategory;
  isFinal: boolean;
  version: number;
  createdAt: string;
}

export interface Deliverable {
  id: string;
  orderId: string;
  expertId: string;
  expertName: string;
  title: string;
  notes?: string;
  version: number;
  fileAsset?: FileAsset;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REVISION_NEEDED";
  createdAt: string;
}

export interface RevisionRequest {
  id: string;
  orderId: string;
  deliverableId?: string;
  clientId: string;
  clientName: string;
  reason: string;
  details: string;
  status: "REQUESTED" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ORDER" | "PAYMENT";
  isRead: boolean;
  createdAt: string;
}

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
}

export interface Order {
  id: string;
  trackingCode: string; // QR-2026-000125
  title: string;
  serviceId: string;
  serviceTitle: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  expertId?: string;
  expertName?: string;
  status: OrderStatus;
  priority: Priority;
  fieldOfStudy: string;
  degreeLevel: string;
  workVolume?: string;
  language: "fa" | "en" | "bilingual";
  targetDeadline?: string;
  notes?: string;
  agreedPrice?: number;
  currency: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  milestones: OrderMilestone[];
  statusHistory: OrderStatusHistoryItem[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  messages: Message[];
  files: FileAsset[];
  deliverables: Deliverable[];
  revisions: RevisionRequest[];
}

export interface BrandConfig {
  brandNameEn: string;
  brandNameFa: string;
  sloganFa: string;
  sloganEn: string;
  domain: string;
  supportPhone: string;
  supportEmail: string;
  addressFa: string;
  logoConcept: "concept1" | "concept2" | "concept3";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  seoTitle: string;
  seoDescription: string;
}
