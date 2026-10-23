import i18n from "@/src/libs/i18n";
import type { DocumentCategory } from "@/src/types/documentTypes";

// Plain labels with no native code, so any screen can show a category without loading the file picker.
export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  prescription: "Prescription",
  lab_result: "Lab result",
  referral: "Referral",
  other: "Other",
};

export function categoryLabel(category: DocumentCategory): string {
  return i18n.t(`documents.${category}`, { defaultValue: CATEGORY_LABELS[category] });
}