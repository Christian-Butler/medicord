import TreatmentDurationDay from '@/components/medication-duration-days';
import TreatmentDurationMonth from '@/components/medication-duration-months';
import TreatmentDurationWeek from '@/components/medication-duration-weeks';
import IntakeEvening from '@/components/medication-evening-intake';
import MedicationHours from '@/components/medication-hours';
import InstructionList from '@/components/medication-instructions';
import IntakeMorning from '@/components/medication-morning-intake';
import MedicationName from '@/components/medication-name';
import IntakeNoon from '@/components/medication-noon-intake';
import DaysSelector from '@/components/medication-week';
import ScreenHeader from '@/components/screen-header';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function MedicationRoutineSetUp() {


    const [name, setName] = useState<string>('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const [month, setMonth] = useState<number>(0);
    const [week, setWeek] = useState<number>(0);
    const [day, setDay] = useState<number>(0);

    const [morning, setMorning] = useState<number>(0);
    const [noon, setNoon] = useState<number>(0);
    const [evening, setEvening] = useState<number>(0);


    const toggleDay = (day: string) => {
        setSelectedDays((currentDays) =>
            currentDays.includes(day)
                ? currentDays.filter((selectedDay) => selectedDay !== day)
                : [...currentDays, day]
        );
    };

    const handleSubmit = () => {
        const payload = {
            name: MedicationName,
            days_frequency: selectedDays,
            months_duration: month,
            weeks_duration: week,
            days_duration: day,
            morning_frequency: morning,
            noon_frequency: noon,
            evening_frequency: evening,

        };

        console.log('Medication routine payload:', payload);
    };

    return (
        <SafeAreaProvider>
            <ScrollView>
                <ScreenHeader title={'Medication'} style={{ borderBottomColor: '#0D5175', borderBottomWidth: 2.5, height: 120 }} />
                <View style={{ paddingHorizontal: 12 }}>
                    <MedicationName value={''} onChangeText={function (text: string): void {
                        throw new Error('Function not implemented.');
                    }} />
                    <DaysSelector selectedDays={[]} onToggleDay={function (day: string): void {
                        throw new Error('Function not implemented.');
                    }} />

                    <View style={{ alignItems: 'center', flexDirection: 'row', maxWidth: 378, paddingTop: 12, paddingBottom: 27 }}>
                        <TreatmentDurationMonth duration={12} text={"month"} setValue={setMonth} value={month} />
                        <TreatmentDurationWeek duration={4} text={"week"} setValue={setWeek} value={week} />
                        <TreatmentDurationDay duration={7} text={"day"} setValue={setDay} value={day} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: 138 }}>
                        <IntakeMorning duration={10} text={'0'} setValue={setMorning} value={morning} />
                        <IntakeNoon duration={10} text={"0"} setValue={setNoon} value={noon} />
                        <IntakeEvening duration={10} text={"0"} setValue={setEvening} value={evening} />
                    </View>
                    <View style={{ maxWidth: 160 }}>
                        <MedicationHours text={'00:00'} setValue={function (value: string): void {
                            throw new Error('Function not implemented.');
                        }} value={''} />
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                        <InstructionList instructions={['']} onChangeInstruction={function (text: string, index: number): void {
                            throw new Error('Function not implemented.');
                        }} onAddInstruction={function (): void {
                            throw new Error('Function not implemented.');
                        }} />
                    </View>
                    <View style={styles.submitContainer}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={handleSubmit}
                            style={styles.submitButton}
                        >
                            <Text style={styles.submitButtonText}>Confirm routine creation</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    submitContainer: {
        marginTop: 24,
        marginBottom: 140
    },
    submitButton: {
        backgroundColor: '#5085A8',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
