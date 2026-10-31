import { searchDoctorsByName } from "@/src/api/doctors/api";
import { router } from "expo-router";
import { Search, Siren } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Colors, Inputs, Sizes } from '../constants/theme';

type DoctorSearchResult = {
  id: string;
  full_name: string;
  specialty: string | null;
  avatar_url: string | null;
};

export default function FindDoctor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<DoctorSearchResult[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const trimmedSearchQuery = searchQuery.trim();

    if (!trimmedSearchQuery) {
      setDoctors([]);
      setError(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await searchDoctorsByName(trimmedSearchQuery);
        setDoctors(results as DoctorSearchResult[]);
      } catch (err) {
        setError(t(`find-doctor.noSearch`));
      }
      finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <View className="px-6 pt-6">
      {/* Title row */}
      <View className="mb-2 flex-row items-center justify-between">
        <Text style={{
          fontWeight: 500,
          fontSize: Sizes.h1,
          color: Colors.text,
        }}>
          {t(`find-doctor.find`)}
        </Text>

        <Pressable className="h-14 w-20 items-center justify-center border border-[#d31f1f] rounded-xl bg-white">
          <Siren fill="#B10111" size={22} color="#B10111" />
        </Pressable>
      </View>

      {/* Search input */}
      <View className="mb-4">
        <Text
          style={{
            fontWeight: 400,
            fontSize: Sizes.h3,
            color: Colors.textMuted,
          }}
        >
          {t(`find-doctor.name`)}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: Colors.bg2,
          borderColor: Colors.secondary,
          borderRadius: Sizes.xs,
          height: Inputs.normal.height,
          paddingHorizontal: Sizes.p2,
          borderWidth: Inputs.normal.width,
        }}
        className="items-center flex-row">

        <Search size={20} color="#7B8A91" />

        <TextInput
          placeholder={t(`find-doctor.search`)}
          placeholderTextColor={Colors.textMuted}
          style={{
            fontSize: Sizes.paragraph,
            color: Colors.text
          }}
          className=" ml-2"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
          returnKeyType="search"
        />
      </View>

      {loading ? <Text className="mt-3 text-[#7B8A91]">{t(`find-doctor.searching`)}</Text> : null}
      {error ? <Text className="mt-3 text-[#B10111]">{error}</Text> : null}

      {
        !loading && !error && searchQuery.trim() && doctors.length === 0 ? (
          <Text className="rounded-b-xl mx-2 px-4 bg-[white] text-[#7B8A91]">{t(`find-doctor.noDoctors`)}</Text>
        ) : null
      }


      {
        doctors.map((doctor) => (
          <Pressable
            key={doctor.id}
            className="flex-row items-center rounded-xl bg-white my-2 py-4 px-2"
            onPress={() =>
              router.push({
                pathname: "/doctor-details",
                params: {
                  doctorId: doctor.id,
                  name: doctor.full_name,
                  specialty: doctor.specialty ?? "Doctor",
                },
              })
            }
          >
            {doctor.avatar_url ? (
              <Image
                source={{ uri: doctor.avatar_url }}
                className="mr-3 h-12 w-12 rounded-full"
              />
            ) : (
              <View className="mr-3 h-12 w-12 rounded-full bg-[#7B8A91]" />
            )}
            <View>
              <Text style={{
                fontWeight: 'medium',
                fontSize: Sizes.paragraph,
                color: Colors.text,
              }}
              >{doctor.full_name}</Text>
              <Text
                style={{
                  color: Colors.textMuted,
                }}>{t(`find-doctor.${doctor.specialty ?? "Doctor"}`)}</Text>
            </View>
          </Pressable>
        ))
      }
    </View >
  );
}