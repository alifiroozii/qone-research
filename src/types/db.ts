import {
  FileAsset,
  Message,
  Notification,
  Order,
  Quotation,
  PaymentRecord,
  RevisionRequest,
  Deliverable,
  ServiceCategory,
  ServiceItem,
  SupportTicket,
  User,
} from "@/types";

/**
 * The full shape of the demo database held in the client store.
 * Mirrors the Prisma schema so switching to a real backend later
 * requires minimal changes to the UI layer.
 */
export interface AppDatabase {
  users: User[];
  serviceCategories: ServiceCategory[];
  services: ServiceItem[];
  orders: Order[];
  quotations: Quotation[];
  payments: PaymentRecord[];
  messages: Message[];
  files: FileAsset[];
  notifications: Notification[];
  supportTickets: SupportTicket[];
  // Derived collections kept inside orders (milestones, deliverables, revisions)
  revisions: RevisionRequest[];
  deliverables: Deliverable[];
}

export const DB_KEY = "database";
export const AUTH_KEY = "session";
export const BRAND_KEY = "brand";
