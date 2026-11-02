import { Colors, Sizes } from "@/constants/theme";
import { useMedicationList } from "@/src/hooks/useMedicationList";
import { formatMedicationDuration, formatMedicationInstructions } from "@/src/utils/medicationFormat";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, Text, TouchableOpacity, useWindowDimensions, View, } from "react-native";

const CONFIRMATIONS_STORAGE_KEY = "medication-reminder-confirmations";

function getScheduledTime(medication: {
  morning_intake?: string[] | null;
  noon_intake?: string[] | null;
  evening_intake?: string[] | null;
  hours?: string[] | null;
  days_frequency?: string[] | null;
}) {
  const intakeHours = [
    ...(medication.morning_intake?.length ? [8 * 60] : []),
    ...(medication.noon_intake?.length ? [12 * 60] : []),
    ...(medication.evening_intake?.length ? [19 * 60] : []),
  ].sort((a, b) => a - b);

  if (intakeHours.length > 0) return intakeHours;

  const scheduledHours = (medication.hours ?? [])
    .map((time) => {
      const matchTimeRegex = /^(\d{1,2})(?::(\d{2}))?$/.exec(time.trim());
      if (!matchTimeRegex) return null;

      const hour = Number(matchTimeRegex[1]);
      const minute = Number(matchTimeRegex[2] ?? 0);
      return hour <= 23 && minute <= 59 ? hour * 60 + minute : null;
    })
    .filter((time): time is number => time !== null)
    .sort((a, b) => a - b);

  return scheduledHours.length > 0 ? scheduledHours : [8 * 60];
}

function getNextIntakeTime(times: number[], selectedDays: string[], after: number) {
  const dayIndexes: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const scheduledDays = new Set(
    selectedDays.map((day) => dayIndexes[day]).filter((day) => day !== undefined)
  );

  for (let dayOffset = 0; dayOffset <= 7; dayOffset += 1) {
    const targetDate = new Date(after);
    targetDate.setDate(targetDate.getDate() + dayOffset);
    if (scheduledDays.size > 0 && !scheduledDays.has(targetDate.getDay())) continue;

    for (const time of times) {
      const targetTime = new Date(after);
      targetTime.setDate(targetDate.getDate());
      targetTime.setMonth(targetDate.getMonth());
      targetTime.setFullYear(targetDate.getFullYear());
      targetTime.setHours(Math.floor(time / 60), time % 60, 0, 0);
      if (targetTime.getTime() > after) return targetTime.getTime();
    }
  }
  return after + 7 * 24 * 60 * 60 * 1000;
}

