import React, { useState } from 'react';
import { ScrollView } from "react-native";

export default function MedicationRoutineSetUp() {


    const [name, setName] = useState<string>('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);


    const handleSubmit = () => {
        const payload = {
            name,
            days_frequency: selectedDays,
        };
    };

    return (
        <ScrollView>


        </ScrollView>
    )
}