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
                autoCapitalize="words"
                autoCorrect={false}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginTop: 15,
        marginBottom: 5,
        fontWeight: '600'
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
});