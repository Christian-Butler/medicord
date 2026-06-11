import { View, Text, TextInput, Pressable } from "react-native";
import { Search, Siren } from "lucide-react-native";

export default function FindDoctor() {
    return (
      <View className="px-6 pt-6">
        {/* Title row */}
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-4xl font-semibold text-[#000000]">
            Find a Doctor
          </Text>

          <Pressable className="h-12 w-12 items-center justify-center rounded-xl bg-red-600">
            <Siren size={26} color="white" />
          </Pressable>
        </View>

        {/* Search input */}
        <View className="h-16 flex-row items-center rounded-2xl border-2 border-[#09516D] bg-white px-5">
          <Search size={26} color="#09516D" />

          <TextInput
            placeholder="Search"
            placeholderTextColor="#7B8A91"
            className="ml-4 flex-1 text-lg text-black"
          />
        </View>
      </View>
    );
}