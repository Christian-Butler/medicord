import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Instruction {
    id: string;
    text: string;
}

interface InstructionListProps {
    instructions: Instruction[];
    onChangeInstruction: (text: string, id: string) => void;
    onAddInstruction: () => void;
    onRemoveInstruction: (id: string) => void;
}

export default function InstructionList({ instructions, onChangeInstruction, onAddInstruction, onRemoveInstruction }: InstructionListProps) {
    return (

        <View>
            <View>
                <Text style={styles.title}>Other instructions</Text>
                {instructions.map((instruction) => (
                    <View key={instruction.id} style={styles.row}>
                        <TextInput
                            style={styles.input}
                            placeholder="ex. Number of pills a day"
                            value={instruction.text}
                            onChangeText={(text) => onChangeInstruction(text, instruction.id)}
                        />
                        {instructions.length > 1 ? (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => onRemoveInstruction(instruction.id)}
                            >
                                <MaterialIcons name="delete" size={24} color="#fff" />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={onAddInstruction}>
                <Text style={styles.addButtonText}>+ Add Instruction</Text>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        marginTop: 12,
        marginBottom: 12,
        fontWeight: '500'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#8F9D9E',
    },
    removeButton: {
        backgroundColor: '#D13438',
        borderRadius: 8,
        padding: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#5085A8',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16
    },
});