export function buildAppointmentDateTimes(
  selectedDate: string,
  selectedTime: string,
  durationMinutes = 30
) {
  const startsAt = new Date(`${selectedDate}T${selectedTime}`);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000);

  return {
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
  };
}