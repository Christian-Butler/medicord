import { searchDoctorsByName } from "@/src/api/doctors/api";
import { router } from "expo-router";
import { Search, Siren } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, TextInput, View } from "react-native";

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
        setError("Doctors couldn't be searched");
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
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-3xl font-semibold text-[#000000]">
          {t(`find-doctor.find`)}
        </Text>

        <Pressable className="h-14 w-20 items-center justify-center border-2 border-[##B10111] rounded-xl bg-white">
          <Siren fill="#B10111" size={22} color="#B10111" />
        </Pressable>
      </View>

      {/* Search input */}
      <View className="h-14 items-center flex-row rounded-2xl border-2 border-[#7B8A91] bg-white px-5">
        <Search size={20} color="#7B8A91" />

        <TextInput
          placeholder={t(`find-doctor.search`)}
          placeholderTextColor="#7B8A91"
          className="mb-1 ml-2 text-lg text-black"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
          returnKeyType="search"
        />
      </View>

      {loading ? <Text className="mt-3 text-[#7B8A91]">{t(`find-doctor.searching`)}</Text> : null}
      {error ? <Text className="mt-3 text-[#B10111]">{error}</Text> : null}

      {!loading && !error && searchQuery.trim() && doctors.length === 0 ? (
        <Text className="rounded-b-xl mx-2 px-4 py-2 bg-[white] text-[#7B8A91]">{t(`find-doctor.noDoctors`)}</Text>
      ) : null}

      {doctors.map((doctor) => (
        <Pressable
          key={doctor.id}
          className="mt-2 flex-row items-center rounded-xl bg-white py-4 px-2"
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
            <Text className="font-medium text-base text-black">{doctor.full_name}</Text>
            <Text className="text-[#7B8A91]">{t(`find-doctor.${doctor.specialty ?? "Doctor"}`)}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}