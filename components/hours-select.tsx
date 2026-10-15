import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DayHours {
  id: string;
  time: string;
  value: string;
  isAvailable: boolean;
}

type HoursBookingProps = {
  selectedTime?: string;
  onSelectTime?: (time: string) => void;
};

const hoursData: DayHours[] = [
  { id: "1", time: "09:00", value: "09:00", isAvailable: true },
  { id: "2", time: "10:00", value: "10:00", isAvailable: true },
  { id: "3", time: "11:00", value: "11:00", isAvailable: false },
  { id: "4", time: "12:00", value: "12:00", isAvailable: true },
  { id: "5", time: "13:00", value: "13:00", isAvailable: true },
  { id: "6", time: "14:00", value: "14:00", isAvailable: true },
  { id: "7", time: "15:00", value: "15:00", isAvailable: true },
  { id: "8", time: "16:00", value: "16:00", isAvailable: false },
  { id: "9", time: "17:00", value: "17:00", isAvailable: true },
  { id: "10", time: "18:00", value: "18:00", isAvailable: true },
];

const HoursBooking = ({ selectedTime, onSelectTime }: HoursBookingProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTime) return;

    const matchingHour = hoursData.find((hour) => hour.value === selectedTime);
    setSelectedId(matchingHour?.id ?? null);
  }, [selectedTime]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {hoursData.map((hour) => {
          const isSelected = hour.id === selectedId;

          let currentButtonStyle = styles.buttonUnselected;
          let currentTextStyle = styles.textUnselected;

          if (!hour.isAvailable) {
            currentButtonStyle = styles.buttonUnavailable;
            currentTextStyle = styles.textUnavailable;
          } else if (isSelected) {
            currentButtonStyle = styles.buttonSelected;
            currentTextStyle = styles.textSelected;
          }

          return (
            <TouchableOpacity
              key={hour.id}
              style={[styles.buttonBase, currentButtonStyle]}
              onPress={() => {
                if (!hour.isAvailable) return;

                setSelectedId(hour.id);
                onSelectTime?.(hour.value);

                console.log("[HoursBooking] selected time:", hour.value);
              }}
              disabled={!hour.isAvailable}
            >
              <Text style={[styles.textBase, currentTextStyle]}>
                {hour.time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginBottom: 26,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  buttonUnselected: {
    backgroundColor: "#fff",
  },
  textUnselected: {
    color: "#000",
  },
  buttonUnavailable: {
    backgroundColor: "",
    opacity: 1,
  },
  textUnavailable: {
    color: "#A1A1A1",
  },
  buttonSelected: {
    backgroundColor: "#0D5175",
  },
  textSelected: {
    color: "#fff",
  },
  buttonBase: {
    width: "30%",
    minHeight: 44,
    marginHorizontal: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textBase: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HoursBooking;