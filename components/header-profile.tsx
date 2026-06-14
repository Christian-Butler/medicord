import { Bell } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

type ProfileHeaderProps = {
  name?: string;
};

export default function ProfileHeader({ name = "Philip" }: ProfileHeaderProps) {
  return (
    <View className="bg-white">
      <View className="flex-row items-center justify-between px-6 pt-8 pb-8">
        <View className="flex-row items-center pt-51">
          <Image
            source={require("/Users/christianbutler/medicord/assets/images/phillip.png")}
            className="h-16 w-16 rounded-full"
          />

          <Text className="ml-7 mr-7 text-4xl font-normal text-black">
            Welcome, {name}
          </Text>
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
