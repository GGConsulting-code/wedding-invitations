"use client";

import { useState } from "react";
import { CalendarPlus, Check } from "lucide-react";
import { createCalendarFile } from "../calendarIcs";

export function AddToCalendarButton({ event }) {
  const [saved, setSaved] = useState(false);

  const handleAddToCalendar = () => {
    const calendarFile = createCalendarFile(event);
    if (!calendarFile) return;

    const blob = new Blob([calendarFile], { type: "text/calendar;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = objectUrl;
    downloadLink.download = "nuestra-boda.ics";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    setSaved(true);
  };

  return (
    <button
      type="button"
      className="invitation-action invitation-action--calendar"
      onClick={handleAddToCalendar}
    >
      {saved ? <Check size={18} aria-hidden="true" /> : <CalendarPlus size={18} aria-hidden="true" />}
      {saved ? "Guardado" : "Agregar al calendario"}
    </button>
  );
}
