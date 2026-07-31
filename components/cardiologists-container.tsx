import { getDoctorsBySpecialty } from "@/src/api/doctors/api";
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

interface Doctor {
  id: string;
  full_name: string;
  specialty: string | null;
  avatar_url: string | null;
  clinic_name?: string | null;
  location?: string | null;
  requires_gp_referral?: boolean | null;
}

const Card: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const specialty = "Cardiology";

  useEffect(() => {
    async function loadCardiologists() {
      try {
        setLoading(true);
        setError(null);

        console.log("[CardiologyCard] loading doctors for:", specialty);

        const rows = await getDoctorsBySpecialty(specialty);

        console.log("[CardiologyCard] doctors returned:", rows);

        setDoctors(rows as Doctor[]);
      } catch (err) {
        console.error("[CardiologyCard] failed to load doctors:", err);
        setError(err instanceof Error ? err.message : "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    }

    loadCardiologists();
  }, []);

  return (
    <View>
      <View
        style={styles.search}
        className="h-14 flex-row rounded-2xl border-2 items-center border-[#778888] bg-white px-5"
      >
        <Search size={18} color="#778888" />

        <TextInput
          placeholder="Search"
          placeholderTextColor="#7B8A91"
          className="ml-4 flex-1 text-lg text-black"
        />
      </View>

      {loading ? (
        <Text style={styles.statusText}>Loading cardiologists...</Text>
      ) : null}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {!loading && !error && doctors.length === 0 ? (
        <Text style={styles.statusText}>No cardiologists found.</Text>
      ) : null}

      <View style={styles.containerMain}>
        {doctors.map((doctor, index) => {
          const closestDay =
            index === 0
              ? "Tue. April 14th"
              : index === 1
                ? "Mon. June 2nd"
                : index === 2
                  ? "Wed. July 9th"
                  : "Thu. August 12th";

          return (
            <View key={doctor.id} style={styles.card}>
              <View style={styles.doctorInfo}>
                <Image
                  source={{
                    uri:
                      doctor.avatar_url ??
                      "https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg",
                  }}
                  style={styles.avatar}
                />

                <View style={styles.doctorText}>
                  <Text style={styles.name}>{doctor.full_name}</Text>
                  <Text style={styles.profession}>
                    {doctor.specialty ?? "Cardiologist"}
                  </Text>
                </View>

                <TouchableOpacity style={styles.favorite}>
                  <MaterialIcons name="star-border" size={24} color="#3f3128" />
                </TouchableOpacity>
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
                          specialty: doctor.specialty ?? "Cardiology",
                        },
                      })
                    }
                  >
                    <Text style={styles.text2}>Book Now</Text>
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
};

const styles = StyleSheet.create({
  search: {
    width: 350,
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
    width: 44,
    height: 44,
    borderRadius: 30,
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

export default Card;