function adjustCountdown(remainingMs: number) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function MedicationReminder() {
  const { medications, loading, error, refetch } = useMedicationList();
  const [activeIndex, setActiveIndex] = useState(0);
  const [confirmations, setConfirmations] = useState<Record<string, number>>({});
  const [confirmationsLoaded, setConfirmationsLoaded] = useState(false);
  const [now, setNow] = useState(Date.now());
  const { width } = useWindowDimensions();

  const horizontalPadding = 50;
  const cardWidth = width - horizontalPadding;

  useFocusEffect(
    useCallback(() => {
      refetch().catch(() => { });
    }, [refetch])
  );

  const sortedMedications = useMemo(
    () => [...medications].sort((a, b) => a.id - b.id),
    [medications]
  );

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(CONFIRMATIONS_STORAGE_KEY)
      .then((value) => {
        if (mounted && value) setConfirmations(JSON.parse(value));
      })
      .catch(() => { })
      .finally(() => {
        if (mounted) setConfirmationsLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function confirmMedication(medicationId: number) {
    const confirmedAt = Date.now();
    const updated = { ...confirmations, [medicationId]: confirmedAt };
    setConfirmations(updated);
    setNow(confirmedAt);
    await AsyncStorage.setItem(CONFIRMATIONS_STORAGE_KEY, JSON.stringify(updated));
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / cardWidth);

    setActiveIndex(
      Math.max(0, Math.min(nextIndex, sortedMedications.length - 1))
    );
  }

  const { t } = useTranslation();

  return (
    <View style={{ paddingTop: Sizes.h3 }}>
      <Text
        style={{
          fontSize: Sizes.h2,
          fontWeight: "medium",
          color: Colors.text,
          marginLeft: Sizes.h5,
          marginBottom: Sizes.p0,
        }}>{t(`medication-reminder.medication`)}</Text>

      <View className="items-center">
        {loading ? (
          <Text
            style={{
              fontSize: Sizes.paragraph,
              color: Colors.text,
              marginTop: Sizes.p1
            }}>
            {t(`medication-reminder.loading`)}
          </Text>
        ) : null}

        {error ? (
          <Text
            style={{
              fontSize: Sizes.paragraph,
              color: Colors.error,
              marginTop: Sizes.p1
            }} >{t(`medication-reminder.${error}`)}</Text>
        ) : null}

        {!loading && !error && sortedMedications.length === 0 ? (
          <TouchableOpacity
            onPress={() => router.push("/medication-formpage")}
            style={{
              backgroundColor: Colors.primary,
              height: Sizes.BtnP,
              borderRadius: Sizes.p3,
              paddingHorizontal: Sizes.h2 - 2,
              marginTop: Sizes.p1 + 2,
            }}
            className="flex-row items-center self-center justify-center"
          >
            <Plus size={Sizes.h4} color={Colors.bg2} />
            <Text style={{
              marginLeft: Sizes.p0 - 2,
              color: Colors.bg2,
              fontSize: Sizes.paragraph
            }} className="font-medium" />

            <Text
              style={{
                fontSize: Sizes.paragraph,
                color: Colors.bg2
              }}
              className="font-medium">
              {t(`medication-reminder.addRoutine`)}
            </Text>
          </TouchableOpacity>
        ) : null}

        {!loading && !error && sortedMedications.length > 0 ? (
          <View
            style={{
              backgroundColor: Colors.bg2,
              borderRadius: Sizes.p3,
              paddingHorizontal: Sizes.p2,
              paddingVertical: Sizes.h5,
              marginTop: Sizes.p1,
            }}>
            <View style={{ width: cardWidth, overflow: "hidden" }}>
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={sortedMedications}
                keyExtractor={(item) => String(item.id)}
                onMomentumScrollEnd={handleScroll}
                snapToInterval={cardWidth}
                snapToAlignment="start"
                decelerationRate="fast"
                bounces={false}
                overScrollMode="never"
                renderItem={({ item }) => (
                  <View style={{ width: cardWidth }}>
                    {(() => {
                      const confirmedAt = confirmations[item.id];
                      const nextIntake = confirmedAt
                        ? getNextIntakeTime(
                          getScheduledTime(item),
                          item.days_frequency ?? [],
                          confirmedAt
                        )
                        : null;
                      const remainingMs = nextIntake ? nextIntake - now : 0;
                      const waitForNextIntake = remainingMs > 0;
                      const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));

                      return (
                        <>
                          <Pressable
                            onPress={() => router.push("/medications")}
                            className="flex-row items-center"
                          >
                            <MaterialIcons name="medication" size={Sizes.IconLg} color="#075B7A" />
                            <View className="flex-1 ml-2">
                              <Text
                                style={{
                                  fontSize: Sizes.h5,
                                  color: Colors.text
                                }}
                                className="font-medium">
                                {item.name ?? "Unnamed medication"}
                              </Text>
                              <Text
                                style={{
                                  fontSize: Sizes.sm,
                                  color: Colors.textMuted
                                }}
                                className="mt-2">
                                {formatMedicationDuration(
                                )}
                              </Text>
                              <Text
                                style={{
                                  fontSize: Sizes.sm,
                                  color: Colors.textMuted
                                }}
                                className="mt-1">
                                {formatMedicationInstructions(
                                  item.instructions,
                                )}
                              </Text>
                            </View>
                            <View
                              style={{
                                borderRadius: Sizes.p3,
                                paddingHorizontal: Sizes.p2,
                                borderWidth: Sizes.p0 - 2,
                                borderColor: Colors.info,
                                paddingVertical: Sizes.p2,
                                backgroundColor: Colors.infoMuted
                              }}
                              className="mx-2">
                              <Text
                                style={{
                                  fontSize: Sizes.sm,
                                  color: Colors.text
                                }}
                                className="font-medium">
                                {t(`medication-reminder.reminder`)}
                              </Text>
                            </View>
                          </Pressable>


                          <TouchableOpacity
                            onPress={() => confirmMedication(item.id).catch(() => { })}
                            disabled={!confirmationsLoaded || waitForNextIntake}
                            style={{
                              height: Sizes.BtnP,
                              marginTop: Sizes.p1,
                              borderRadius: Sizes.p3,
                            }}
                            className={`mx-2 items-center justify-center ${waitForNextIntake || !confirmationsLoaded ? "bg-[#7B8A91]" : "bg-[#5085A8]"}`}
                          >
                            <Text
                              style={{
                                fontSize: Sizes.paragraph,
                                color: Colors.bg2
                              }}
                              className="font-semibold">
                              {waitForNextIntake
                                ? remainingMs > 24 * 60 * 60 * 1000
                                  ? `Next dose in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`
                                  : `Next dose in ${adjustCountdown(remainingMs)}`
                                : t(`medication-reminder.confirm`)}
                            </Text>
                          </TouchableOpacity>
                        </>
                      );
                    })()}
                  </View>
                )}
              />
            </View>

            {sortedMedications.length > 1 ? (
              <View className="mt-4 flex-row justify-center">
                {sortedMedications.map((medication, index) => (
                  <View
                    key={medication.id}
                    className={`mx-1 h-[8px] rounded-full ${index === activeIndex
                      ? "w-[22px] bg-[#0D5175]"
                      : "w-[8px] bg-[#B7D4DE]"
                      }`}
                  />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View >
  );
};