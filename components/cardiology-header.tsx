import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";


export default function CardiologyHeader() {
    return (
        <View className="bg-white">
            <View className="flex-row items-center justify-between px-6 pt-16 pb-8">
                <View className="flex-row items-center pt-51">

                    <MaterialIcons >
                    </MaterialIcons>

                    <Text className="ml-7 mr-7 text-4l font-normal text-black">
                        Cardiology
                    </Text>
                </View>

                <MaterialIcons>

                </MaterialIcons>
            </View>

            <View className="h-1 bg-[#09516D]" />
        </View>

    );
}
