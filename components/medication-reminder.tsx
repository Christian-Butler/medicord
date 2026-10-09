import { useMedicationList } from "@/src/hooks/useMedicationList";
import { formatMedicationDuration, formatMedicationInstructions } from "@/src/utils/medicationFormat";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, Text, TouchableOpacity, useWindowDimensions, View, } from "react-native";

export default function MedicationReminder() {
  const { medications, loading, error, refetch } = useMedicationList();
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();

  const horizontalPadding = 50;
  const cardWidth = width - horizontalPadding;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const sortedMedications = useMemo(
    () => [...medications].sort((a, b) => a.id - b.id),
    [medications]
  );

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

      <View className="items-center ">
        {loading ? (
          <Text className="mt-5 text-[15px] text-black">
            {t(`medication-reminder.loading`)}
          </Text>
        ) : null}

        {error ? (
          <Text className="mt-5 text-[15px] text-[#B42318]">{t(`medication-reminder.${error}`)}</Text>
        ) : null}

        {!loading && !error && sortedMedications.length === 0 ? (
          <TouchableOpacity
            onPress={() => router.push("/medication-formpage")}
            className="h-[50px] flex-row items-center self-center justify-center rounded-2xl border-[3px] border-[#09516D] bg-white"
          >
            <Plus size={30} color="#09516D" />
            <Text className="text-[18px] font-medium text-[#09516D]" />

            <Text className="text-[18px] font-medium text-[#09516D]">
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
                    <Pressable
                      onPress={() => router.push("/medications")}
                      className="flex-row items-center"
                    >
                      <MaterialIcons name="medication" size={42} color="#075B7A" />
                      <View className="flex-1">
                        <Text className="text-[18px] font-medium text-black">
                          {item.name ?? "Unnamed medication"}
                        </Text>
                        <Text className="mt-1 text-[14px] font-regular text-black">
                          {formatMedicationDuration(
                            item.months_duration,
                            item.weeks_duration,
                            item.days_duration
                          )}
                        </Text>
                        <Text className="mt-1 text-[14px] font-regular text-black">
                          {formatMedicationInstructions(
                            item.instructions,
                          )}
                        </Text>
                      </View>
                      <View className="mx-2 py-2 px-4 rounded-[12px] border-[2px] border-[#D3A000] bg-[#FFE9A8]">
                        <Text className="text-[14px] font-medium text-black">
                          {t(`medication-reminder.reminder`)}
                        </Text>
                      </View>
                    </Pressable>


                    <Pressable
                      onPress={() => { }}
                      className="mx-2 mt-5 h-[50px] items-center justify-center rounded-[12px] bg-[#5085A8]"
                    >
                      <Text className="text-[16px] font-semibold text-white">
                        {t(`medication-reminder.confirm`)}
                      </Text>
                    </Pressable>
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