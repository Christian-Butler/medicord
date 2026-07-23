import TreatmentDuration from '@/components/medication-duration-months';
import IntakeEvening from '@/components/medication-evening-intake';
import MedicationHours from '@/components/medication-hours';
import InstructionList from '@/components/medication-instructions';
import IntakeMorning from '@/components/medication-morning-intake';
import MedicationName from '@/components/medication-name';
import IntakeNoon from '@/components/medication-noon-intake';
import DaysSelector from '@/components/medication-week';
import ScreenHeader from '@/components/screen-header';
import { supabase } from '@/supabase/supabase';
import { Pill } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Instruction = {
    id: string;
    text: string;
};

const createInstruction = (): Instruction => ({
    id: `instruction-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: '',
});

export default function MedicationRoutineSetUp() {

    const [medicationName, setMedicationName] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [noSpecificTime, setNoSpecificTime] = useState(false);

    const [month, setMonth] = useState<number>(0);
    const [week, setWeek] = useState<number>(0);
    const [day, setDay] = useState<number>(0);

    const [morning, setMorning] = useState<number>(0);
    const [noon, setNoon] = useState<number>(0);
    const [evening, setEvening] = useState<number>(0);

    const [hours, setHours] = useState('00:00');
    const [instructions, setInstructions] = useState<Instruction[]>([createInstruction()]);
    const [loading, setLoading] = useState(false);

    const toggleDay = (day: string) => {
        setSelectedDays((currentDays) =>
            currentDays.includes(day)
                ? currentDays.filter((currentDay) => currentDay !== day)
                : [...currentDays, day]
        );
    };

    const handleInstructionChange = (text: string, id: string) => {
        setInstructions((current) => current.map((item) => (item.id === id ? { ...item, text } : item)))
    };

    const handleAddInstruction = () => {
        setInstructions((current) => [...current, createInstruction()]);
    };

    const handleRemoveInstruction = (id: string) => {
        setInstructions((current) => current.filter((item) => item.id !== id)
        );
    };

    const handleSubmit = async () => {
        if (!medicationName.trim()) {
            Alert.alert('Please name your medication routine');
            return;
        }
        setLoading(true);

        const readyInstructions = instructions.map((inst) => inst.text.trim()).filter((text) => text.length > 0);

        const payload = {
            name: medicationName,
            days_frequency: selectedDays,
            months_duration: month,
            weeks_duration: week,
            days_duration: day,
            morning_frequency: morning,
            noon_frequency: noon,
            evening_frequency: evening,
            no_specific_time: noSpecificTime,
            no_specific_hour: false,
            hours,
            instructions: readyInstructions,
        };

        try {
            const { data, error } = await supabase.from('medication').insert([payload]).select();
            if (error) throw error;
            Alert.alert('Success', 'Medication routine created successfully!');
            console.log('Created record:', data);
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to create routine.');
            console.error('Supabase error:', err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaProvider>
            <ScrollView>
                <ScreenHeader title={'Create routine'} style={{ borderBottomColor: '#0D5175', borderBottomWidth: 2.5, height: 120 }} />

                <View style={{ paddingHorizontal: 14 }} className='bg-[#EEF9FB]'>

                    <View style={{ marginTop: 27 }}>
                        <Pill size={48} style={{ borderColor: '#0D5175', alignSelf: 'center', marginBottom: 12 }}></Pill>
                        <Text style={{ fontSize: 20, fontWeight: '500', alignSelf: 'center' }}>Medication details</Text>
                    </View>

                    <MedicationName value={medicationName} onChangeText={setMedicationName} />

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontWeight: 500, fontSize: 20 }}>Duration</Text>

                        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', marginBottom: 20 }}>

                            <TreatmentDuration duration={12} text={"Month(s)"} setValue={setMonth} value={month} />
                            <TreatmentDuration duration={4} text={"Week(s)"} setValue={setWeek} value={week} />
                            <TreatmentDuration duration={7} text={"Day(s)"} setValue={setDay} value={day} />
                        </View>

                        <View style={{ marginTop: 12 }}>
                            <DaysSelector selectedDays={selectedDays} onToggleDay={toggleDay} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20 }}>
                        <Pressable onPress={() => setNoSpecificTime((current) => !current)}>
                            <View style={[styles.checkboxBox, noSpecificTime && styles.checkboxBoxChecked]}>
                                {noSpecificTime ? <Text style={styles.checkmark}>✓</Text> : null}
                            </View>
                        </Pressable>
                        <Text style={{ color: '#26282b', fontSize: 16, }}>No specific time.</Text>
                    </View>

                    {!noSpecificTime ? (
                        <View style={{ flexDirection: 'row', marginTop: 2, justifyContent: 'space-between', marginBottom: 20 }}>
                            <IntakeMorning duration={10} text={'Morning intake'} setValue={setMorning} value={morning} />
                            <IntakeNoon duration={10} text={'Noon intake'} setValue={setNoon} value={noon} />
                            <IntakeEvening duration={10} text={'Evening Intake'} setValue={setEvening} value={evening} />
                        </View>
                    ) : null}

                    <View style={{ maxWidth: 160 }}>
                        <MedicationHours text={'00:00'} setValue={setHours} value={hours} />
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                        <InstructionList
                            instructions={instructions}
                            onChangeInstruction={handleInstructionChange}
                            onAddInstruction={handleAddInstruction}
                            onRemoveInstruction={handleRemoveInstruction}
                        />
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
    );

};
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
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    checkboxBox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.2,
        borderColor: '#161819',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    checkboxBoxChecked: {
        backgroundColor: '#5085A8',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '400',
    },
    checkboxLabel: {
        color: '#26282b',
        fontSize: 16,
    },
});

function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
