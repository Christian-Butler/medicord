import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CardiologyHeader from "@/components/cardiology-header";


export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#EEF9FB]" edges={["top"]}>
            <ScrollView>
                <CardiologyHeader />

                <View className="flex-1">

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}