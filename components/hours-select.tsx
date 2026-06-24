import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface dayHours {
  id: string;
  time: string;
  isAvailable: boolean;
};

const hoursData: dayHours[] = [
  { id: '1', time: '09:00 AM', isAvailable: true },
  { id: '2', time: '10:00 AM', isAvailable: true },
  { id: '3', time: '11:00 AM', isAvailable: false },
  { id: '4', time: '12:00 PM', isAvailable: true },
  { id: '5', time: '01:00 PM', isAvailable: true },
  { id: '6', time: '02:00 PM', isAvailable: true },
  { id: '7', time: '03:00 PM', isAvailable: true },
  { id: '8', time: '04:00 PM', isAvailable: false },
  { id: '9', time: '05:00 PM', isAvailable: true },
  { id: '10', time: '06:00 PM', isAvailable: true },
];

const HoursBooking = () => {

  const [selectedId, setSelectedId] = useState<string | null>(null);

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
              onPress={() => hour.isAvailable && setSelectedId(hour.id)}
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
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginBottom: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonUnselected: {
    backgroundColor: '#fff',
    borderColor: '#000',
  },
  textUnselected: {
    color: '#000',
  },
  buttonUnavailable: {
    backgroundColor: '#989898',
    borderColor: '#989898',
  },
  textUnavailable: {
    color: '#d9d9d9',
  },
  buttonSelected: {
    backgroundColor: '#0D5175',
    borderColor: '#0D5175',
  },
  textSelected: {
    color: '#fff',
  },
  buttonBase: {
    width: '30%',
    minHeight: 44,
    marginHorizontal: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBase: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HoursBooking;