import ManageMapModal from "@/components/manage-map-modal";
import ManageNotificationsModal from "@/components/manage-notifications-modal";
import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePreferences() {

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
        <SafeAreaView edges={["top"]} className="flex-1 bg-[#EEF9FB]">
            <ScreenHeader title="My preferences" />


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
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

                <Pressable
                    accessibilityRole="button"
                    onPress={() => setMapModal(true)}
                    className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <MaterialIcons name="location-pin" size={28} color="#326F95" />
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-black">Map</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="000" />
                </Pressable>

                <Pressable
                    accessibilityRole="button"
                    onPress={() => setNotificationsModal(true)}
                    className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <MaterialIcons name="notifications" size={28} color="#326F95" />
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-black">Notifications</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="#000" />
                </Pressable>


            </ScrollView>
        </SafeAreaView>
    );
}