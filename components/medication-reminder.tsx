import { useMedicationList } from "@/src/hooks/useMedicationList";
import { formatMedicationDuration } from "@/src/utils/medicationFormat";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, Text, TouchableOpacity, useWindowDimensions, View, } from "react-native";

export default function MedicationReminder() {
  const { medications, loading, error, refetch } = useMedicationList();
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();

  const horizontalPadding = 48;
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


  return (
    <View className="px-6 pt-8">
      <Text className="text-[24px] font-normal text-black">Medication</Text>

      {loading ? (
        <Text className="mt-5 text-[15px] text-black">
          Loading medications...
        </Text>
      ) : null}

      {error ? (
        <Text className="mt-5 text-[15px] text-[#B42318]">{error}</Text>
      ) : null}

      {!loading && !error && sortedMedications.length === 0 ? (
        <TouchableOpacity
          onPress={() => router.push("/medication-routine")}
          className="pl-10 pr-12 mt-5 h-[58px] flex-row items-center self-center justify-center rounded-2xl border-[3px] border-[#09516D] bg-white"
        >
          <Plus size={30} color="#09516D" />
<<<<<<< HEAD
          <Text className="ml-3 text-[19px] font-medium text-[#09516D]">
=======

          <Text className="ml-3 text-[18px] font-medium text-[#09516D]">
>>>>>>> c520f0bb7480abeeaaf8a8d1b8f481ee14f56406
            Add medication routine
          </Text>
        </TouchableOpacity>
      ) : null}

      {!loading && !error && sortedMedications.length > 0 ? (
        <View className="mt-5">
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
                    <View className="ml-4 flex-1">
                      <Text className="text-[19px] font-medium text-black">
                        {item.name ?? "Unnamed medication"}
                      </Text>
                      <Text className="mt-1 text-[14px] font-normal text-black">
                        {formatMedicationDuration(
                          item.months_duration,
                          item.weeks_duration,
                          item.days_duration
                        )}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={34} color="#000" />
                  </Pressable>

                  <View className="mt-4 h-[46px] items-center justify-center rounded-[12px] border-[2px] border-[#D3A000] bg-[#FFE9A8]">
                    <Text className="text-[16px] font-medium text-black">
                      Have you completed your daily intake?
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => { }}
                    className="mt-5 h-[58px] items-center justify-center rounded-[12px] bg-[#5085A8]"
                  >
                    <Text className="text-[17px] font-semibold text-white">
                      Confirm
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
    </View >
  );
};