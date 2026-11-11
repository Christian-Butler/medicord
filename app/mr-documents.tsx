import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useDeleteDocument } from "@/src/hooks/useDeleteDocument";
import { useDocuments } from "@/src/hooks/useDocuments";
import { useOpenDocument } from "@/src/hooks/useOpenDocument";
import { useShareDocument } from "@/src/hooks/useShareDocument";
import { useUploadDocument } from "@/src/hooks/useUploadDocument";
import { categoryLabel } from "@/src/libs/documentLabel";
import { chooseDocumentCategory, pickDocumentFile } from "@/src/libs/documentPicker";
import type { DocumentCategory, MedicalDocument } from "@/src/types/documentTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActionSheetIOS, Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const CATEGORY_ICONS: Record<DocumentCategory, keyof typeof MaterialIcons.glyphMap> = {
    prescription: "assignment",
    lab_result: "science",
    referral: "forward-to-inbox",
    other: "description",
};

// Newest first, split by the year the document was added: [["2026", [...]], ["2025", [...]]]
function groupByYear(documents: MedicalDocument[]): [string, MedicalDocument[]][] {
    const groups = new Map<string, MedicalDocument[]>();
    for (const document of documents) {
        const year = String(new Date(document.created_at).getFullYear());
        groups.set(year, [...(groups.get(year) ?? []), document]);
    }
    return [...groups.entries()];
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
}

