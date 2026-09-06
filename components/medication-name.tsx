import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface medicationNameProps {
    value: string;
    onChangeText: (text: string) => void;
}

export default function MedicationName({ value, onChangeText }: medicationNameProps) {
    return (
        <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter a name"
                value={value}
                onChangeText={onChangeText}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 20,
        marginTop: 27,
        marginBottom: 12,
        fontWeight: '500',

    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#8F9D9E'
    },
});