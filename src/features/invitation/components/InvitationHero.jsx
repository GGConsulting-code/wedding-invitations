"use client";

import { motion } from "motion/react";
import { ImageOff } from "lucide-react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";
import {
  BotanicalSprig,
  TornPaperDivider,
  WatercolorWash,
  WeddingRingsMark,
} from "./AquarelleDecor";

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

function NameFlourish() {
  return (
    <svg
      className="aquarelle-hero__name-flourish"
      viewBox="0 0 520 132"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="aquarelle-hero__name-flourish-line"
        d="M8 65C58 65 77 57 110 61c30 4 54 14 86 10 24-3 38-12 57-11 15 1 25 9 31 19 6-10 16-18 31-19 19-1 33 8 57 11 32 4 56-6 86-10 33-4 52 4 102 4"
      />
      <path
        className="aquarelle-hero__name-flourish-heart"
        d="M260 81c-13-18-36-11-36 8 0 18 20 30 36 43 16-13 36-25 36-43 0-19-23-26-36-8Z"
      />
      <path
        className="aquarelle-hero__name-flourish-tail"
        d="M260 128c1-18 7-28 17-39"
      />
    </svg>
  );
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
    <header className="aquarelle-hero">
      <motion.figure
        className="aquarelle-hero__photo"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.035 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {heroImageUrl ? (
          <motion.img
            src={heroImageUrl}
            alt={heroPhoto.altText || `Fotografía de ${coupleDisplayName}`}
            className="aquarelle-hero__photo-image"
            loading="eager"
            decoding="async"
            initial={prefersReducedMotion ? false : { scale: 1.07 }}
            animate={{ scale: 1.012 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div className="aquarelle-hero__photo-placeholder" role="img" aria-label="Fotografía por agregar">
            <ImageOff size={34} aria-hidden="true" />
            <span>Agrega la fotografía principal</span>
          </div>
        )}

       
      </motion.figure>

      <motion.div
        className="aquarelle-hero__paper"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.82, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <TornPaperDivider className="aquarelle-hero__torn" />

        <p className="aquarelle-hero__announcement">NUESTRA BODA CIVIL:</p>
        <div className="aquarelle-hero__date" aria-label={`Fecha de la boda: ${displayDate}`}>
          <span aria-hidden="true" />
          <time dateTime={weddingDateTime}>{displayDate}</time>
          <span aria-hidden="true" />
        </div>

        <div className="aquarelle-hero__name-lockup">
          <NameFlourish />
          <h1 className="aquarelle-hero__names">
            <span>{firstName}</span>
            <span className="invitation-hero__ampersand">&amp;</span>
            <span>{secondName}</span>
          </h1>
        </div>
         <br/>
        <br/>
        <br/>

        <WeddingRingsMark className="aquarelle-hero__rings" />
        <br/>
        <br/>


      </motion.div>
    </header>
  );
}
