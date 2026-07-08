import { supabase } from "@/supabase/supabase";
import {
  buildLocalIsoDateTime,
  formatSlotLabel,
  toLocalIsoDate,
} from "@/src/utils/dateTime";

export type AvailableSlot = {
  doctorId: string;
  date: string;
  time: string;
  startsAt: string;
  label: string;
};

const SLOT_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
];








function isSameSlot(slotStartsAt: string, bookedStartsAt: string) {
  return new Date(slotStartsAt).getTime() === new Date(bookedStartsAt).getTime();
}

export async function getClosestAvailableSlotForDoctor(
  doctorId: string,
  daysAhead = 14
): Promise<AvailableSlot | null> {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + daysAhead);

  const { data, error } = await supabase
    .from("appointments")
    .select("id, doctor_id, starts_at, ends_at, status")
    .eq("doctor_id", doctorId)
    .neq("status", "cancelled")
    .gte("starts_at", now.toISOString())
    .lte("starts_at", endDate.toISOString())
    .order("starts_at", { ascending: true });

  if (error) throw error;

  const bookedAppointments = data ?? [];

  for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset += 1) {
    const date = new Date();
    date.setDate(now.getDate() + dayOffset);

    const dateValue = toLocalIsoDate(date.toISOString());

    for (const timeValue of SLOT_TIMES) {
      const startsAt = buildLocalIsoDateTime(dateValue, timeValue);

      if (new Date(startsAt).getTime() <= now.getTime()) {
        continue;
      }

      const isBooked = bookedAppointments.some((appointment) =>
        isSameSlot(startsAt, appointment.starts_at)
      );

      if (!isBooked) {
        return {
          doctorId,
          date: dateValue,
          time: timeValue,
          startsAt,
          label: formatSlotLabel(startsAt),
        };
      }
    }
  }

  return null;
}

export async function getClosestAvailableSlotsForDoctors(
  doctorIds: string[],
  daysAhead = 14
): Promise<Record<string, AvailableSlot | null>> {
  if (doctorIds.length === 0) return {};

  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + daysAhead);

  const { data, error } = await supabase
    .from("appointments")
    .select("id, doctor_id, starts_at, ends_at, status")
    .in("doctor_id", doctorIds)
    .neq("status", "cancelled")
    .gte("starts_at", now.toISOString())
    .lte("starts_at", endDate.toISOString())
    .order("starts_at", { ascending: true });

  if (error) throw error;

  const bookedAppointments = data ?? [];

  const result: Record<string, AvailableSlot | null> = {};

  for (const doctorId of doctorIds) {
    result[doctorId] = null;

    const doctorBookedAppointments = bookedAppointments.filter(
      (appointment) => appointment.doctor_id === doctorId
    );

    for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset += 1) {
      const date = new Date();
      date.setDate(now.getDate() + dayOffset);

      const dateValue = toLocalIsoDate(date.toISOString());

      for (const timeValue of SLOT_TIMES) {
        const startsAt = buildLocalIsoDateTime(dateValue, timeValue);

        if (new Date(startsAt).getTime() <= now.getTime()) {
          continue;
        }

        const isBooked = doctorBookedAppointments.some((appointment) =>
          isSameSlot(startsAt, appointment.starts_at)
        );

        if (!isBooked) {
          result[doctorId] = {
            doctorId,
            date: dateValue,
            time: timeValue,
            startsAt,
            label: formatSlotLabel(startsAt),
          };

          break;
        }
      }

      if (result[doctorId]) break;
    }
  }

  return result;
}