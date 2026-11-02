import { Buttons, Colors, Inputs, Sizes } from "@/constants/theme";
import { useDoctorsBySpecialty } from "@/src/hooks/useDoctorbySpecialty";
import { useIsFavourite } from "@/src/hooks/useIsFavourite";
import { useNextAvailableSlots } from "@/src/hooks/useNextAvailableSlots";
import { useToggleFavourite } from "@/src/hooks/useToggleFavorite";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import WeeklyCalendar from "./calendar";

type SpecialityContainerProps = {
  specialty: string;
};

function StarButton({ doctorId }: { doctorId: string }) {
  const { isFavourite, setIsFavourite } = useIsFavourite(doctorId);
  const { toggle } = useToggleFavourite();

  return (
    <TouchableOpacity
      onPress={async () => {
        const result = await toggle(doctorId);
        setIsFavourite(result);
      }}
    >
      <MaterialIcons
        name={isFavourite ? "star" : "star-border"}
        size={Sizes.h1}
        color={Colors.info}
      />
    </TouchableOpacity>
  );
}

export default function SpecialityContainer({ specialty }: SpecialityContainerProps) {
  const { doctors, loading, error } = useDoctorsBySpecialty(specialty);
  const [searchQuery, setSearchQuery] = useState("");
  const [timedQuery, setTimedQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const { slots: availabilityByDoctorId, error: availabilityError } =
    useNextAvailableSlots(doctors.map((doctor) => doctor.id));

  const { t } = useTranslation();

  const querySpecialtyDoctors = useMemo(() => {
    const trimmedSearchQuery = timedQuery.trim().toLowerCase();
    if (!trimmedSearchQuery) return doctors;
    return doctors.filter((doc) =>
      doc.full_name?.toLowerCase().includes(trimmedSearchQuery)
    );
  }, [doctors, timedQuery]);



  return (
    <View>
      <View
        style={{
          backgroundColor: Colors.bg2,
          borderColor: Colors.secondary,
          borderRadius: Sizes.p3,
          height: Inputs.height,
          marginHorizontal: Sizes.p2,
          paddingHorizontal: Sizes.p2,
          marginVertical: Sizes.p3,
          borderWidth: Inputs.w0,
        }}
        className="flex-row items-center"
      >
        <Search size={Sizes.h5} color={Colors.textMuted} />
        <TextInput
          placeholder={t(`speciality-container.search`)}
          placeholderTextColor={Colors.textMuted}
          style={{
            fontSize: Sizes.paragraph,
            color: Colors.text
          }}
          className="ml-2"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
          returnKeyType="search"
        />
      </View>
      <ScrollView>
        {loading ? <Text style={styles.statusText}>{t(`speciality-container.loading`)}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {availabilityError ? <Text style={styles.errorText}>{availabilityError}</Text> : null}
        {!loading && !error && doctors.length === 0 ? (
          <Text style={styles.statusText}>{t(`speciality-container.noDoctor`)}</Text>
        ) : null}

        {!loading && !error && querySpecialtyDoctors.length === 0 ? (
          <Text style={styles.statusText}>
            {searchQuery.trim() ? t(`specialty-container.noDoctors`, "No doctors found matching your search.")
              : t(`speciality-container.noDoctor`)}
          </Text>
        ) : null}

        <View style={styles.containerMain}>
          {querySpecialtyDoctors.map((doctor) => {
            const closestDay =
              availabilityByDoctorId[doctor.id] ?? t(`speciality-container.availability`);

            const avatar =
              doctor.avatar_url || null;
            return (
              <View key={doctor.id} style={styles.card}>
                <View style={styles.doctorInfo}>
                  <View>
                    {avatar ? (
                      <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, { backgroundColor: Colors.textMuted }]} />
                    )}
                  </View>

                  <View className="flex-1 flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text style={styles.name}>{doctor.full_name}</Text>
                      <View className="flex-row items-center">
                        <Text style={styles.profession}>
                          {doctor.specialty ?? specialty}
                        </Text>
                        <Text className="mx-1">
                          •
                        </Text>
                        <Text style={styles.profession}>
                          {doctor.location}
                        </Text>
                      </View>
                    </View>
                    <StarButton doctorId={doctor.id} />
                  </View>
                </View>

                <View style={styles.slot}>
                  <Text>{t(`speciality-container.closestSlot`)}</Text>
                  <Text style={styles.day}>{closestDay}</Text>
                </View>

                <View>
                  <View>
                    <WeeklyCalendar />

                    <Pressable
                      style={styles.containerButton}
                      accessibilityRole="button"
                      onPress={() =>
                        router.push({
                          pathname: "/doctor-details",
                          params: {
                            doctorId: doctor.id,
                            name: doctor.full_name,
                            closestDay,
                            specialty: doctor.specialty ?? specialty,
                          },
                        })
                      }
                    >
                      <Text
                        style={{
                          color: Colors.bg2,
                          fontSize: Sizes.paragraph
                        }}
                        className="font-medium">{t(`speciality-container.details`)}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  statusText: {
    alignSelf: "center",
    marginBottom: Sizes.p3,
    fontSize: Sizes.sm,
    color: Colors.text,
  },
  errorText: {
    alignSelf: "center",
    marginBottom: Sizes.p3,
    fontSize: Sizes.sm,
    color: Colors.error,
  },
  containerMain: {
    paddingHorizontal: Sizes.p3,
  },
  card: {
    backgroundColor: Colors.bg2,
    borderRadius: Sizes.h5,
    paddingHorizontal: Sizes.h5,
    paddingVertical: Sizes.sm,
    marginBottom: Sizes.h5,
  },
  doctorInfo: {
    flexDirection: 'row',
  },
  avatar: {
    width: Sizes.imgApt,
    height: Sizes.imgApt,
    borderRadius: Sizes.h1,
    marginRight: Sizes.p3,
  },
  name: {
    fontSize: Sizes.paragraph,
    fontWeight: "500",
  },
  profession: {
    marginTop: Buttons.w2,
    fontSize: Sizes.sm,
    fontWeight: "400",
  },
  day: {
    fontSize: Sizes.sm,
    fontWeight: "500",
    backgroundColor: Colors.bg2,
    borderRadius: Sizes.sm,
  },
  slot: {
    paddingTop: Sizes.p2,
    paddingBottom: Sizes.p1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    color: Colors.bg2,
    height: Inputs.height,
    borderRadius: Sizes.sm,
  }
});