"use client";

import { CalendarDays, Clock3 } from "lucide-react";

function getEventDateParts(value, timeZone) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "Por confirmar",
      year: "",
      weekday: "Fecha pendiente",
      fullDate: "Fecha por confirmar",
      time: "Hora por confirmar",
    };
  }

  return {
    day: new Intl.DateTimeFormat("es-MX", { day: "2-digit", timeZone }).format(date),
    month: new Intl.DateTimeFormat("es-MX", { month: "long", timeZone }).format(date),
    year: new Intl.DateTimeFormat("es-MX", { year: "numeric", timeZone }).format(date),
    weekday: new Intl.DateTimeFormat("es-MX", { weekday: "long", timeZone }).format(date),
    fullDate: new Intl.DateTimeFormat("es-MX", { dateStyle: "full", timeZone }).format(date),
    time: new Intl.DateTimeFormat("es-MX", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
      timeZoneName: "short",
    }).format(date),
  };
}

export function EventDetails({ weddingDateTime, timeZone }) {
  const date = getEventDateParts(weddingDateTime, timeZone);

  return (
    <section className="invitation-event-details" aria-labelledby="event-details-title">
      <p className="invitation-section__eyebrow">Join us on</p>
      <h2 id="event-details-title" className="invitation-section__title">Aparta la fecha</h2>

      <div className="invitation-event-details__editorial-card">
        <div className="invitation-event-details__calendar" aria-hidden="true">
          <span className="invitation-event-details__month">{date.month}</span>
          <span className="invitation-event-details__day">{date.day}</span>
          <span className="invitation-event-details__year">{date.year}</span>
        </div>

        <div className="invitation-event-details__information">
          <p className="invitation-event-details__weekday">{date.weekday}</p>
          <p className="invitation-event-details__full-date">
            <CalendarDays size={18} aria-hidden="true" />
            {date.fullDate}
          </p>
          <p className="invitation-event-details__time">
            <Clock3 size={18} aria-hidden="true" />
            {date.time}
          </p>
          <p className="invitation-event-details__note">
            Será un honor compartir contigo el inicio de esta nueva etapa.
          </p>
        </div>
      </div>
    </section>
  );
}
