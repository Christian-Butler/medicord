import React from 'react';
import { StyleSheet, View } from 'react-native';
import Dropdown from 'react-native-input-select';

interface medicationHoursProps {
    text: string;
    setValue: (value: string) => void;
    value: string;
}

const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

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

const styles = StyleSheet.create({

    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxBox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.2,
        borderColor: '#161819',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    checkboxBoxChecked: {
        backgroundColor: '#5085A8',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '400',
    },
    checkboxLabel: {
        color: '#26282b',
        fontSize: 16,
    },
});