import React from 'react';
import { View } from 'react-native';
import Dropdown from 'react-native-input-select';

interface intakeProps {
    duration: number,
    text: string,
    setValue: (arg0: number) => void,
    value: number
}

export default function IntakeEvening({ duration, text, setValue, value }: intakeProps) {
    const options = []
    for (var i = 1; i < duration + 1; i++) {
        options.push({ label: i, value: i });
    }
    return (
        <View style={{ width: 110 }}>
            <Dropdown
                dropdownStyle={{
                    width: 100,
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: '#fff',
                }}
                label={text}
                labelStyle={{
                    fontSize: 16, fontWeight: '400', color: '#000'
                }}
                placeholder={text}
                options={options}
                selectedValue={value}
                onValueChange={(value) => setValue(value as number)}
                primaryColor={'#326F95'}
            />

        </View>
    );
}