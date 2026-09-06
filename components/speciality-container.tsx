import { getClosestAvailableSlotsForDoctors } from "@/src/api/appointments/availability";
import { useDoctorsBySpecialty } from "@/src/hooks/useDoctorbySpecialty";
import { useIsFavourite } from "@/src/hooks/useIsFavourite";
import { useToggleFavourite } from "@/src/hooks/useToggleFavorite";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import WeeklyCalendar from "./calendar";

type SpecialityContainerProps = {
  specialty: string;
};

const fallbackAvatars = [
  "https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg",
  "https://images.pexels.com/photos/8460094/pexels-photo-8460094.jpeg",
  "https://images.pexels.com/photos/8376300/pexels-photo-8376300.jpeg",
  "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg",
];

function StarButton({ doctorId }: { doctorId: string }) {
  const { isFavourite, setIsFavourite } = useIsFavourite(doctorId);
  const { toggle } = useToggleFavourite();

  return (
    <TouchableOpacity
      style={styles.favorite}
      onPress={async () => {
        const result = await toggle(doctorId);
        setIsFavourite(result);
      }}
    >
      <MaterialIcons
        name={isFavourite ? "star" : "star-border"}
        size={24}
        color="#E7BF3C"
      />
    </TouchableOpacity>
  );
}

export default function SpecialityContainer({ specialty }: SpecialityContainerProps) {
  const { doctors, loading, error } = useDoctorsBySpecialty(specialty);

  const [availabilityByDoctorId, setAvailabilityByDoctorId] = useState<Record<string, string>>({});

  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAvailability() {
      if (doctors.length === 0) {
        setAvailabilityByDoctorId({});
        return;
      }

      try {
        setAvailabilityError(null);

        const slots = await getClosestAvailableSlotsForDoctors(
          doctors.map((doctor) => doctor.id)
        );

        const formattedSlots: Record<string, string> = {};

        doctors.forEach((doctor) => {
          formattedSlots[doctor.id] =
            slots[doctor.id]?.label ?? "No slots available";
        });

        setAvailabilityByDoctorId(formattedSlots);
      } catch (err) {
        console.error("[SpecialityContainer] availability failed:", err);
        setAvailabilityError(
          err instanceof Error ? err.message : "Failed to load availability"
        );
      }
    }

    loadAvailability();
  }, [doctors]);

  return (
    <View>
      <View
        style={styles.search}
        className="h-14 flex-row rounded-2xl border-2 items-center border-[#09516D] bg-white px-5"
      >
        <Search size={18} color="#09516D" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#7B8A91"
          className="ml-4 flex-1 text-lg text-black"
        />
      </View>

      {loading ? <Text style={styles.statusText}>Loading doctors...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {availabilityError ? <Text style={styles.errorText}>{availabilityError}</Text> : null}
      {!loading && !error && doctors.length === 0 ? (
        <Text style={styles.statusText}>No doctors found.</Text>
      ) : null}

      <View style={styles.containerMain}>
        {doctors.map((doctor, index) => {
          const closestDay =
            availabilityByDoctorId[doctor.id] ?? "Checking availability...";

          const avatar =
            doctor.avatar_url || null;
          console.log(`[Doctor] ${doctor.full_name} avatar:`, avatar);
          return (
            <View key={doctor.id} style={styles.card}>
              <View style={styles.doctorInfo}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: '#D7E8ED' }]} />
                )}

                <View style={styles.doctorText}>
                  <Text style={styles.name}>{doctor.full_name}</Text>
                  <Text style={styles.profession}>
                    {doctor.specialty ?? specialty}
                  </Text>
                </View>

                <StarButton doctorId={doctor.id} />
              </View>

              <View style={styles.slot}>
                <Text>Closest available slot :</Text>
                <Text style={styles.day}>{closestDay}</Text>
              </View>

              <View style={styles.bookContainer}>
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
                    <Text style={styles.text2}>View Details</Text>
                    <MaterialIcons name="chevron-right" size={26} color="#fff" />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    width: 350,
    marginTop: 18,
    marginBottom: 20,
    alignSelf: "center",
  },
  statusText: {
    width: 350,
    alignSelf: "center",
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    width: 350,
    alignSelf: "center",
    marginBottom: 12,
    fontSize: 14,
    color: "#B42318",
  },
  containerMain: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  card: {
    padding: 10,
    marginBottom: 10,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  doctorText: {
    width: 250,
  },
  favorite: {
    marginLeft: 40,
    flexDirection: "row",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  profession: {
    fontSize: 14,
    fontWeight: "300",
  },
  day: {
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "#fff",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 14,
  },
  slot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 12,
  },
  bookContainer: {},
  containerButton: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "40%",
    flexDirection: "row",
    backgroundColor: "#5085A8",
    color: "#fff",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 6,
    borderRadius: 12,
  },
  text2: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});