import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const numColumns = 4;

  return (
    <View>

      <View className="mt-6 ml-6">
        <Text className="text-2xl font-regular text-zinc-600">
          {t(`doctor-carousel.specialty`)}
        </Text>
      </View>

      <FlatList
        key={`specialties-${numColumns}`}
        horizontal={false}
        data={specialties}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerClassName="mx-2 mt-4"
        renderItem={({ item }) => (
          <Pressable
            className="items-center pb-6"
            onPress={() =>
              router.push({
                pathname: "/specialist-page",
                params: {
                  specialty: item.title,
                },
              })
            }
          >
            <View className="h-[64px] w-[76px] items-center justify-center rounded-[16px] border-2 border-[#2B6F95] bg-[#DDF8FF]">
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
              {t(`doctor-carousel.${item.title}`)}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}