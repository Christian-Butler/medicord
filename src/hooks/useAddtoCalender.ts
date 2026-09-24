import * as Calendar from "expo-calendar"
import { useState } from "react"
import { Alert } from "react-native";

export function useAddToCalender() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [added, setAdded] = useState(false);

    async function handleAddToCalender({
        title,
        startDate,
        endDate,
        location,
        notes,
    }: {
        title: string;
        startDate: Date;
        endDate: Date;
        location?: string | null;
        notes?: string | null;
    }) {
        try {
            setLoading(true);
            setError(null);

            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status !== "granted") {
                setError("Calendar permission denied.");
                return;
            }

            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            const defaultCalendar = calendars.find((c) => c.allowsModifications) ?? calendars[0];

            if (!defaultCalendar) {
                setError("No calendar found.");
                return;
            }

            await Calendar.createEventAsync(defaultCalendar.id, {
                title,
                startDate,
                endDate,
                location: location ?? undefined,
                notes: notes ?? undefined,
                alarms: [{ relativeOffset: -60 }],
            });

            setAdded(true);
            Alert.alert(
                "Added to Calendar",
                "Your appointment has been added to your calendar.",
                [{ text: "OK" }]
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add to calendar.");
        } finally {
            setLoading(false);
        }
    }
    return { handleAddToCalender, loading, error, added };
}