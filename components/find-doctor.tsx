import { Search, Siren } from "lucide-react-native";
import { Pressable, Text, TextInput, View } from "react-native";

export default function FindDoctor() {
  return (
    <View className="px-6 pt-6">
      {/* Title row */}
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-3xl font-semibold text-[#000000]">
          Find a Doctor
        </Text>

        <Pressable className="h-14 w-20 items-center justify-center border-2 border-[##B10111] rounded-xl bg-white">
          <Siren fill="#B10111" size={22} color="#B10111" />
        </Pressable>
      </View>

      {/* Search input */}
      <View className="h-14 items-center flex-row rounded-2xl border-2 border-[#7B8A91] bg-white px-5">
        <Search size={20} color="#7B8A91" />

        <TextInput
          placeholder="Search"
          placeholderTextColor="#7B8A91"
          className="mb-1 ml-2 text-lg text-black"
        />
      </View>
    </View>
  );
}