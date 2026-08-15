import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileRowProps = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  destructive?: boolean;
  onPress?: () => void;
};

function ProfileRow({ icon, title, subtitle, destructive = false, onPress }: ProfileRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3"
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={22}
          color={destructive ? "#E33434" : "#000"}
          style={{ marginRight: 14 }}
        />
      ) : null}

      <View className="flex-1">
        <Text
          className={`text-[17px] font-normal ${
            destructive ? "text-[#E33434]" : "text-black"
          }`}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text className="mt-1 text-[15px] font-normal text-black">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <MaterialIcons
        name="chevron-right"
        size={26}
        color={destructive ? "#E33434" : "#000"}
      />
    </Pressable>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View className="border-b border-[#B9CBCD] px-5 pb-3 pt-7">
      <Text className="text-[19px] font-semibold text-black">{title}</Text>
    </View>
  );
}

export default function ProfilePage() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#EEF9FB]">
      <View className="h-[72px] justify-end border-b-[2px] border-[#0D5175] bg-white pb-4">
        <Text className="text-center text-[24px] font-normal text-black">
          Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative items-center border-b border-[#B9CBCD] pb-8 pt-9">
          <Pressable className="absolute right-6 top-6 flex-row items-center">
            <MaterialIcons name="edit" size={16} color="#8A3F00" />
            <Text className="ml-1 text-[16px] text-[#8A3F00]">Edit</Text>
          </Pressable>

          <Image
            source={require("@/assets/images/phillip.png")}
            className="h-[74px] w-[74px] rounded-full"
          />

          <Text className="mt-5 text-[17px] font-normal text-black">
            Philip Connally
          </Text>

          <Text className="mt-3 text-[16px] font-normal text-black">
            Cork - 19/04/53
          </Text>

          <Text className="mt-3 text-[16px] font-normal text-black">
            Address unspecified
          </Text>
        </View>

        <SectionTitle title="Authentification" />

        <ProfileRow icon="phone" title="Phone number" subtitle="XXX XXX XXX" />

        <ProfileRow icon="mail-outline" title="Email address" subtitle="John@Doe.com" />

        <ProfileRow icon="lock-outline" title="Security details" />

        <SectionTitle title="Other settings" />

        <ProfileRow title="Online payment settings" subtitle="Manage your payments" />

        <ProfileRow icon="credit-card" title="Payment options" subtitle="Your credit cards for appointments" />

        <ProfileRow icon="language" title="Language" subtitle="English (UK)" />

        <ProfileRow title="Encrypted documents" subtitle="Active" />

        <SectionTitle title="Confidentiality" />

        <ProfileRow title="My preferences" />

        <ProfileRow title="Legal information" />

        <ProfileRow title="Delete my account" />

        <View className="h-[64px] border-b border-[#B9CBCD]" />

        <ProfileRow icon="logout" title="Disconnect" destructive />
      </ScrollView>
    </SafeAreaView>
  );
}
