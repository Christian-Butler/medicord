import Card from "@/components/cardiologists-container";
import { ScrollView, View } from "react-native";

export default function Cardiology() {
    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScrollView>
                <View className="flex-1">
                    <Card />
                </View>
            </ScrollView>
        </View>
    );
}