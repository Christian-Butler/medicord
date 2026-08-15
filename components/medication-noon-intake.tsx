import React from 'react';
import { View } from 'react-native';
import Dropdown from 'react-native-input-select';

interface intakeProps {
    duration: number,
    text: string,
    setValue: (arg0: number) => void,
    value: number
}

export default function IntakeNoon({ duration, text, setValue, value }: intakeProps) {
    const options = []
    for (var i = 1; i < duration + 1; i++) {
        options.push({ label: i, value: i });
    }
    return (
        <View style={{ width: 110, alignItems: 'center' }}>
            <Dropdown
                dropdownStyle={{
                    backgroundColor: '#fff',
                    alignSelf: 'center',
                    width: 100,
                    height: 30,
                    borderRadius: 14,
                }}
                label={text}
                labelStyle={{ fontSize: 16, color: '#000', fontWeight: '400', alignSelf: 'center' }}
                placeholder={text}
                options={options}
                selectedValue={value}
                onValueChange={(value) => setValue(value as number)}
                primaryColor={'#326F95'}
            />
        </View>
    );
}