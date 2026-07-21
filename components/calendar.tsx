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
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        date.setHours(0, 0, 0, 0);

        return {
            date,
            dateName: date.toLocaleDateString("en-EN", { weekday: 'short' }),
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

        return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${months[endOfWeek.getMonth()]
            } ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
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
                            onPress={() => setSelectedDayIso(dayItem.iso)}
                            style={[
                                styles.dayCell,
                                dayItem.isToday && styles.todayCell,
                                dayItem.isPast && styles.inactiveCell,
                                isSelected && styles.selectedCell,
                            ]}
                        >

                            <Text
                                style={[
                                    styles.dayNumber,
                                    isSelected && styles.selectedDayText,
                                    dayItem.isPast && styles.inactiveText,
                                ]}
                            >
                                {dayItem.day}
                            </Text>
                            <Text style={[styles.dayLabel,
                            dayItem.isPast && styles.inactiveText]
                            }>{dayItem.dateName}</Text>

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
        marginRight: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: '#f3f6f8',
    },
    navText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#0',
    },
    currentDate: {
        fontSize: 16,
        fontWeight: '500',
        color: '#00',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dayLabelContainer: {
        flex: 1,
        alignItems: 'center',
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: 500,
        color: '#fff',
        paddingBottom: 2,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: 360,
    },
    dayCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        paddingVertical: 14,
        borderRadius: 14,
        color: '#fff',
        backgroundColor: '#326F95',
    },
    todayCell: {
        color: '#fff',
        backgroundColor: '#326F95',
    },
    selectedCell: {
        color: '#fff',
        backgroundColor: '#0D5175',
    },
    inactiveCell: {
        opacity: 0.45,
    },
    dayNumber: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: '500',
        color: '#fff',
    },
    selectedDayText: {
        color: '#fff',
    },
    inactiveText: {
        color: '#b4cedb',
    },
});

export default WeeklyCalendar;