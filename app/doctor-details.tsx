import AppointmentReasonOverlay from "@/components/booking-reason";
import DoctorHeader from "@/components/doctor-details-header";
import FirstTimeBookingOverlay from "@/components/first-patient-overlay";
import GPOverlay from "@/components/gp-referral-overlay";
import ScreenHeader from "@/components/screen-header";
import { useDoctor } from "@/src/hooks/useDoctor";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DoctorDetails() {
  const { doctorId, name, closestDay, specialty } = useLocalSearchParams<{
    doctorId?: string;
    name?: string;
    closestDay?: string;
    specialty?: string;
  }>();
  const { t } = useTranslation();

  const { doctor, loading, error } = useDoctor(doctorId ? String(doctorId) : undefined);

  const doctorName = doctor?.full_name || name || "Doctor";
  const doctorProfession = doctor?.specialty || specialty || "Specialist";
  const availableDate = closestDay || t(`doctor-details.noSlot`);
  const bio = doctor?.bio ?? null;
  const yearsExperience = doctor?.years_experience ?? null;
  const previousExperience = doctor?.previous_experience ?? null;
  const qualifiedYear = doctor?.qualified_year ?? null;
  const consultationFee = doctor?.consultation_fee ?? null;
  const clinicName = doctor?.clinic_name ?? null;
  const location = doctor?.location ?? null;

  const [showGpOverlay, setShowGpOverlay] = useState(false);
  const [showFirstTimeOverlay, setShowFirstTimeOverlay] = useState(false);
  const [showReasonOverlay, setShowReasonOverlay] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  useEffect(() => {
    if (!doctor) return;
    if (doctor.requires_gp_referral) {
      setShowGpOverlay(true);
    } else {
      setShowFirstTimeOverlay(true);
    }
  }, [doctor]);

  function handleGpContinue() {
    setShowGpOverlay(false);
    setShowFirstTimeOverlay(true);
  }

  function handleFirstTimeConfirm() {
    setShowFirstTimeOverlay(false);
  }

  function handleToggleReason(reason: string) {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  }

  function handleReasonConfirm() {
    setShowReasonOverlay(false);
    router.push({
      pathname: "/book-appointment",
      params: {
        doctorId: doctor?.id ?? doctorId,
        specialty: doctorProfession,
        closestDay: availableDate,
        reason: selectedReasons.join(", "),
      },
    });
  }


  return (
    <View className="flex-1 bg-[#EEF9FB]">
      <ScreenHeader title={doctorName} />
      <ScrollView>
        <View className="flex-1">
          <DoctorHeader name={doctorName} profession={doctorProfession} doctorId={doctorId} />
        </View>

        <View style={{ padding: 20, paddingBottom: 220 }}>
          {loading ? (
            <Text style={{ color: "#333", paddingBottom: 12 }}>{t(`doctor-details.loading`)}</Text>
          ) : null}

          {error ? (
            <Text style={{ color: "#B42318", paddingBottom: 12 }}>{error}</Text>
          ) : null}

          {bio ? (
            <>
              <Text style={styles.sectionTitle}>{t(`doctor-details.about`)}</Text>
              <Text style={styles.bodyText}>{t(`doctor-details.${bio}`)}</Text>
            </>
          ) : null}

          {(yearsExperience || qualifiedYear) ? (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Experience</Text>
              {yearsExperience ? (
                <Text style={styles.bodyText}>
                  {yearsExperience} {t(`doctor-details.years`)}
                </Text>
              ) : null}
              {qualifiedYear ? (
                <Text style={styles.bodyText}>{t(`doctor-details.qualify`)}{qualifiedYear}</Text>
              ) : null}
              {previousExperience ? (
                <Text style={styles.bodyText}>{t(`doctor-details.previous`)} {previousExperience}</Text>
              ) : null}
            </>
          ) : null}

          {(clinicName || location) ? (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t(`doctor-details.location`)}</Text>
              {clinicName ? <Text style={styles.bodyText}>{clinicName}</Text> : null}
              {location ? <Text style={styles.bodyText}>{location}</Text> : null}
            </>
          ) : null}

          {consultationFee ? (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t(`doctor-details.fee`)}</Text>
              <Text style={styles.bodyText}>€{consultationFee}{t(`doctor-details.consultation`)}</Text>
            </>
          ) : null}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t(`doctor-details.services`)}</Text>
          <Text style={styles.bodyText}>
            {t(`doctor-details.possible`)}

          </Text>
        </View>
      </ScrollView>

      <View style={styles.container}>
        <View />
        <View style={styles.dayContainer}>
          <Text>{t(`doctor-details.closest`)}</Text>
          <Text style={styles.day}>{availableDate}</Text>
        </View>

        <Pressable
          style={styles.containerButton}
          accessibilityRole="button"
          onPress={() => setShowReasonOverlay(true)}
        >
          <Text style={styles.buttonText}>{t(`doctor-details.book`)}</Text>
        </Pressable>
      </View>

      <GPOverlay
        visible={showGpOverlay}
        onGoToGpSearch={() => {
          setShowGpOverlay(false);
          router.push("/specialist-page");
        }}
        onContinue={handleGpContinue}
        onClose={() => setShowGpOverlay(false)}
      />

      <FirstTimeBookingOverlay
        visible={showFirstTimeOverlay}
        onNewPatient={handleFirstTimeConfirm}
        onReturningPatient={handleFirstTimeConfirm}
        onClose={() => setShowFirstTimeOverlay(false)}
      />

      <AppointmentReasonOverlay
        visible={showReasonOverlay}
        selectedReasons={selectedReasons}
        onToggleReason={handleToggleReason}
        onConfirm={handleReasonConfirm}
        onClose={() => setShowReasonOverlay(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "400",
    paddingBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
    paddingBottom: 4,
  },
  containerButton: {
    flexDirection: "row",
    backgroundColor: "#5085A8",
    color: "#fff",
    height: 50,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 30,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  container: {
    height: 180,
    backgroundColor: "#fff",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#070b23",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-between",
  },
});