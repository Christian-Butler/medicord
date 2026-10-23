import { useLatestDocument } from "@/src/hooks/useLatestDocument";
import { categoryLabel } from "@/src/libs/documentPicker";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableWithoutFeedback, View } from "react-native";

const NEW_FOR_MS = 7 * 24 * 60 * 60 * 1000;

export default function LatestDocuments() {

  const { t } = useTranslation();
  const { document, loading, refetch } = useLatestDocument();

  useFocusEffect(
    useCallback(() => {
      refetch().catch(() => { });
    }, [refetch])
  );

  const isNew = document ? Date.now() - new Date(document.created_at).getTime() < NEW_FOR_MS : false;
  const date = document
    ? new Date(document.created_at).toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";

  // "Received" when a doctor sent it, "Added" when the user uploaded it themselves.
  const subtitle = document
    ? document.doctor_id
      ? t("latest-documents.receivedOn", { defaultValue: "Received {{date}}", date })
      : t("latest-documents.addedOn", { defaultValue: "Added {{date}}", date })
    : t("latest-documents.none", "No documents yet. Tap to add one.");

  return (
    <View className=" px-4 pt-10">
      <Text className="pl-2 text-[24px] font-normal text-black">
        {t(`latest-documents.latest`)}
      </Text>

      <TouchableWithoutFeedback

        onPress={() => router.push({
          pathname: "/mr-documents"
        })}>
        <View className="mt-6 bg-[white] rounded-xl px-4 py-4 my-2">
          <View className="flex-row items-center">
            <FontAwesome5
              name="clipboard-list"
              size={40}
              color="#0D5175"
              solid
            />

            <View className="ml-4 flex-1">
              <View className="flex-row items-end">
                <Text numberOfLines={1} className="shrink text-[16px] font-medium text-black">
                  {document ? categoryLabel(document.category) : t("latest-documents.documents", "Documents")}
                </Text>
                {isNew ? (
                  <View className="mx-2 py-1 px-4 rounded-[10px] border-[2px] border-[#54B85D] bg-[#B1EDB1]">
                    <Text className="text-[12px] font-medium text-black">
                      {t(`latest-documents.new`)}
                    </Text>
                  </View>
                ) : null}
              </View>
              {!loading ? (
                <Text numberOfLines={1} className="mt-2 text-[14px] text-gray-600">
                  {document ? `${document.title} · ${subtitle}` : subtitle}
                </Text>
              ) : null}
            </View>
            <MaterialIcons name="arrow-forward-ios" size={18} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}