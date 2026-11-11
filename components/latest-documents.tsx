import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useLatestDocument } from "@/src/hooks/useLatestDocument";
import { categoryLabel } from "@/src/libs/documentLabel";
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
    <View
      style={{
        paddingHorizontal: Sizes.p3,
        paddingTop: Sizes.h2
      }}>
      <Text
        style={{
          paddingLeft: Sizes.p0,
          fontSize: Sizes.h2,
          color: Colors.text
        }}>
        {t(`latest-documents.latest`)}
      </Text>

      <TouchableWithoutFeedback

        onPress={() => router.push({
          pathname: "/mr-documents"
        })}>
        <View
          style={{
            marginTop: Sizes.paragraph,
            backgroundColor: Colors.bg2,
            borderRadius: Sizes.p3,
            paddingHorizontal: Sizes.h5,
            paddingVertical: Sizes.h5,
          }}>
          <View className="flex-row items-center">
            <FontAwesome5
              name="clipboard-list"
              size={Sizes.IconLg}
              color={Colors.secondary}
              solid
            />

            <View
              style={{
                marginLeft: Sizes.p3
              }}
              className="flex-1">
              <View className="flex-row items-end">
                <Text
                  style={{
                    fontSize: Sizes.paragraph,
                    color: Colors.text
                  }}
                  numberOfLines={1} className="shrink font-medium">
                  {document ? categoryLabel(document.category) : t(`latest-documents.documents`, `Documents`)}
                </Text>
                {isNew ? (
                  <View
                    style={{
                      borderRadius: Sizes.imgApt,
                      paddingHorizontal: Sizes.p2,
                      borderWidth: Buttons.w0,
                      borderColor: Colors.success,
                      paddingVertical: Buttons.w2,
                      backgroundColor: Colors.successMuted,
                      marginHorizontal: Sizes.p3
                    }}>
                    <Text
                      style={{
                        fontSize: Sizes.p3,
                        color: Colors.text
                      }}
                      className="font-medium">
                      {t(`latest-documents.new`)}
                    </Text>
                  </View>
                ) : null}
              </View>
              {!loading ? (
                <Text
                  style={{
                    marginTop: Buttons.w2,
                    fontSize: Sizes.sm,
                    color: Colors.textMuted
                  }}
                  numberOfLines={1}>
                  {document ? `${document.title} · ${subtitle}` : subtitle}
                </Text>
              ) : null}
            </View>
            <MaterialIcons name="arrow-forward-ios" size={Sizes.h5} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}