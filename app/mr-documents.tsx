import ScreenHeader from "@/components/screen-header";
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
                t("documents.failedTitle", "Couldn't add document"),
                err instanceof Error ? err.message : t("documents.failed", "Something went wrong. Please try again.")
            );
        }
    }

    // Deleting a medical document can't be undone, so it always asks first.
    function confirmDelete(document: MedicalDocument) {
        Alert.alert(
            t("documents.deleteTitle", "Delete this document?"),
            t("documents.deleteBody", { defaultValue: "\"{{title}}\" will be removed for good.", title: document.title }),
            [
                { text: t("documents.cancel", "Cancel"), style: "cancel" },
                {
                    text: t("documents.delete", "Delete"),
                    style: "destructive",
                    onPress: () => {
                        remove(document).catch((err) =>
                            Alert.alert(
                                t("documents.deleteFailed", "Couldn't delete document"),
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
        const shareLabel = t("documents.share", "Share");
        const deleteLabel = t("documents.delete", "Delete");
        const cancelLabel = t("documents.cancel", "Cancel");

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

        <View className="flex-1 bg-[#EEF9FB]">

            <ScrollView className="flex-1">

                <ScreenHeader title='Documents' />


                <View className="m-6 pb-24">

                    <View className="pt-4">
                        <Text className="text-xl">You’re the only one having access to the files and able to manage them.</Text>
                    </View>

                    {!loading && documents.length === 0 ? (
                        <Text className="pt-6 text-[#3C4D4D]">
                            {t("documents.empty", "No documents yet. Add a prescription, lab result or referral to keep it here.")}
                        </Text>
                    ) : null}

                    {years.map(([year, yearDocuments]) => (
                        <View key={year}>
                            <View className="pt-6 justify-between flex-row items-center">
                                <Text>{year} </Text>
                                <View className="w-80 h-0.5 bg-[#BEC9CA] rounded-full self-endline" />
                            </View>

                            {yearDocuments.map((document) => (
                                <View key={document.id} className="flex-1 pt-6 flex-row items-center" >
                                    <TouchableOpacity
                                        className="flex-1 flex-row items-center"
                                        accessibilityRole="button"
                                        disabled={openingId === document.id}
                                        onPress={() => open(document)}
                                    >
                                        <MaterialIcons name={CATEGORY_ICONS[document.category]} size={44} color="#0D5175" />
                                        <View className="pl-4 flex-1">
                                            <Text numberOfLines={1}>{document.title}</Text>
                                            <View className="flex-row items-center  pt-2">
                                                <Text className="text-[#3C4D4D]">
                                                    {document.doctors?.full_name ?? categoryLabel(document.category)}{" "}
                                                </Text>
                                                <MaterialIcons name="circle" size={6} color="#3C4D4D" />
                                                <Text className="text-[#3C4D4D]"> {formatDate(document.created_at)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    <View className="self-center pl-4">
                                        <TouchableOpacity
                                            className="justify-center p-1 border-2 border-[#0D5175] items-center rounded-full"
                                            accessibilityRole="button"
                                            accessibilityLabel={t("documents.options", "Document options")}
                                            disabled={sharingId === document.id}
                                            onPress={() => showOptions(document)}
                                        >
                                            <MaterialIcons name="more-horiz" size={18} color="#0D5175" ></MaterialIcons>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}

                </View>


            </ScrollView>

            <TouchableOpacity className="absolute bottom-8 self-center flex-row px-5 mdc-fab flex-row bg-[#5085A8] h-14 items-center rounded-2xl elevation-5 shadow-md"
                accessibilityRole="button"
                disabled={uploading}
                onPress={handleAddDocument}>
                <MaterialIcons className="border-2 rounded-full p-1 items-center border-[#fff]" name="add" color="#fff" />
                <Text className="text-[#fff] font-medium ml-2">Add a document</Text>
            </TouchableOpacity>

        </View>
    );
}