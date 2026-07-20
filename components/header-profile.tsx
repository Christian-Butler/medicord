import { Bell } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { setDemoSession } from "../src/api/auth/demoSession";
import { getMyUser } from "../src/api/auth/getUser";

type ProfileHeaderProps = {
  name?: string;
};

export default function ProfileHeader({ name = "Philip" }: ProfileHeaderProps) {
  const [profileName, setProfileName] = useState(name);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setError(null);

        const user = await setDemoSession();

        if (!mounted) return;

        setUserId(user.id);

        const profile = await getMyUser(user.id);

        if (!mounted) return;

        setProfileName(profile.full_name || name || "Philip");
      } catch (err) {
        console.error("[ProfileHeader] loadProfile failed:", err);

        if (!mounted) return;

        setProfileName(name || "Philip");
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [name]);

  return (
    <View className="bg-white">
      <View className="flex-row items-center justify-between px-6 pt-8 pb-8">
        <View className="flex-row items-center pt-51">
          <Image

            source={require("@/assets/images/phillip.png")}
            className="h-16 w-16 rounded-full"
          />

          <View className="ml-7 mr-7">
            <Text className="text-2xl font-normal text-black">
              Welcome, {profileName}
            </Text>



            {error && (
              <Text className="mt-1 text-xs text-red-500">
                {error}
              </Text>
            )}
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