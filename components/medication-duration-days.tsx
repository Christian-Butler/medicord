import React from 'react';
import Dropdown from 'react-native-input-select';

interface treatmentProps {
    duration: number,
    text: string,
    setValue: (arg0: number) => void,
    value: number
}

export default function TreatmentDurationDay({ duration, text, setValue, value }: treatmentProps) {
    const options = []
    for (var i = 1; i < duration + 1; i++) {
        options.push({ label: i, value: i });
    }
    return (
        <Dropdown
            dropdownStyle={{
                borderRadius: 14,
            }}
            placeholder={text}
            options={options}
            selectedValue={value}
            onValueChange={(value) => setValue(value as number)}
            primaryColor={'green'}
        />
    );
}