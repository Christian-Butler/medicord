import Card from "@/components/cardiologists-container";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cardiology() {
    return (
        <SafeAreaView className="flex-1 bg-[#EEF9FB]" edges={["top"]}>
            <ScrollView>
                <View className="flex-1">
                    <Card />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}