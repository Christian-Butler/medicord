import AsyncStorage from "@react-native-async-storage/async-storage";

// What this phone created for one appointment or medication:
// the iOS Calendar event and the reminder notifications.
export type CalendarLink = {
    eventId: string | null;
    eventIds?: string[];
  notificationIds: string[];
};

export type LinkKind = "appointment" | "medication" | "medication-alarm";

function storageKey(kind: LinkKind, id: string | number) {
  return `medicord:calendar-link:${kind}:${id}`;
}

export async function getCalendarLink(kind: LinkKind, id: string | number): Promise<CalendarLink | null> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(kind, id));
    return raw ? (JSON.parse(raw) as CalendarLink) : null;
  } catch {
    return null;
  }
}

export async function saveCalendarLink(kind: LinkKind, id: string | number, link: CalendarLink): Promise<void> {
  await AsyncStorage.setItem(storageKey(kind, id), JSON.stringify(link));
}

export async function removeCalendarLink(kind: LinkKind, id: string | number): Promise<void> {
  await AsyncStorage.removeItem(storageKey(kind, id));
}