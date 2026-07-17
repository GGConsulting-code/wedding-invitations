"use client";

import { motion } from "motion/react";
import { ImageOff } from "lucide-react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";
import { BotanicalSprig } from "./AquarelleDecor";

function formatHeroDate(value, timeZone) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha por confirmar";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(date);
}

function splitCoupleNames(value) {
  const parts = value?.split(/\s*&\s*/).filter(Boolean) ?? [];
  if (parts.length === 2) return parts;
  return [value || "Nuestra", "Boda"];
}

export function InvitationHero({
  coupleDisplayName,
  heroPhoto,
  weddingDateTime,
  timeZone,
}) {
  const prefersReducedMotion = useReducedMotionPreference();
  const displayDate = formatHeroDate(weddingDateTime, timeZone);
  const heroImageUrl = heroPhoto?.url?.trim();
  const [firstName, secondName] = splitCoupleNames(coupleDisplayName);

  return (
    <header className="aquarelle-hero aquarelle-hero--mockup">
      <motion.figure
        className="aquarelle-hero__mockup-stage"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {heroImageUrl ? (
          <motion.img
            src={heroImageUrl}
            alt={heroPhoto?.altText || `Fotografía de ${coupleDisplayName}`}
            className="aquarelle-hero__mockup-image"
            loading="eager"
            decoding="async"
            initial={prefersReducedMotion ? false : { scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div
            className="aquarelle-hero__mockup-placeholder"
            role="img"
            aria-label="Fotografía principal por agregar"
          >
            <ImageOff size={34} aria-hidden="true" />
            <span>Agrega la fotografía principal</span>
          </div>
        )}

        <span className="aquarelle-hero__mockup-vignette" aria-hidden="true" />
        <span className="aquarelle-hero__mockup-pill-shadow" aria-hidden="true" />

        <BotanicalSprig className="aquarelle-hero__mockup-botanical aquarelle-hero__mockup-botanical--top-left" />
        <BotanicalSprig className="aquarelle-hero__mockup-botanical aquarelle-hero__mockup-botanical--top-right" mirrored />
        <BotanicalSprig className="aquarelle-hero__mockup-botanical aquarelle-hero__mockup-botanical--bottom-left" />
        <BotanicalSprig className="aquarelle-hero__mockup-botanical aquarelle-hero__mockup-botanical--bottom-right" mirrored />
        <span className="aquarelle-hero__mockup-babybreath" aria-hidden="true" />

        <figcaption className="aquarelle-hero__mockup-copy">
          <p className="aquarelle-hero__mockup-kicker">NUESTRA BODA:</p>
          <h1 className="aquarelle-hero__mockup-names">
            <span>{firstName}</span>
            <span className="aquarelle-hero__mockup-ampersand"> &amp; </span>
            <span>{secondName}</span>
          </h1>
          <div className="aquarelle-hero__mockup-date" aria-label={`Fecha de la boda: ${displayDate}`}>
            <span aria-hidden="true" />
            <time dateTime={weddingDateTime}>{displayDate}</time>
            <span aria-hidden="true" />
          </div>
        </figcaption>
      </motion.figure>
    </header>
  );
}
