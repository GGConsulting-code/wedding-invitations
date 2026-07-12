"use client";

import { CalendarDays, Clock3 } from "lucide-react";

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
    timeZoneName: "short",
  }).format(date);
}

export function EventDetails({ weddingDateTime, timeZone }) {
  return (
    <section className="invitation-event-details" aria-labelledby="event-details-title">
      <p className="invitation-section__eyebrow">Aparta la fecha</p>
      <h2 id="event-details-title" className="invitation-section__title">Cuándo celebraremos</h2>
      <div className="invitation-event-details__card">
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
