import { MaterialIcons } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { Colors, Sizes } from '../constants/theme';

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
    id: "Gyneacology",
    title: "Gynecology",
    icon: "female",
    library: "MaterialIcons",
  },
  {
    id: "Orthopaedics",
    title: "Orthopaedics",
    icon: "record-voice-over",
    library: "MaterialIcons",
  },
  {
    id: "Gastroenterology",
    title: "Gastroenterology",
    icon: "stomach",
    library: "MaterialCommunityIcons",
  },
  {
    id: "Psychiatry",
    title: "Psychiatry",
    icon: "psychology",
    library: "MaterialIcons",
  },
  {
    id: "Neurology",
    title: "Neurology",
    icon: "brain",
    library: "MaterialCommunityIcons",
  },
  {
    id: "Endocrinology",
    title: "Endocrinology",
    icon: "fingerprint",
    library: "MaterialIcons",
  },
] as const;

function SpecialtyIcon({ icon, library, size, color }: { icon: string; library: string; size: number; color: string }) {
  if (library === "Fontisto") {
    return <Fontisto name={icon as any} size={size} color={color} />;
  } else if (library === "MaterialIcons") {
    return <MaterialIcons name={icon as any} size={size} color={color} />;
  }

  return <MaterialCommunityIcons name={icon as any} size={size} color={color} />;
}

export default function DoctorSpecialtyCarousel() {
  const router = useRouter();
  const { t } = useTranslation();
  const numColumns = 4;
  const rows = Array.from({ length: Math.ceil(specialties.length / numColumns) }, (_, rowIndex) =>
    specialties.slice(rowIndex * numColumns, (rowIndex + 1) * numColumns)
  );

  return (
    <View>

      <View
        style={{
          marginTop: Sizes.paragraph,
          marginLeft: Sizes.paragraph
        }}>
        <Text
          style={{
            fontSize: Sizes.h3,
            color: Colors.textMuted,
            fontWeight: "regular"
          }}>
          {t(`doctor-carousel.specialty`)}
        </Text>
      </View>

      <View
        className="items-center"
        style={{ marginTop: Sizes.p3 }}>
        {rows.map((row) => (
          <View key={row[0].id} className="flex-row">
            {row.map((item) => (
              <Pressable
                key={item.id}
                style={{ paddingBottom: Sizes.p2 }}
                className="items-center"
                onPress={() =>
                  router.push({
                    pathname: "/specialist-page",
                    params: {
                      specialty: item.title,
                    },
                  })
                }
              >
                <View
                  style={{
                    width: Sizes.boxS,
                    height: Sizes.boxS,
                    borderRadius: Sizes.sm,
                    backgroundColor: Colors.bg2,
                  }}
                  className="items-center justify-center">
                  <SpecialtyIcon
                    icon={item.icon}
                    library={item.library}
                    size={Sizes.IconNml}
                    color={Colors.secondary}
                  />
                </View>

                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.65}
                  style={{
                    fontSize: Sizes.sm,
                    color: Colors.text,
                    marginTop: Sizes.p0
                  }}
                  className="w-[96px] text-center leading-[16px]"
                >
                  {t(`doctor-carousel.${item.title}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}