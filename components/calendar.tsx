import { getLocales } from 'expo-localization';
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface DayItem {
    date: Date;
    dateName: string;
    day: number;
    iso: string;
    isToday: boolean;
    isPast: boolean;
}

type WeeklyCalendarProps = {
    selectedDate?: string;
    onSelectDate?: (date: string) => void;
};

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const deviceLanguage = getLocales()[0].languageCode;

const Iso = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const isSameDay = (first: Date, second: Date) =>
    first.toDateString() === second.toDateString();

const getWeekDays = (baseDate: Date): DayItem[] => {
    const startOfWeek = new Date(baseDate);
    const daysSinceMonday = (baseDate.getDay() + 6) % 7;
    startOfWeek.setDate(baseDate.getDate() - daysSinceMonday);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        date.setHours(0, 0, 0, 0);
        let dateName;
        if (deviceLanguage == "en") {
            dateName = date.toLocaleDateString("en-EN", { weekday: 'narrow' })
        } else if (deviceLanguage == "fr") {
            dateName = date.toLocaleDateString("fr-FR", { weekday: 'narrow' })
        } else {
            dateName = date.toLocaleDateString("en-EN", { weekday: 'narrow' })
        };
        return {
            date,
            dateName,
            day: date.getDate(),
            iso: Iso(date),
            isToday: isSameDay(date, new Date()),
            isPast: date < today,
        };
    });
};

const WeeklyCalendar = ({
    selectedDate,
    onSelectDate,
}: WeeklyCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(() =>
        selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date()
    );

    const [selectedDayIso, setSelectedDayIso] = useState<string | null>(
        selectedDate ?? null
    );

    useEffect(() => {
        if (!selectedDate) return;

        setSelectedDayIso(selectedDate);
        setCurrentDate(new Date(`${selectedDate}T00:00:00`));
    }, [selectedDate]);

    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

    const startOfWeek = weekDays[0]?.date;
    const endOfWeek = weekDays[weekDays.length - 1]?.date;

    const currentLabel = useMemo(() => {
        if (!startOfWeek || !endOfWeek) {
            return "";
        }
        if (deviceLanguage == "en") {
            return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${months[endOfWeek.getMonth()]
                } ${endOfWeek.getDate()} ${endOfWeek.getFullYear()}`;
        } else if (deviceLanguage == "fr") {
            return `${startOfWeek.getDate()} ${mois[startOfWeek.getMonth()]}  - ${endOfWeek.getDate()} ${mois[endOfWeek.getMonth()]
                } ${endOfWeek.getFullYear()}`;
        } else {
            return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${months[endOfWeek.getMonth()]
                } ${endOfWeek.getDate()} ${endOfWeek.getFullYear()}`;
        }
    }, [startOfWeek, endOfWeek]);

    const goToWeek = (delta: number) => {
        setCurrentDate((prev) => {
            const next = new Date(prev);
            next.setDate(prev.getDate() + delta);
            return next;
        });

        setSelectedDayIso(null);
    };

    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => goToWeek(-7)}
                    style={styles.navButton}
                    accessibilityRole="button"
                >
                    <Text style={styles.navText}>‹</Text>
                </Pressable>
                <Text style={styles.currentDate}>{currentLabel}</Text>

                <Pressable
                    onPress={() => goToWeek(7)}
                    style={styles.navButton}
                    accessibilityRole="button"
                >
                    <Text style={styles.navText}>›</Text>
                </Pressable>
            </View>
            <View style={styles.weekRow}>
                {weekDays.map((label) => (
                    <View key={label.day} style={styles.dayLabelContainer}>
                    </View>
                ))}
            </View>
            <View style={styles.daysRow}>
                {weekDays.map((dayItem) => {
                    const isSelected = selectedDayIso === dayItem.iso;

                    return (
                        <Pressable
                            key={dayItem.iso}
                            accessibilityRole="button"
                            disabled={dayItem.isPast}
                            onPress={() => {
                                setSelectedDayIso(dayItem.iso);
                                onSelectDate?.(dayItem.iso);
                            }}
                            style={[
                                styles.dayCell,
                                dayItem.isPast && styles.inactiveCell,
                                isSelected && styles.selectedCell,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dayLabel,
                                    dayItem.isPast && styles.inactiveText,
                                    isSelected && styles.selectedDayText,
                                ]}
                            >
                                {dayItem.dateName}
                            </Text>
                            <Text
                                style={[
                                    styles.dayNumber,
                                    dayItem.isToday && styles.todayText,
                                    isSelected && styles.selectedDayNumber,
                                    dayItem.isPast && styles.inactiveText,
                                ]}
                            >
                                {dayItem.day}
                            </Text>

                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    navButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: '#EFF7F8',
    },
    navText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#0',
    },
    currentDate: {
        fontSize: 16,
        fontWeight: '500',
        color: '#00',
    },
    weekRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dayLabelContainer: {
        alignItems: 'center',
    },
    dayLabel: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 500,
        color: '#1A1A1A',
        marginBottom: 8,
    },
    daysRow: {
        alignItems: 'center',
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    dayCell: {
        flex: 1,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayText: {
        borderRadius: '100%',
        color: 'white',
        backgroundColor: "#0D5175"
    },
    selectedCell: {
        color: 'white',
        backgroundColor: "#0D5175",
        borderRadius: 16,
        paddingVertical: 4,
    },
    inactiveCell: {
        opacity: 0.5
    },
    dayNumber: {
        fontSize: 20,
        width: 28,
        height: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
        color: 'black',
        fontWeight: '500',
    },
    selectedDayText: {
        color: 'white',
    },
    selectedDayNumber: {
        color: '#0D5175',
        backgroundColor: 'white',
        borderRadius: '100%',
    },
    inactiveText: {
        color: '#1A1A1A',
    },
});

export default WeeklyCalendar;