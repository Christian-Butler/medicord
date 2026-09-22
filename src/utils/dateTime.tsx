import { getLocales } from 'expo-localization'

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
  const deviceLanguage = getLocales()[0].languageCode;


  if (deviceLanguage == "en") {
    return `${hours}:${minutes}`;
  } else if (deviceLanguage == "fr") {
    return `${hours}h${minutes}`;
  } else {
    return `${hours}:${minutes}`;
  };

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
  const deviceLanguage = getLocales()[0].languageCode;

  if (deviceLanguage == "en") {
    return date.toLocaleDateString("en-GB", {
      month: "long",
    });
  } else if (deviceLanguage == "fr") {
    return date.toLocaleDateString("fr-FR", {
      month: "long",
    });
  } else {
    return date.toLocaleDateString("en-GB", {
      month: "long",
    });
  };
}

export function formatDob(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${String(year).slice(2)}`;
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
  const deviceLanguage = getLocales()[0].languageCode;

  if (deviceLanguage == "en") {
    return new Date(value).toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } else if (deviceLanguage == "fr") {
    return new Date(value).toLocaleDateString("fr-FR", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } else {
    return new Date(value).toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };
}

export function formatAppointmentTime(value: string) {
  const deviceLanguage = getLocales()[0].languageCode;

  if (deviceLanguage == "en") {
    return new Date(value).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (deviceLanguage == "fr") {
    return new Date(value).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return new Date(value).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
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
  const deviceLanguage = getLocales()[0].languageCode;

  let weekday = date.toLocaleDateString("en-GB", {
    weekday: "short",
  });

  let month = date.toLocaleDateString("en-GB", {
    month: "long",
  });

  let day = getOrdinal(date.getDate());

  let timeLabel = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (deviceLanguage == "fr") {
    weekday = date.toLocaleDateString("fr-FR", {
      weekday: "short",
    });

    month = date.toLocaleDateString("fr-FR", {
      month: "long",
    });

    day = date.getDate().toLocaleString();

    timeLabel = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    weekday = date.toLocaleDateString("gb-GB", {
      weekday: "short",
    });

    month = date.toLocaleDateString("gb-GB", {
      month: "long",
    });


    timeLabel = date.toLocaleTimeString("gb-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (deviceLanguage == "en") {
    return `${weekday} ${month} ${day}, ${timeLabel}`;
  } else if (deviceLanguage == "fr") {
    return `${weekday} ${day} ${month}, ${timeLabel}`;
  } else {
    return `${weekday} ${month} ${day}, ${timeLabel}`;
  }

}