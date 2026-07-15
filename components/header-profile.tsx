import { useProfile } from "@/src/hooks/useProfile";
import { Bell } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

export default function ProfileHeader() {
  const { fullName, avatarUrl } = useProfile();

  return (
    <View className="bg-white">
      <View className="flex-row items-center justify-between px-6 pb-6 pt-5">
        <View className="flex-1 flex-row items-center">
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} className="h-16 w-16 rounded-full" />
          ) : (
            <Image source={require("@/assets/images/phillip.png")} className="h-16 w-16 rounded-full" />
          )}

          <View className="ml-7 mr-4 flex-1">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="text-4xl font-normal text-black"
            >
              Welcome, {fullName}
            </Text>
          </View>
        </View>

        <Pressable className="relative h-16 w-16 items-center justify-center rounded-full bg-[#09516D]">
          <Bell size={34} color="white" />
          <View className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-[#E7BF3C]" />
        </Pressable>
      </View>

      <View className="h-1 bg-[#09516D]" />
    </View>
  );
}