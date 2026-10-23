import AsyncStorage from "@react-native-async-storage/async-storage";

// Calendar event and notification IDs only exist on this phone, so they're kept on the phone, not in Supabase.
export type LinkKind = "appointment" | "medication" | "medication-alarm";

export type CalendarLink = {
  eventId: string | null;
  eventIds?: string[];
  notificationIds: string[];
};

function keyFor(kind: LinkKind, id: string | number) {
  return `medicord:calendar-link:${kind}:${id}`;
}

export async function getCalendarLink(kind: LinkKind, id: string | number): Promise<CalendarLink | null> {
  try {
    const value = await AsyncStorage.getItem(keyFor(kind, id));
    return value ? (JSON.parse(value) as CalendarLink) : null;
  } catch {
    return null;
  }
}

export async function saveCalendarLink(kind: LinkKind, id: string | number, link: CalendarLink): Promise<void> {
  await AsyncStorage.setItem(keyFor(kind, id), JSON.stringify(link));
}

export async function removeCalendarLink(kind: LinkKind, id: string | number): Promise<void> {
  await AsyncStorage.removeItem(keyFor(kind, id));
}