import { getDocumentUrl } from "@/src/api/documents/api";
import type { MedicalDocument } from "@/src/types/documentTypes";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";


function cacheFileFor(document: MedicalDocument): File {
  const extension = document.file_path.split(".").pop() ?? "pdf";
  const safeTitle = document.title.replace(/[^\w\- ]+/g, "").trim() || "document";
  return new File(Paths.cache, `${safeTitle}-${document.id.slice(0, 8)}.${extension}`);
}

export function useShareDocument() {
  const [sharingId, setSharingId] = useState<string | null>(null);
  const { t } = useTranslation();

  const share = useCallback(
    async (document: MedicalDocument) => {
      setSharingId(document.id);
      try {
        if (!(await Sharing.isAvailableAsync())) {
          throw new Error(t("documents.shareUnavailable", "Sharing isn't available on this device."));
        }

     
        const file = cacheFileFor(document);
        if (!file.exists) {
          const url = await getDocumentUrl(document);
          await File.downloadFileAsync(url, file);
        }

        await Sharing.shareAsync(file.uri, { mimeType: document.mime_type, dialogTitle: document.title });
      } catch (err) {
        Alert.alert(
          t("documents.shareFailed", "Couldn't share document"),
          err instanceof Error ? err.message : undefined
        );
      } finally {
        setSharingId(null);
      }
    },
    [t]
  );

  return { share, sharingId };
}