"use client";

import { useCountdown } from "../../../hooks/useCountdown";

const COUNTDOWN_UNITS = [
  ["days", "Días"],
  ["hours", "Horas"],
  ["minutes", "Minutos"],
  ["seconds", "Segundos"],
];

function formatUnit(value) {
  return String(value).padStart(2, "0");
}

export function Countdown({ weddingDateTime }) {
  const countdown = useCountdown(weddingDateTime);

  if (countdown.isComplete) {
    return (
      <section className="invitation-countdown invitation-countdown--complete" aria-live="polite">
        <p className="invitation-section__eyebrow">Llegó el momento</p>
        <h2 className="invitation-countdown__complete-title">Hoy es el gran día</h2>
        <p className="invitation-countdown__complete-copy">Gracias por celebrar este instante con nosotros.</p>
      </section>
    );
  }

  const accessibleLabel = `${countdown.days} días, ${countdown.hours} horas, ${countdown.minutes} minutos y ${countdown.seconds} segundos para la boda`;

  return (
    <section className="invitation-countdown" aria-labelledby="countdown-title">
      <p className="invitation-section__eyebrow">Faltan</p>
      <h2 id="countdown-title" className="invitation-section__title">Para nuestro gran día</h2>
      <div className="invitation-countdown__grid" role="timer" aria-label={accessibleLabel}>
        {COUNTDOWN_UNITS.map(([key, label]) => (
          <div className="invitation-countdown__unit" key={key}>
            <span className="invitation-countdown__value" aria-hidden="true">
              {formatUnit(countdown[key])}
            </span>
            <span className="invitation-countdown__label" aria-hidden="true">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
