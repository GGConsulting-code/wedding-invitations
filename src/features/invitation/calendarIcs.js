function escapeCalendarText(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatIcsDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function createCalendarFile({
  coupleDisplayName,
  weddingDateTime,
  address,
  presentationText,
}) {
  const startsAt = formatIcsDate(weddingDateTime);
  if (!startsAt) return null;

  const uidSeed = new Date(weddingDateTime).getTime();
  const location = [address?.venueName, address?.formattedAddress]
    .filter(Boolean)
    .join(", ");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitaciones de Boda//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:boda-${uidSeed}@invitacion.local`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${startsAt}`,
    `SUMMARY:${escapeCalendarText(`Boda de ${coupleDisplayName}`)}`,
    `DESCRIPTION:${escapeCalendarText(presentationText)}`,
    `LOCATION:${escapeCalendarText(location)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export { escapeCalendarText, formatIcsDate };
