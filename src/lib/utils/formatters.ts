import { OrderStatus, Priority } from "@/types";

/**
 * Convert Latin digits to Persian digits
 */
export function toPersianDigits(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/\d/g, (x) => persianDigits[Number(x)]);
}

/**
 * Format currency with comma separation in Toman
 */
export function formatToman(amount: number | string | undefined | null, includeUnit = true): string {
  if (amount === undefined || amount === null) return "۰";
  const num = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  const formatted = Math.round(num).toLocaleString("en-US");
  const persian = toPersianDigits(formatted);
  return includeUnit ? `${persian} تومان` : persian;
}

/**
 * Format Rial
 */
export function formatRial(amountInToman: number | string | undefined | null): string {
  if (amountInToman === undefined || amountInToman === null) return "۰ ریال";
  const num = typeof amountInToman === "string" ? parseFloat(amountInToman) || 0 : amountInToman;
  const rial = Math.round(num * 10).toLocaleString("en-US");
  return `${toPersianDigits(rial)} ریال`;
}

/**
 * Accurate Gregorian to Jalali (Solar Hijri) Date Conversion
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/**
 * Format ISO date string to Persian Date (e.g. ۲۳ مهر ۱۴۰۳)
 */
export function formatPersianDate(dateString: string | Date | undefined | null, includeTime = false): string {
  if (!dateString) return "—";
  try {
    const d = typeof dateString === "string" ? new Date(dateString) : dateString;
    if (isNaN(d.getTime())) return "—";

    const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const monthName = PERSIAN_MONTHS[jm - 1];

    let result = `${toPersianDigits(jd)} ${monthName} ${toPersianDigits(jy)}`;

    if (includeTime) {
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      result += ` - ساعت ${toPersianDigits(`${hours}:${minutes}`)}`;
    }

    return result;
  } catch {
    return "—";
  }
}

/**
 * Format file size in bytes to human-readable Persian string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "۰ بایت";
  const k = 1024;
  const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${toPersianDigits(val)} ${sizes[i]}`;
}

/**
 * Status translation and badge colors
 */
export interface StatusMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}

export function getOrderStatusMeta(status: OrderStatus): StatusMeta {
  switch (status) {
    case "SUBMITTED":
      return {
        label: "ثبت‌شده",
        badgeBg: "bg-slate-50",
        badgeText: "text-slate-700",
        badgeBorder: "border-slate-200",
        dotColor: "bg-slate-400",
      };
    case "PENDING_REVIEW":
      return {
        label: "در انتظار بررسی",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        badgeBorder: "border-amber-200",
        dotColor: "bg-amber-500",
      };
    case "REQUIRES_INFO":
      return {
        label: "نیازمند اطلاعات بیشتر",
        badgeBg: "bg-orange-50",
        badgeText: "text-orange-700",
        badgeBorder: "border-orange-200",
        dotColor: "bg-orange-500",
      };
    case "QUOTED":
      return {
        label: "پیش‌فاکتور صادرشده",
        badgeBg: "bg-indigo-50",
        badgeText: "text-indigo-700",
        badgeBorder: "border-indigo-200",
        dotColor: "bg-indigo-500",
      };
    case "AWAITING_CLIENT":
      return {
        label: "در انتظار تأیید مشتری",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-700",
        badgeBorder: "border-blue-200",
        dotColor: "bg-blue-500",
      };
    case "AWAITING_PAYMENT":
      return {
        label: "در انتظار پرداخت",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-700",
        badgeBorder: "border-rose-200",
        dotColor: "bg-rose-500",
      };
    case "PAID":
      return {
        label: "پرداخت‌شده",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        badgeBorder: "border-emerald-200",
        dotColor: "bg-emerald-500",
      };
    case "ASSIGNED":
      return {
        label: "ارجاع‌شده به کارشناس",
        badgeBg: "bg-purple-50",
        badgeText: "text-purple-700",
        badgeBorder: "border-purple-200",
        dotColor: "bg-purple-500",
      };
    case "IN_PROGRESS":
      return {
        label: "در حال انجام",
        badgeBg: "bg-sky-50",
        badgeText: "text-sky-700",
        badgeBorder: "border-sky-200",
        dotColor: "bg-sky-500",
      };
    case "READY_FOR_REVIEW":
      return {
        label: "آماده بررسی مدیر",
        badgeBg: "bg-teal-50",
        badgeText: "text-teal-700",
        badgeBorder: "border-teal-200",
        dotColor: "bg-teal-500",
      };
    case "REVISION_REQUESTED":
      return {
        label: "نیازمند اصلاح",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-800",
        badgeBorder: "border-amber-300",
        dotColor: "bg-amber-600",
      };
    case "READY_FOR_DELIVERY":
      return {
        label: "آماده تحویل",
        badgeBg: "bg-cyan-50",
        badgeText: "text-cyan-700",
        badgeBorder: "border-cyan-200",
        dotColor: "bg-cyan-500",
      };
    case "COMPLETED":
      return {
        label: "تکمیل‌شده",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-800",
        badgeBorder: "border-emerald-300",
        dotColor: "bg-emerald-600",
      };
    case "PAUSED":
      return {
        label: "متوقف‌شده",
        badgeBg: "bg-zinc-100",
        badgeText: "text-zinc-700",
        badgeBorder: "border-zinc-300",
        dotColor: "bg-zinc-500",
      };
    case "CANCELLED":
      return {
        label: "لغوشده",
        badgeBg: "bg-red-50",
        badgeText: "text-red-700",
        badgeBorder: "border-red-200",
        dotColor: "bg-red-500",
      };
    default:
      return {
        label: status,
        badgeBg: "bg-gray-50",
        badgeText: "text-gray-700",
        badgeBorder: "border-gray-200",
        dotColor: "bg-gray-400",
      };
  }
}

export function getPriorityMeta(priority: Priority): { label: string; colorClass: string } {
  switch (priority) {
    case "LOW":
      return { label: "عادی / کم", colorClass: "text-slate-600 bg-slate-100 border-slate-200" };
    case "NORMAL":
      return { label: "متوسط", colorClass: "text-blue-700 bg-blue-50 border-blue-200" };
    case "HIGH":
      return { label: "فوری", colorClass: "text-amber-700 bg-amber-50 border-amber-200" };
    case "URGENT":
      return { label: "خیلی فوری / اضطراری", colorClass: "text-rose-700 bg-rose-50 border-rose-200" };
    default:
      return { label: priority, colorClass: "text-gray-600 bg-gray-100 border-gray-200" };
  }
}