export default function Documents() {

    const { t } = useTranslation();
    const { documents, loading, refetch } = useDocuments();
    const { upload, uploading } = useUploadDocument(refetch);
    const { remove } = useDeleteDocument(refetch);
    const { open, openingId } = useOpenDocument();
    const { share, sharingId } = useShareDocument();

    const years = useMemo(() => groupByYear(documents), [documents]);

    useFocusEffect(
        useCallback(() => {
            refetch().catch(() => { });
        }, [refetch])
    );

    // Category first, then the file, then upload. Cancelling at any point just stops.
    async function handleAddDocument() {
        const category = await chooseDocumentCategory();
        if (!category) return;

        const file = await pickDocumentFile();
        if (!file) return;

        try {
            await upload({ ...file, category });
        } catch (err) {
            Alert.alert(
                t("mr-documents.failedTitle", "Couldn't add document"),
                err instanceof Error ? err.message : t("mr-documents.failed", "Something went wrong. Please try again.")
            );
        }
    }

    // Deleting a medical document can't be undone, so it always asks first.
    function confirmDelete(document: MedicalDocument) {
        Alert.alert(
            t("mr-documents.deleteTitle", "Delete this document?"),
            t("mr-documents.deleteBody", { defaultValue: "\"{{title}}\" will be removed for good.", title: document.title }),
            [
                { text: t("mr-documents.cancel", "Cancel"), style: "cancel" },
                {
                    text: t("mr-documents.delete", "Delete"),
                    style: "destructive",
                    onPress: () => {
                        remove(document).catch((err) =>
                            Alert.alert(
                                t("mr-documents.deleteFailed", "Couldn't delete document"),
                                err instanceof Error ? err.message : undefined
                            )
                        );
                    },
                },
            ]
        );
    }

    // The "…" button: Share or Delete, using the phone's own action sheet.
    function showOptions(document: MedicalDocument) {
        const shareLabel = t("mr-documents.share", "Share");
        const deleteLabel = t("mr-documents.delete", "Delete");
        const cancelLabel = t("mr-documents.cancel", "Cancel");

        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                { title: document.title, options: [shareLabel, deleteLabel, cancelLabel], destructiveButtonIndex: 1, cancelButtonIndex: 2 },
                (index) => {
                    if (index === 0) share(document);
                    if (index === 1) confirmDelete(document);
                }
            );
            return;
        }

        Alert.alert(document.title, undefined, [
            { text: shareLabel, onPress: () => share(document) },
            { text: deleteLabel, style: "destructive", onPress: () => confirmDelete(document) },
            { text: cancelLabel, style: "cancel" },
        ]);
    }

    return (

        <View
            style={{ backgroundColor: Colors.bg1 }}
            className="flex-1">

            <ScrollView className="flex-1">

                <ScreenHeader title={t("mr-documents.title")} />

                <View
                    style={{ margin: Sizes.h5, paddingBottom: Sizes.h2 }}>

                    <View style={{ paddingTop: Sizes.p2, paddingBottom: Sizes.p2 }}>
                        <Text style={{ fontSize: Sizes.paragraph }}>{t("mr-documents.privacy")}</Text>
                    </View>

                    {!loading && documents.length === 0 ? (
                        <Text
                            style={{ paddingTop: Sizes.p2, color: Colors.textMuted }}
                        >
                            {t("mr-documents.empty", "No documents yet. Add a prescription, lab result or referral to keep it here.")}
                        </Text>
                    ) : null}

                    {years.map(([year, yearDocuments]) => (
                        <View key={year}>
                            <View
                                style={{ paddingTop: Sizes.paragraph }}
                                className="justify-between flex-row items-center">
                                <Text
                                    style={{ fontSize: Sizes.h5 }}
                                >{year} </Text>
                                <View
                                    style={{ width: Sizes.width - 100, backgroundColor: Colors.textMuted }}
                                    className="h-0.5 rounded-full self-endline" />
                            </View>

                            {yearDocuments.map((document) => (
                                <View key={document.id} style={{ paddingTop: Sizes.h4 }}
                                    className="flex-1 flex-row items-center" >
                                    <TouchableOpacity
                                        className="flex-1 flex-row items-center"
                                        accessibilityRole="button"
                                        disabled={openingId === document.id}
                                        onPress={() => open(document)}
                                    >
                                        <MaterialIcons name={CATEGORY_ICONS[document.category]} size={Sizes.IconLg} color={Colors.secondary} />
                                        <View
                                            style={{ paddingLeft: Sizes.p1 }}
                                            className="flex-1">
                                            <Text numberOfLines={1}>{document.title}</Text>
                                            <View
                                                style={{ paddingTop: Sizes.p1 }}
                                                className="flex-row items-center">
                                                <Text style={{ color: Colors.textMuted }}>
                                                    {document.doctors?.full_name ?? categoryLabel(document.category)}{" "}
                                                </Text>
                                                <MaterialIcons name="circle" size={Sizes.p1} color={Colors.textMuted} />
                                                <Text style={{ color: Colors.textMuted }}> {formatDate(document.created_at)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    <View
                                        style={{ paddingLeft: Sizes.paragraph }}
                                        className="self-center">
                                        <TouchableOpacity
                                            style={{ borderWidth: Buttons.w2, borderColor: Colors.secondary }}
                                            className="justify-center p-1 items-center rounded-full"
                                            accessibilityRole="button"
                                            accessibilityLabel={t("mr-documents.options", "Document options")}
                                            disabled={sharingId === document.id}
                                            onPress={() => showOptions(document)}
                                        >
                                            <MaterialIcons name="more-horiz" size={Sizes.h5} color={Colors.secondary} ></MaterialIcons>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}

                </View>


            </ScrollView>

            <TouchableOpacity
                style={{ backgroundColor: Colors.primary, height: Buttons.height, paddingHorizontal: Sizes.h5, borderRadius: Sizes.p3 }}
                className="absolute bottom-16 self-center flex-row mdc-fab flex-row items-center elevation-5 shadow-md"
                accessibilityRole="button"
                disabled={uploading}
                onPress={handleAddDocument}>
                <MaterialIcons
                    style={{
                        borderColor: Colors.bg2,
                        borderWidth: Buttons.w2,
                        paddingHorizontal: Sizes.p0,
                        paddingVertical: Sizes.p0
                    }}
                    className="rounded-full items-center " name="add" color={Colors.bg2} />
                <Text
                    style={{
                        fontSize: Sizes.paragraph,
                        color: Colors.bg2,
                        marginLeft: Sizes.p2
                    }}
                    className="font-medium">{t("mr-documents.add")}</Text>
            </TouchableOpacity>

        </View>
    );
}