import TreatmentDurationDay from '@/components/medication-duration-days';
import TreatmentDurationMonth from '@/components/medication-duration-months';
import TreatmentDurationWeek from '@/components/medication-duration-weeks';
import IntakeEvening from '@/components/medication-evening-intake';
import IntakeMorning from '@/components/medication-morning-intake';
import IntakeNoon from '@/components/medication-noon-intake';
import DaysSelector from '@/components/medication-week';
import React, { useState } from 'react';
import { ScrollView } from "react-native";

export default function MedicationRoutineSetUp() {


    const [name, setName] = useState<string>('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const [month, setMonth] = useState<number>(0);
    const [week, setWeek] = useState<number>(0);
    const [day, setDay] = useState<number>(0);

    const [morning, setMorning] = useState<number>(0);
    const [noon, setNoon] = useState<number>(0);
    const [evening, setEvening] = useState<number>(0);


    const handleSubmit = () => {
        const payload = {
            name,
            days_frequency: selectedDays,
        };
    };

    return (
        <ScrollView>
            <DaysSelector selectedDays={[]} onToggleDay={function (day: string): void {
                throw new Error('Function not implemented.');
            }} />
            <TreatmentDurationMonth duration={12} text={"month"} setValue={setMonth} value={month} />
            <TreatmentDurationWeek duration={4} text={"week"} setValue={setWeek} value={week} />
            <TreatmentDurationDay duration={7} text={"day"} setValue={setDay} value={day} />

            <IntakeMorning duration={10} text={"morning"} setValue={setMorning} value={morning} />
            <IntakeNoon duration={10} text={"noon"} setValue={setNoon} value={noon} />
            <IntakeEvening duration={10} text={"evening"} setValue={setEvening} value={evening} />
        </ScrollView>
    )
}