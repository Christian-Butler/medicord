import TreatmentDuration from '@/components/medication-duration';
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
            <TreatmentDuration duration={12} text={"month"} setValue={setMonth} value={month} />

        </ScrollView>
    )
}