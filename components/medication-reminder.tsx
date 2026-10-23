import { useMedicationList } from "@/src/hooks/useMedicationList";
import { NO_TIME_HOUR, slotsFor } from "@/src/libs/medicationCalender";
import type { Medication } from "@/src/types/medicationTypes";
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
    <View className="pt-8">
      <Text className="ml-6 text-[24px] font-normal text-black">{t(`medication-reminder.medication`)}</Text>

      <View className="items-center">
        {loading ? (
          <Text className="mt-5 text-[16px] text-black">
            {t(`medication-reminder.loading`)}
          </Text>
        ) : null}

        {error ? (
          <Text className="mt-5 text-[15px] text-[#B42318]">{t(`medication-reminder.${error}`)}</Text>
        ) : null}

        {!loading && !error && sortedMedications.length === 0 ? (
          <TouchableOpacity
            onPress={() => router.push("/medication-formpage")}
            className="mt-8 px-24 h-[50px] flex-row items-center self-center justify-center rounded-2xl bg-[#5085A8]"
          >
            <Plus size={20} color="white" />
            <Text className="ml-2 text-[16px] font-medium text-[#white]" />

            <Text className="text-[16px] font-medium text-[white]">
              {t(`medication-reminder.addRoutine`)}
            </Text>
          </TouchableOpacity>
        ) : null}

        {!loading && !error && sortedMedications.length > 0 ? (
          <View className="mt-5 bg-[white] py-4 px-2 rounded-2xl">
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
                            <MaterialIcons name="medication" size={42} color="#075B7A" />
                            <View className="flex-1 ml-2">
                              <Text className="text-[18px] font-medium text-black">
                                {item.name ?? "Unnamed medication"}
                              </Text>
                              <Text className="mt-1 text-[14px] font-regular text-gray-600">
                                {formatMedicationDuration(
                                )}
                              </Text>
                              <Text className="mt-1 text-[14px] font-regular text-gray-600">
                                {formatMedicationInstructions(
                                  item.instructions,
                                )}
                              </Text>
                            </View>
                            <View className="mx-2 py-2 px-4 rounded-[12px] border-[2px] border-[#D3A000] bg-[#FFE9A8]">
                              <Text className="text-[14px] font-medium text-[black]">
                                {t(`medication-reminder.reminder`)}
                              </Text>
                            </View>
                          </Pressable>


                          <TouchableOpacity
                            onPress={() => confirmMedication(item.id).catch(() => { })}
                            disabled={!confirmationsLoaded || waitForNextIntake}
                            className={`mx-2 mt-5 h-[50px] items-center justify-center rounded-[12px] ${waitForNextIntake || !confirmationsLoaded ? "bg-[#8A9BA3]" : "bg-[#5085A8]"}`}
                          >
                            <Text className="text-[16px] font-semibold text-white">
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