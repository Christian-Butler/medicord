import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable, Text, View } from "react-native";

export default function LatestDocuments() {
  return (
    <View className="px-4 pt-10 pb-10">
      <Text className="pl-2 text-[24px] font-normal text-black">
        Latest documents
      </Text>

      {/* Example document card */}
      <Pressable className="border-b-2 border-[#A8C9E1] px-4 py-6 my-2">
        <View className="flex-row items-center">
          <FontAwesome5
            name="clipboard-list"
            size={40}
            color="#09516D"
            solid
          />

          <View className="ml-4 flex-1">
            <Text className="text-lg font-medium text-black">
              No documents yet
            </Text>
            <Text className="mt-1 text-base text-gray-600">
              Received : DD/MM/YYYY
            </Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={18} />
        </View>
      </Pressable>
    </View>
  );
}
