import WeeklyCalendar from "@/components/calendar";
import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from 'expo-checkbox';
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Booking() {

    const [isChecked, setChecked] = useState(false);

    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScrollView>
                <View className="flex-1" style={{ height: 26 }}>
                </View>
                <View style={styles.monthContainer}>
                    <Text style={{ fontSize: 22 }}>Select date</Text>
                    <View style={styles.month}>
                        <Text >Month selected: June</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={18} />
                    </View>
                </View>
                <View style={{ marginBottom: 26 }}>
                    <WeeklyCalendar />
                </View>
                <View style={{ flexDirection: 'row', maxWidth: 350, justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center' }}>
                    <Checkbox style={{ marginRight: 20 }} value={isChecked} onValueChange={setChecked} />
                    <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: 400, maxWidth: 300, color: '#333' }}>By booking this appointment, I am confirming my presence at that day and hour. I am aware that by failing to attend, or not notifying my unavailability may result in getting blacklisted.</Text>
                </View>
                <View style={styles.containerButton}>
                    <Text style={styles.buttonText}>Confirm booking</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    month: {
        fontSize: 12,
        fontWeight: '500',
        backgroundColor: '#fff',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 10,
        borderWidth: 2,
        borderColor: '#0D5175',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',

    },
    monthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: 26,
    },
    containerButton: {
        width: '96%',
        backgroundColor: '#5085A8',
        color: '#fff',
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        marginTop: 30,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 14,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff'
    },
})