import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InstructionListProps {
    instructions: string[];
    onChangeInstruction: (text: string, index: number) => void;
    onAddInstruction: () => void;
}

export default function InstructionList({ instructions, onChangeInstruction, onAddInstruction }: InstructionListProps) {
    return (
        <View>
            <Text style={styles.label}>Other instructions</Text>
            {instructions.map((inst, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={`Instruction ${index + 1}`}
                    value={inst}
                    onChangeText={(text) => onChangeInstruction(text, index)}
                />
            ))}
            <TouchableOpacity style={styles.addButton} onPress={onAddInstruction}>
                <Text style={styles.addButtonText}>+ Add Instruction</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 20,
        marginTop: 12,
        marginBottom: 12,
        fontWeight: 500
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    addButton: {
        backgroundColor: '#5085A8',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 600,
        fontSize: 16
    },
});