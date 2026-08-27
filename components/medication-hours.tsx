import React from 'react';
import { View } from 'react-native';
import Dropdown from 'react-native-input-select';

interface MedicationFrequencyProps {
  text: string;
  setValue: (value: string) => void;
  value: string;
}

const frequencyChoices = [
  { label: "As needed", value: "as_needed" },
  { label: "Once daily", value: "once_daily" },
  { label: "Twice daily", value: "twice_daily" },
  { label: "Three times daily", value: "three_times_daily" },
  { label: "Long term / Ongoing", value: "long_term" },
];

export default function MedicationHours({ text, setValue, value }: MedicationFrequencyProps) {
  return (
    <View style={{ marginTop: 27, marginBottom: 5, width: 220 }}>
      <Dropdown
        dropdownStyle={{
          backgroundColor: '#fff',
          borderRadius: 14,
        }}
        label={text}
        labelStyle={{
          paddingTop: 4,
          fontSize: 20,
          fontWeight: '500',
          color: '#000',
        }}
        placeholder="Select frequency"
        options={frequencyChoices}
        selectedValue={value}
        onValueChange={(nextValue) => setValue(String(nextValue))}
        primaryColor={'#326F95'}
      />
    </View>
  );
}