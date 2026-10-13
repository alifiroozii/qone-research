import {
  FileText,
  BookOpen,
  ClipboardList,
  PenLine,
  BarChart3,
  GraduationCap,
  LayoutGrid,
  Newspaper,
  Send,
  Search,
} from "lucide-react";

/**
 * Maps the `iconName` stored on each service to a concrete Lucide icon.
 * Centralized so services can be managed from the admin panel without
 * touching component code.
 */
export const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  BookOpen,
  ClipboardList,
  PenLine,
  BarChart3,
  GraduationCap,
  LayoutGrid,
  Newspaper,
  Send,
  Search,
};

export function getServiceIcon(iconName: string): React.ElementType {
  return SERVICE_ICON_MAP[iconName] ?? FileText;
}
