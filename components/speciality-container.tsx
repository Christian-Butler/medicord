import { useDoctorsBySpecialty } from "@/src/hooks/useDoctorbySpecialty";
import { useNextAvailableSlots } from "@/src/hooks/useNextAvailableSlots";
import { useIsFavourite } from "@/src/hooks/useIsFavourite";
import { useToggleFavourite } from "@/src/hooks/useToggleFavorite";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React from "react";
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
        size={28}
        color="#E7BF3C"
      />
    </TouchableOpacity>
  );
}

export default function SpecialityContainer({ specialty }: SpecialityContainerProps) {
  const { doctors, loading, error } = useDoctorsBySpecialty(specialty);

  const { slots: availabilityByDoctorId, error: availabilityError } =
    useNextAvailableSlots(doctors.map((doctor) => doctor.id));

  const { t } = useTranslation();

  return (
    <View>
      <View
        style={styles.search}
        className="h-14 flex-row rounded-2xl items-center border border-[#0D5175] bg-white px-5"
      >
        <Search size={18} color="#7B8A91" />
        <TextInput
          placeholder={t(`speciality-container.search`)}
          placeholderTextColor="#7B8A91"
          className="ml-4 flex-1 text-lg text-black"
        />
      </View>
      <ScrollView>
        {loading ? <Text style={styles.statusText}>{t(`speciality-container.loading`)}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {availabilityError ? <Text style={styles.errorText}>{availabilityError}</Text> : null}
        {!loading && !error && doctors.length === 0 ? (
          <Text style={styles.statusText}>{t(`speciality-container.noDoctor`)}</Text>
        ) : null}

        <View style={styles.containerMain}>
          {doctors.map((doctor, index) => {
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
                      <View style={[styles.avatar, { backgroundColor: '#D7E8ED' }]} />
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
                      <Text className="color-[white] font-medium text-[16px]">{t(`speciality-container.details`)}</Text>
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
  search: {
    width: 380,
    marginTop: 18,
    marginBottom: 20,
    alignSelf: "center",
  },
  statusText: {
    alignSelf: "center",
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    alignSelf: "center",
    marginBottom: 12,
    fontSize: 14,
    color: "#B42318",
  },
  containerMain: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 18,
  },
  doctorInfo: {
    flexDirection: 'row',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  profession: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "400",
  },
  day: {
    fontSize: 14,
    fontWeight: "500",
    backgroundColor: "#fff",
    borderRadius: 14,
  },
  slot: {
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5085A8",
    color: "#fff",
    height: 50,
    borderRadius: 14,
  }
});