import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DaysSelectorProps {
    selectedDays: string[];
    onToggleDay: (day: string) => void;
}

export default function DaysSelector({ selectedDays, onToggleDay }: DaysSelectorProps) {


    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <View>
            <Text style={styles.label}>Which days?</Text>
            <View style={styles.daysContainer}>
                {weekDays.map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                            styles.dayButton,
                            selectedDays.includes(day) && styles.dayButtonSelected,
                        ]}
                        onPress={() => onToggleDay(day)}>
                        <Text style={selectedDays.includes(day) ? styles.textLight : styles.textDark}>
                            {day}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
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
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10
    },
    dayButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#e0e0e0'
    },
    dayButtonSelected: {
        backgroundColor: '#5085A8'
    },
    textLight: {
        color: '#fff',
        fontWeight: 'medium'
    },
    textDark: {
        color: '#333'
    },
})