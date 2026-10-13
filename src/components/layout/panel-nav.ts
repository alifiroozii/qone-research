export interface NavItem {
  href: string;
  label: string;
  /** Icon key resolved on the client via PANEL_ICON_MAP (never pass components across the server/client boundary). */
  icon: string;
  badgeKey?: "orders" | "unreadMessages" | "unreadNotifications" | "tickets" | "pendingQuotations";
}

export const CLIENT_NAV: NavItem[] = [
  { href: "/panel/client", label: "داشبورد", icon: "dashboard" },
  { href: "/panel/client/new-request", label: "ثبت درخواست جدید", icon: "plus" },
  { href: "/panel/client/orders", label: "سفارش‌های من", icon: "orders", badgeKey: "orders" },
  { href: "/panel/client/messages", label: "پیام‌ها", icon: "messages", badgeKey: "unreadMessages" },
  { href: "/panel/client/files", label: "فایل‌های من", icon: "files" },
  { href: "/panel/client/quotations", label: "پیش‌فاکتورها", icon: "receipt" },
  { href: "/panel/client/payments", label: "پرداخت‌ها", icon: "payments" },
  { href: "/panel/client/notifications", label: "اعلان‌ها", icon: "bell", badgeKey: "unreadNotifications" },
  { href: "/panel/client/support", label: "پشتیبانی", icon: "support", badgeKey: "tickets" },
  { href: "/panel/client/profile", label: "پروفایل", icon: "user" },
];

export const EXPERT_NAV: NavItem[] = [
  { href: "/panel/expert", label: "داشبورد", icon: "dashboard" },
  { href: "/panel/expert/assigned", label: "پروژه‌های ارجاع‌شده", icon: "handshake" },
  { href: "/panel/expert/tasks", label: "وظایف من", icon: "orders" },
  { href: "/panel/expert/schedule", label: "زمان‌بندی", icon: "schedule" },
  { href: "/panel/expert/messages", label: "پیام‌ها", icon: "messages", badgeKey: "unreadMessages" },
  { href: "/panel/expert/files", label: "فایل‌ها", icon: "files" },
  { href: "/panel/expert/deliverables", label: "تحویل‌ها", icon: "send" },
  { href: "/panel/expert/notifications", label: "اعلان‌ها", icon: "bell", badgeKey: "unreadNotifications" },
  { href: "/panel/expert/profile", label: "پروفایل", icon: "user" },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/panel/admin", label: "داشبورد", icon: "dashboard" },
  { href: "/panel/admin/orders", label: "مدیریت سفارش‌ها", icon: "orders", badgeKey: "orders" },
  { href: "/panel/admin/new-orders", label: "سفارش‌های جدید", icon: "plus" },
  { href: "/panel/admin/clients", label: "مدیریت مشتریان", icon: "users" },
  { href: "/panel/admin/experts", label: "مدیریت کارشناسان", icon: "expert" },
  { href: "/panel/admin/quotations", label: "پیش‌فاکتورها", icon: "receipt", badgeKey: "pendingQuotations" },
  { href: "/panel/admin/payments", label: "مدیریت پرداخت‌ها", icon: "payments" },
  { href: "/panel/admin/reports", label: "گزارش‌ها", icon: "reports" },
  { href: "/panel/admin/services", label: "خدمات و تعرفه‌ها", icon: "services" },
  { href: "/panel/admin/messages", label: "پیام‌ها", icon: "messages" },
  { href: "/panel/admin/support", label: "پشتیبانی", icon: "support", badgeKey: "tickets" },
  { href: "/panel/admin/notifications", label: "اعلان‌ها", icon: "bell", badgeKey: "unreadNotifications" },
  { href: "/panel/admin/settings", label: "تنظیمات", icon: "settings" },
];

