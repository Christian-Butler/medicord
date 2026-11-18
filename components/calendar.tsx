import { Colors, Sizes } from '@/constants/theme';
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
    viewMonth?: string;
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

const Iso = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getFirstWeekDate = (month: string) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const date = new Date(year, monthNumber - 1, 1);
    const today = new Date();

    if (year === today.getFullYear() && monthNumber === today.getMonth() + 1) {
        date.setDate(today.getDate());
    }

    if (date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
    }
    return date;
};

const getInitialDate = (selectedDate?: string) => {
    const date = selectedDate
        ? new Date(`${selectedDate}T00:00:00`)
        : new Date();
    if (!selectedDate && date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
    }
    return date;
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
            dateName = date.toLocaleDateString("en-GB", { weekday: 'narrow' })
        } else if (deviceLanguage == "fr") {
            dateName = date.toLocaleDateString("fr-FR", { weekday: 'narrow' })
        } else {
            dateName = date.toLocaleDateString("en-GB", { weekday: 'narrow' })
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
    viewMonth,
}: WeeklyCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(() =>
        viewMonth ? getFirstWeekDate(viewMonth) : getInitialDate(selectedDate)
    );

    const [selectedDayIso, setSelectedDayIso] = useState<string | null>(
        selectedDate ?? null
    );

    useEffect(() => {
        if (selectedDate) {
            setSelectedDayIso(selectedDate);
            setCurrentDate(new Date(`${selectedDate}T00:00:00`));
        } else {
            setSelectedDayIso(null);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (!viewMonth) return;
        if (selectedDate?.slice(0, 7) === viewMonth) return;
        setCurrentDate(getFirstWeekDate(viewMonth));
    }, [selectedDate, viewMonth]);

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
                >
                    <Text style={styles.navText}>‹</Text>
                </Pressable>
                <Text style={styles.currentDate}>{currentLabel}</Text>

                <Pressable
                    onPress={() => goToWeek(7)}
                    style={styles.navButton}
                >
                    <Text style={styles.navText}>›</Text>
                </Pressable>
            </View>
            <View style={styles.weekRow}>
                {weekDays.map((dayItem) => {
                    const isSelected = selectedDayIso === dayItem.iso;

                    return (
                        <Pressable
                            key={dayItem.iso}
                            disabled={dayItem.isPast}
                            onPress={() => {
                                setSelectedDayIso(dayItem.iso);
                                onSelectDate?.(dayItem.iso);
                            }}
                            style={[
                                styles.dayCell,
                                dayItem.isPast && styles.inactiveCell,
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
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Sizes.p3,
    },
    navButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    navText: {
        fontSize: Sizes.h4,
        fontWeight: '500',
        color: Colors.text,
    },
    currentDate: {
        fontSize: Sizes.paragraph,
        fontWeight: '500',
        color: Colors.text,
    },
    weekRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dayLabel: {
        textAlign: 'center',
        fontSize: Sizes.sm,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 4,
    },
    dayCell: {
        flex: 1,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayText: {
        color: Colors.error,
    },
    selectedCell: {
        color: Colors.text,
    },
    inactiveCell: {
        opacity: 0.5
    },
    dayNumber: {
        fontSize: Sizes.h5,
        width: 28,
        height: 28,
        textAlign: 'center',
        paddingTop: 3,
        color: Colors.text,
        fontWeight: '500',
    },
    selectedDayText: {
        color: Colors.text,
    },
    selectedDayNumber: {
        color: Colors.bg2,
        backgroundColor: Colors.secondary,
        borderRadius: Sizes.IconXL,
    },
    inactiveText: {
        color: Colors.text,
    },
});

export default WeeklyCalendar;