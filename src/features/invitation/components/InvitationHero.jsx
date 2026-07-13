"use client";

import { motion } from "motion/react";
import { ChevronDown, ImageOff } from "lucide-react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";

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

function CoupleNames({ value }) {
  const parts = value?.split(/\s*&\s*/).filter(Boolean) ?? [];

  if (parts.length !== 2) {
    return <span className="invitation-hero__single-name">{value}</span>;
  }

  return (
    <>
      <span>{parts[0]}</span>
      <span className="invitation-hero__ampersand">&amp;</span>
      <span>{parts[1]}</span>
    </>
  );
}

function BotanicalCorner({ className = "" }) {
  return (
    <svg
      className={`invitation-hero__botanical ${className}`}
      viewBox="0 0 180 170"
      aria-hidden="true"
    >
      <g className="invitation-hero__botanical-stems" fill="none" strokeLinecap="round">
        <path d="M18 154C44 126 64 100 86 54" />
        <path d="M53 154C73 126 91 105 121 78" />
        <path d="M9 119C38 107 57 91 72 70" />
      </g>
      <g className="invitation-hero__botanical-leaves">
        <ellipse cx="37" cy="125" rx="12" ry="26" transform="rotate(-50 37 125)" />
        <ellipse cx="60" cy="105" rx="11" ry="24" transform="rotate(-38 60 105)" />
        <ellipse cx="78" cy="79" rx="10" ry="22" transform="rotate(-26 78 79)" />
        <ellipse cx="84" cy="125" rx="11" ry="25" transform="rotate(48 84 125)" />
        <ellipse cx="108" cy="101" rx="10" ry="22" transform="rotate(56 108 101)" />
        <ellipse cx="129" cy="82" rx="9" ry="20" transform="rotate(63 129 82)" />
        <ellipse cx="34" cy="91" rx="9" ry="21" transform="rotate(-61 34 91)" />
      </g>
      <g className="invitation-hero__botanical-flowers">
        <g transform="translate(95 45)">
          <circle cx="0" cy="-10" r="8" />
          <circle cx="10" cy="0" r="8" />
          <circle cx="0" cy="10" r="8" />
          <circle cx="-10" cy="0" r="8" />
          <circle className="invitation-hero__flower-center" r="4" />
        </g>
        <g transform="translate(139 70) scale(.72)">
          <circle cx="0" cy="-10" r="8" />
          <circle cx="10" cy="0" r="8" />
          <circle cx="0" cy="10" r="8" />
          <circle cx="-10" cy="0" r="8" />
          <circle className="invitation-hero__flower-center" r="4" />
        </g>
        <g transform="translate(62 67) scale(.55)">
          <circle cx="0" cy="-10" r="8" />
          <circle cx="10" cy="0" r="8" />
          <circle cx="0" cy="10" r="8" />
          <circle cx="-10" cy="0" r="8" />
          <circle className="invitation-hero__flower-center" r="4" />
        </g>
      </g>
    </svg>
  );
}

export function InvitationHero({
  coupleDisplayName,
  presentationText,
  heroPhoto,
  weddingDateTime,
  timeZone,
}) {
  const prefersReducedMotion = useReducedMotionPreference();
  const displayDate = formatHeroDate(weddingDateTime, timeZone);
  const heroImageUrl = heroPhoto?.url?.trim();
  const backdropStyle = heroImageUrl
    ? { backgroundImage: `url("${heroImageUrl.replaceAll('"', "%22")}")` }
    : undefined;

  return (
    <header className="invitation-hero">
      <div className="invitation-hero__backdrop" style={backdropStyle} aria-hidden="true" />
      <div className="invitation-hero__backdrop-veil" aria-hidden="true" />

      <motion.div
        className="invitation-hero__stage"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.figure
          className="invitation-hero__portrait"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1.5, scale: 1 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {heroImageUrl ? (
            <motion.img
              src={heroImageUrl}
              alt={heroPhoto.altText || `Fotografía de ${coupleDisplayName}`}
              className="invitation-hero__portrait-image"
              loading="eager"
              decoding="async"
              initial={prefersReducedMotion ? false : { scale: 1.08 }}
              animate={{ scale: 1.015 }}
              transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div
              className="invitation-hero__portrait-placeholder"
              role="img"
              aria-label="Fotografía por agregar"
            >
              <ImageOff size={32} aria-hidden="true" />
              <span>Agrega la fotografía principal</span>
            </div>
          )}

          <span className="invitation-hero__portrait-frame" aria-hidden="true" />
          <span className="invitation-hero__portrait-vignette" aria-hidden="true" />
          <span className="invitation-hero__portrait-shine" aria-hidden="true" />

          <div className="invitation-hero__wedding-pill">
            <span className="invitation-hero__pill-ornament" aria-hidden="true">✦</span>
            <span>Nuestra boda</span>
            <ChevronDown size={14} strokeWidth={1.7} aria-hidden="true" />
          </div>

          <BotanicalCorner className="invitation-hero__botanical--top-left" />
          <BotanicalCorner className="invitation-hero__botanical--top-right" />
          <BotanicalCorner className="invitation-hero__botanical--bottom-left" />
          <BotanicalCorner className="invitation-hero__botanical--bottom-right" />

          <figcaption className="invitation-hero__copy">
            <motion.p
              className="invitation-hero__eyebrow"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
            >
              La boda de
            </motion.p>

            <motion.h1
              className="invitation-hero__title"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.44 }}
            >
              <CoupleNames value={coupleDisplayName} />
            </motion.h1>

            <motion.div
              className="invitation-hero__date-row"
              aria-label={`Fecha de la boda: ${displayDate}`}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.58 }}
            >
              <span aria-hidden="true" />
              <time dateTime={weddingDateTime}>{displayDate}</time>
              <span aria-hidden="true" />
            </motion.div>

            <motion.p
              className="invitation-hero__presentation"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              {presentationText}
            </motion.p>
          </figcaption>

          <span className="invitation-hero__scroll-cue" aria-hidden="true">
            <span />
          </span>
        </motion.figure>
      </motion.div>
    </header>
  );
}
