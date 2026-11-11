import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

export default function Legal() {
    const { t } = useTranslation();

    return (
        <View className="flex-1 bg-[#fff]">
            <ScreenHeader title={t("profile-legal.title")} />

            <ScrollView
                className="flex-1 bg-[#EEF9FB]"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

                <View className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-black">{t("profile-legal.conditions")}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="#000" />
                </View>

                <View
                    className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-black">{t("profile-legal.privacy")}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="#000" />
                </View>

                <View
                    className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-black">{t("profile-legal.legalNotices")}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="#000" />
                </View>


            </ScrollView>
        </View>
    );
}