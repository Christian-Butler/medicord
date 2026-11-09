import { Buttons, Colors, Sizes } from "@/constants/theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DaysSelectorProps {
    selectedDays: string[];
    onToggleDay: (day: string) => void;
}

export default function DaysSelector({ selectedDays, onToggleDay }: DaysSelectorProps) {
    const { t } = useTranslation();

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <View>
            <Text style={styles.label}>{t("medication-form.daysOfWeek")}</Text>
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
                            {t(`medication-container.${day}`)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: Sizes.h4,
        marginBottom: Sizes.p3,
        fontWeight: '500'
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: Sizes.p2,
        marginBottom: Sizes.h2,
    },
    dayButton: {
        height: Sizes.IconLg,
        width: Sizes.IconLg,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.p2,
        backgroundColor: Colors.bg2,
        borderWidth: Buttons.w1,
        borderColor: Colors.primary
    },
    dayButtonSelected: {
        backgroundColor: Colors.primary
    },
    textLight: {
        color: Colors.bg2,
        fontWeight: 'medium'
    },
    text: {
        color: Colors.primary,
        fontWeight: '500',
    },
})