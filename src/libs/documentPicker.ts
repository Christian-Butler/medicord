import i18n from "@/src/libs/i18n";
import {
  ALLOWED_DOCUMENT_TYPES,
  DOCUMENT_CATEGORIES,
  type DocumentCategory,
  type DocumentUploadInput,
} from "@/src/types/documentTypes";
import * as DocumentPicker from "expo-document-picker";
import { ActionSheetIOS, Alert, Platform } from "react-native";

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  prescription: "Prescription",
  lab_result: "Lab result",
  referral: "Referral",
  other: "Other",
};

export function categoryLabel(category: DocumentCategory): string {
  return i18n.t(`documents.${category}`, { defaultValue: CATEGORY_LABELS[category] });
}

// Asks what the document is before picking it, using the phone's own action sheet (no custom UI).
// Resolves to null if the user cancels.
export function chooseDocumentCategory(): Promise<DocumentCategory | null> {
  return new Promise((resolve) => {
    const labels = DOCUMENT_CATEGORIES.map(categoryLabel);
    const title = i18n.t("documents.whatKind", { defaultValue: "What kind of document is it?" });
    const cancel = i18n.t("documents.cancel", { defaultValue: "Cancel" });

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { title, options: [...labels, cancel], cancelButtonIndex: labels.length },
        (index) => resolve(index < labels.length ? DOCUMENT_CATEGORIES[index] : null)
      );
      return;
    }

    // Android alerts only fit three buttons, so the less common categories fall under Other there.
    Alert.alert(
      title,
      undefined,
      [
        { text: categoryLabel("prescription"), onPress: () => resolve("prescription") },
        { text: categoryLabel("lab_result"), onPress: () => resolve("lab_result") },
        { text: categoryLabel("other"), onPress: () => resolve("other") },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
}

const MIME_FROM_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  heic: "image/heic",
};

// Opens the Files picker limited to PDFs and photos. Resolves to null if the user cancels.
export async function pickDocumentFile(): Promise<Omit<DocumentUploadInput, "category"> | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ALLOWED_DOCUMENT_TYPES,
    copyToCacheDirectory: true, // gives us a file:// copy we're allowed to read and upload
    multiple: false,
  });

  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];

  // Some file providers don't report type or size, so work them out ourselves.
  const extension = asset.name.split(".").pop()?.toLowerCase() ?? "";
  const mimeType = asset.mimeType ?? MIME_FROM_EXTENSION[extension] ?? "";
  const size = asset.size ?? (await (await fetch(asset.uri)).blob()).size;

  return { uri: asset.uri, name: asset.name, mimeType, size };
}