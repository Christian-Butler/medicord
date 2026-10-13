import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

export default function Legal() {

    return (
        <View className="flex-1 bg-[#fff]">
            <ScreenHeader title="Legal information" />

            <ScrollView
                className="flex-1 bg-[#EEF9FB]"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

                <View className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-black">User General Conditions</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="#000" />
                </View>

                <View
                    className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-black">Protection policy on personal data</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="#000" />
                </View>

                <View
                    className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3">
                    <View className="flex-1">
                        <Text className="ml-1 mt-1 text-[16px] text-black">Legal Mentions</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={26} color="#000" />
                </View>


            </ScrollView>
        </View>
    );
}