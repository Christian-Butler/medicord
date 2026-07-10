import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InstructionListProps {
    instructions: string[];
    onChangeInstruction: (text: string, index: number) => void;
    onAddInstruction: () => void;
}

export default function InsutrctionList({ instructions, onChangeInstruction, onAddInstruction }: InstructionListProps) {
    return (
        <View>
            <Text style={styles.label}>Instructions</Text>
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
    addButton: {
        padding: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    addButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 16
    },
});