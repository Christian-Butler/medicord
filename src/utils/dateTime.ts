export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toLocalIsoDate(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
}

export function toLocalTimeValue(value: string) {
  const date = new Date(value);
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${hours}:${minutes}`;
}

export function buildLocalIsoDateTime(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
    0
  ).toISOString();
}

export function getMonthLabel(dateValue: string | null) {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();

  return date.toLocaleDateString("en-GB", {
    month: "long",
  });
}

export function formatAppointmentDateTime(startsAt: string) {
  const date = new Date(startsAt);

  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  const timePart = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("AM", "am")
    .replace("PM", "pm");

  return `${datePart} - ${timePart}`;
}

export function formatAppointmentDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatAppointmentTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getOrdinal(day: number) {
  if (day > 3 && day < 21) return `${day}th`;

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export function formatSlotLabel(startsAt: string) {
  const date = new Date(startsAt);

  const weekday = date.toLocaleDateString("en-GB", {
    weekday: "short",
  });

  const month = date.toLocaleDateString("en-GB", {
    month: "long",
  });

  const day = getOrdinal(date.getDate());

  const timeLabel = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${weekday} ${month} ${day}, ${timeLabel}`;
}