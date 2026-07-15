"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { BotanicalSprig, WatercolorWash } from "./AquarelleDecor";

function formatEventDate(value, timeZone) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha por confirmar";

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeZone,
  }).format(date);
}

function formatEventTime(value, timeZone) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Hora por confirmar";

  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(date);
}

export function EventDetails({ weddingDateTime, timeZone }) {
  return (
    <section className="invitation-event-details aquarelle-section" aria-labelledby="event-details-title">
      <WatercolorWash className="aquarelle-section__wash aquarelle-section__wash--event" tone="gold" />
      <BotanicalSprig className="aquarelle-section__sprig aquarelle-section__sprig--event" />
      <header className="aquarelle-section__heading">
        <p className="invitation-section__eyebrow">El gran día</p>
        <h2 id="event-details-title" className="invitation-section__title">Ceremonia Civil</h2>
      </header>

      <div className="invitation-event-details__card aquarelle-card">
        <div className="invitation-event-details__row">
          <span className="invitation-event-details__icon" aria-hidden="true">
            <CalendarDays size={22} />
          </span>
          <div>
            <span className="invitation-event-details__label">Fecha</span>
            <p className="invitation-event-details__value">{formatEventDate(weddingDateTime, timeZone)}</p>
          </div>
        </div>
        <div className="invitation-event-details__divider" aria-hidden="true" />
        <div className="invitation-event-details__row">
          <span className="invitation-event-details__icon" aria-hidden="true">
            <Clock3 size={22} />
          </span>
          <div>
            <span className="invitation-event-details__label">Hora</span>
            <p className="invitation-event-details__value">{formatEventTime(weddingDateTime, timeZone)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
