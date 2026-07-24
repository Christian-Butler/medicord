import { formatTime } from '@/src/utils 2/medicationTime';
import React from 'react';
import { View } from 'react-native';
import Dropdown from 'react-native-input-select';

interface medicationHoursProps {
    text: string;
    setValue: (value: string) => void;
    value: string;
}

const timeChoices = () => {
    const options = [] as Array<{ label: string; value: string }>;

    for (let totalMinutes = 0; totalMinutes <= 23 * 60 + 30; totalMinutes += 30) {
        options.push({
            label: formatTime(totalMinutes),
            value: formatTime(totalMinutes),
        });
    }

    return options;
};

export default function MedicationHours({ text, setValue, value }: medicationHoursProps) {
    const choices = timeChoices();


    return (
        <View style={{ marginTop: 27, marginBottom: 5, width: 130 }}>

            <Dropdown
                dropdownStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 14,
                }}
                label={text}
                labelStyle={{
                    paddingTop: 4, fontSize: 20, fontWeight: '500', color: '#000'
                }}
                placeholder={text}
                options={choices}
                selectedValue={value}
                onValueChange={(nextValue) => setValue(String(nextValue))}
                primaryColor={'#326F95'}
            />


        </View>

    );
}