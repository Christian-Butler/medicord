import TreatmentDurationDay from '@/components/medication-duration-days';
import TreatmentDurationMonth from '@/components/medication-duration-months';
import TreatmentDurationWeek from '@/components/medication-duration-weeks';
import React, { useState } from 'react';
import { ScrollView } from "react-native";

export default function MedicationRoutineSetUp() {


    const [name, setName] = useState<string>('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [month, setMonth] = useState<number>(0);

    const handleSubmit = () => {
        const payload = {
            name,
            days_frequency: selectedDays,
        };
    };

    return (
        <ScrollView>
            <TreatmentDurationMonth duration={12} text={"month"} setValue={setMonth} value={month} />
            <TreatmentDurationWeek duration={4} text={"week"} setValue={setWeek} value={week} />
            <TreatmentDurationDay duration={7} text={"day"} setValue={setDay} value={day} />

        </ScrollView>
    )
}