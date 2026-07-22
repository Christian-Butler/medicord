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
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.daysContainer}>
                {weekDays.map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                            styles.dayButton,
                            selectedDays.includes(day) && styles.dayButtonSelected,
                        ]}
                        onPress={() => onToggleDay(day)}>
                        <Text style={selectedDays.includes(day) ? styles.textLight : styles.text}>
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
        fontSize: 20,
        marginBottom: 12,
        fontWeight: '500'
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: 10,
        marginBottom: 28,
    },
    dayButton: {
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#326F95'
    },
    dayButtonSelected: {
        backgroundColor: '#326F95'
    },
    textLight: {
        color: '#fff',
        fontWeight: 'medium'
    },
    text: {
        color: '#326F95',
        fontWeight: 500,
    },
})