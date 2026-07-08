import FontAwesome5 from "@react-native-vector-icons/fontawesome5";
import { View, Pressable, Text } from "react-native";

export default function LatestDocuments() {
  return (
    <View className="px-6 pt-10 pb-10">
      <Text className="text-[28px] font-normal text-black">
        Latest documents
      </Text>
      {/* Example document card */}
      <Pressable className="mt-5 rounded-2xl border border-[#D6E7EC] bg-white px-5 py-5">
        <View className="flex-row items-center">
            <FontAwesome5
              name="clipboard-list"
              size={34}
              color="#09516D"
              iconStyle="solid"
            />
          
          <View className="ml-4 flex-1">
            <Text className="text-base font-semibold text-black">
              No documents yet
            </Text>
            <Text className="mt-1 text-sm text-[#6F7F85]">
              Lab results and records will appear here.
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
