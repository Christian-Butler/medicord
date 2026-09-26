import ScreenHeader from "@/components/screen-header";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LegalInformation() {
    const { t } = useTranslation();


    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-[#EEF9FB]">
            <ScreenHeader title="Legal information" />
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

            </ScrollView>
        </SafeAreaView>
    );
}