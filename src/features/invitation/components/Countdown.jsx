"use client";

import { useCountdown } from "../../../hooks/useCountdown";
import { WatercolorWash } from "./AquarelleDecor";

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
        <WatercolorWash className="invitation-countdown__wash" tone="gold" />
        <p className="invitation-section__eyebrow">Llegó el momento</p>
        <h2 className="invitation-countdown__complete-title">Hoy es el gran día</h2>
        <p className="invitation-countdown__complete-copy">Gracias por celebrar este instante con nosotros.</p>
      </section>
    );
  }

  const accessibleLabel = `${countdown.days} días, ${countdown.hours} horas, ${countdown.minutes} minutos y ${countdown.seconds} segundos para la boda`;

  return (
    <section className="invitation-countdown aquarelle-section" aria-labelledby="countdown-title">
      <WatercolorWash className="invitation-countdown__wash invitation-countdown__wash--silver" tone="silver" />
      <p className="invitation-countdown__kicker">Nos vemos en…</p>
      <h2 id="countdown-title" className="invitation-countdown__heading">Cada vez falta menos</h2>
      <div className="invitation-countdown__grid" role="timer" aria-label={accessibleLabel}>
        {COUNTDOWN_UNITS.map(([key, label], index) => (
          <div className="invitation-countdown__fragment" key={key}>
            <div className="invitation-countdown__unit">
              <span className="invitation-countdown__value" aria-hidden="true">
                {formatUnit(countdown[key])}
              </span>
              <span className="invitation-countdown__label" aria-hidden="true">{label}</span>
            </div>
            {index < COUNTDOWN_UNITS.length - 1 ? (
              <span className="invitation-countdown__separator" aria-hidden="true">:</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
