import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

const specialties = [
  {
    id: "gp",
    title: "GP",
    icon: "doctor",
    library: "Fontisto",
  },
  {
    id: "ophthalmology",
    title: "Ophthalmology",
    icon: "eye",
    library: "MaterialCommunityIcons",
  },
  {
    id: "dentistry",
    title: "Dentistry",
    icon: "tooth",
    library: "MaterialCommunityIcons",
  },
  {
    id: "cardiology",
    title: "Cardiology",
    icon: "heart",
    library: "MaterialCommunityIcons",
  },
  {
    id: "dermatology",
    title: "Dermatology",
    icon: "face-woman-profile",
    library: "MaterialCommunityIcons",
  },
  {
    id: "Paediatrics",
    title: "Paediatrics",
    icon: "account-child-circle",
    library: "MaterialCommunityIcons",
  },
  {
    id: "Neurology",
    title: "Neurology",
    icon: "brain",
    library: "MaterialCommunityIcons",
  },
] as const;

function SpecialtyIcon({ icon, library, size, color }: { icon: string; library: string; size: number; color: string }) {
  if (library === "Fontisto") {
    return <Fontisto name={icon as any} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={icon as any} size={size} color={color} />;
}

export default function DoctorSpecialtyCarousel() {
  const router = useRouter();

  return (
    <View className="mt-2 py-4 pl-2 ">
      <FlatList
        horizontal
        data={specialties}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-6"
        ItemSeparatorComponent={() => <View className="w-5" />}
        renderItem={({ item }) => (
          <Pressable
            className="w-[82px] items-center"
            onPress={() =>
              router.push({
                pathname: "/specialist-page",
                params: {
                  specialty: item.title,
                },
              })
            }
          >
            <View className="h-[62px] w-[77px] items-center justify-center rounded-[16px] border-2 border-[#2B6F95] bg-[#DDF8FF]">
              <SpecialtyIcon
                icon={item.icon}
                library={item.library}
                size={34}
                color="#09516D"
              />
            </View>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
              className="mt-2 w-[96px] text-center text-[13px] leading-[16px] text-black"
            >
              {item.title}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}