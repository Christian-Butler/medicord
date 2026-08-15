import React from 'react';
import { View } from 'react-native';
import { DropdownSelect } from 'react-native-input-select';


interface treatmentProps {
    duration: number,
    text: string,
    setValue: (arg0: number) => void,
    value: number
}

export default function TreatmentDuration({ duration, text, setValue, value }: treatmentProps) {
    const options = []
    for (var i = 1; i < duration + 1; i++) {
        options.push({ label: i, value: i });
    }
    return (
        <View style={{ width: 100, alignItems: 'center' }}>
            <DropdownSelect
                dropdownStyle={{
                    borderRadius: 14,
                    height: 30,
                    backgroundColor: '#fff',
                    width: "auto",
                }}
                label={text}
                labelStyle={{ fontSize: 16, color: '#00', fontWeight: '400' }}
                placeholder={text}
                options={options}
                selectedValue={value}
                onValueChange={(value) => setValue(value as number)}
                primaryColor={'#326F95'}
            />
        </View>
    );
}