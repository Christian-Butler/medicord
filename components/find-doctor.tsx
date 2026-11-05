import { searchDoctorsByName } from "@/src/api/doctors/api";
import { router } from "expo-router";
import { Search, Siren } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Linking, Pressable, Text, TextInput, View } from "react-native";
import { Buttons, Colors, Inputs, Sizes } from '../constants/theme';

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

  const handleEmergencyCall = () => {
    Linking.openURL('tel:999');
  };

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

        <Pressable
          onPress={handleEmergencyCall}
          style={{
            height: Sizes.BtnP,
            width: Sizes.boxS,
            borderWidth: Buttons.w1,
            borderColor: Colors.delete,
            borderRadius: Sizes.p3,
            backgroundColor: Colors.bg2
          }}
          className=" items-center justify-center">
          <Siren fill={Colors.delete} size={Sizes.h3} color={Colors.delete} />
        </Pressable>
      </View>

      {/* Search input */}
      <View style={{
        marginBottom: Sizes.p3,
      }}>
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
          borderRadius: Sizes.p3,
          height: Inputs.height,
          paddingHorizontal: Sizes.p2,
          borderWidth: Inputs.w0,
        }}
        className="items-center flex-row">

        <Search size={Sizes.h4} color={Colors.textMuted} />

        <TextInput
          placeholder={t(`find-doctor.search`)}
          placeholderTextColor={Colors.textMuted}
          style={{
            fontSize: Sizes.paragraph,
            color: Colors.text,
            marginLeft: Inputs.w1
          }}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
          returnKeyType="search"
        />
      </View>

      {loading ? <Text
        style={{
          color: Colors.textMuted,
          marginTop: Sizes.p0
        }}
      >{t(`find-doctor.searching`)}</Text> : null}
      {error ? <Text
        style={{
          color: Colors.error,
          marginTop: Sizes.p0
        }}
      >{error}</Text> : null}

      {
        !loading && !error && searchQuery.trim() && doctors.length === 0 ? (
          <Text
            style={{
              color: Colors.textMuted,
              backgroundColor: Colors.bg2,
              paddingHorizontal: Sizes.p0,
              marginHorizontal: Buttons.w2
            }}
            className="rounded-b-xl">{t(`find-doctor.noDoctors`)}</Text>
        ) : null
      }


      {
        doctors.map((doctor) => (
          <Pressable
            key={doctor.id}
            style={{
              borderRadius: Sizes.p3,
              paddingVertical: Sizes.p3,
              paddingHorizontal: Sizes.p2,
              backgroundColor: Colors.bg2,
              marginVertical: Buttons.w2
            }}
            className="flex-row items-center"
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
                style={{
                  height: Buttons.imgW,
                  width: Buttons.imgW
                }}
                className="mr-3 rounded-full"
              />
            ) : (
              <View
                style={{
                  height: Buttons.imgW,
                  width: Buttons.imgW,
                  backgroundColor: Colors.textMuted
                }}
                className="mr-3 rounded-full" />
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