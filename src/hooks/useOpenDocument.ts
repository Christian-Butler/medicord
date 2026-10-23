import { getDocumentUrl } from "@/src/api/documents/api";
import type { MedicalDocument } from "@/src/types/documentTypes";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

export function useOpenDocument() {
  const [openingId, setOpeningId] = useState<string | null>(null);
  const { t } = useTranslation();

  const open = useCallback(
    async (document: MedicalDocument) => {
      setOpeningId(document.id);
      try {
        // A one-minute link is enough: the in-app browser starts loading it straight away.
        const url = await getDocumentUrl(document);
        await WebBrowser.openBrowserAsync(url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        });
      } catch (err) {
        Alert.alert(
          t("documents.openFailed", "Couldn't open document"),
          err instanceof Error ? err.message : undefined
        );
      } finally {
        setOpeningId(null);
      }
    },
    [t]
  );

  return { open, openingId };
}