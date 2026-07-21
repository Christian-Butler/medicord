import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface InstructionListProps {
    instructions: string[];
    onChangeInstruction: (text: string, index: number) => void;
    onAddInstruction: () => void;
}

export default function InstructionList({ instructions, onChangeInstruction, onAddInstruction }: InstructionListProps) {
    return (
        <SafeAreaProvider>
            <View>
                <View>
                    <Text style={styles.title}>Other instructions</Text>
                    {instructions.map((inst, index) => (
                        <TextInput
                            style={styles.input}
                            placeholder="ex. Number of pills a day"
                            value={inst}
                            onChangeText={(text) => onChangeInstruction(text, index)}

                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.addButton} onPress={onAddInstruction}>
                    <Text style={styles.addButtonText}>+ Add Instruction</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    label: {
        color: '#778888',
    },
    title: {
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
        borderWidth: 1.5,
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