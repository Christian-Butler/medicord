import React from 'react';
import { Text, View } from 'react-native';
import Dropdown from 'react-native-input-select';


interface treatmentProps {
    duration: number,
    text: string,
    setValue: (arg0: number) => void,
    value: number
}

export default function TreatmentDurationWeek({ duration, text, setValue, value }: treatmentProps) {
    const options = []
    for (var i = 1; i < duration + 1; i++) {
        options.push({ label: i, value: i });
    }
    return (
        <View style={{ width: 100, alignItems: 'center' }}>
            <Dropdown
                dropdownStyle={{
                    borderRadius: 14,
                    backgroundColor: '#fff',
                    width: 100,
                    height: 30,
                }}
                placeholder={text}
                options={options}
                selectedValue={value}
                onValueChange={(value) => setValue(value as number)}
                primaryColor={'#326F95'}
            />
            <Text style={{ fontSize: 14 }}>
                Week(s)
            </Text>
        </View>
    );
}