import ManageMapModal from "@/components/manage-map-modal";
import ManageNotificationsModal from "@/components/manage-notifications-modal";
import ScreenHeader from "@/components/screen-header";
import { Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ProfilePreferences() {
    const { t } = useTranslation();

    const [NotificationsModal, setNotificationsModal] = useState(false);
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [MapModal, setMapModal] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

    function handleTogglePreference(preference: string) {
        setSelectedPreferences((prev) =>
            prev.includes(preference)
                ? prev.filter((r) => r !== preference)
                : [...prev, preference]
        );
    }

    function handleToggleChoice(choice: string) {
        setSelectedChoice(choice);
    }

    return (
        <View className="flex-1 bg-[#fff]">
            <ScreenHeader title={t("profile-preferences.preferences")} />


            <ManageNotificationsModal
                visible={NotificationsModal}
                selectedPreferences={selectedPreferences}
                onTogglePreference={handleTogglePreference}
                onConfirm={() => { setNotificationsModal(false) }}
                onClose={() => setNotificationsModal(false)}
            />

            <ManageMapModal
                visible={MapModal}
                selectedChoice={selectedChoice}
                onToggleChoice={handleToggleChoice}
                onConfirm={() => { setMapModal(false) }}
                onClose={() => setMapModal(false)}
            />

            <ScrollView
                className="flex-1 bg-[#EEF9FB]"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >

                <Pressable
                    accessibilityRole="button"
                    onPress={() => setMapModal(true)}
                    className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <MaterialIcons name="location-pin" size={Sizes.h2} color={Colors.primary} />
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-[16px]lack">{t("profile-preferences.map")}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="000" />
                </Pressable>

                <Pressable
                    accessibilityRole="button"
                    onPress={() => setNotificationsModal(true)}
                    className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <MaterialIcons name="notifications" size={Sizes.h2} color={Colors.primary} />
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-[16px]lack">{t("profile-preferences.notifications")}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={Sizes.h2} color={Colors.text} />
                </Pressable>


            </ScrollView>
        </View>
    );
}