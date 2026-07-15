"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ChevronUp } from "lucide-react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";

const OPENING_DURATION_MS = 1880;
const DRAG_THRESHOLD = 48;

function splitCoupleNames(value) {
  const names = value?.split(/\s*&\s*/).map((name) => name.trim()).filter(Boolean) ?? [];
  if (names.length >= 2) return names.slice(0, 2);
  if (names.length === 1) return [names[0], ""];
  return ["Nuestra", "Boda"];
}

function getInitials(names) {
  return names
    .filter(Boolean)
    .map((name) => name.charAt(0).toUpperCase())
    .join("&");
}

function AnimatedCharacters({ children, className = "", delay = 0 }) {
  const characters = Array.from(children ?? "");

  return (
    <span className={className} aria-label={children}>
      {characters.map((character, index) => (
        <span
          // Character and index are intentionally combined because repeated letters are expected.
          key={`${character}-${index}`}
          className="aquarelle-opening__character"
          aria-hidden="true"
          style={{ "--aq-character-delay": `${delay + index * 0.045}s` }}
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );
}

export function AquarelleOpening({ coupleDisplayName, heroPhoto, onOpenInvitation, onOpeningComplete }) {
  const prefersReducedMotion = useReducedMotionPreference();
  const [stage, setStage] = useState("closed");
  const hasOpenedRef = useRef(false);
  const openingCompleteRef = useRef(onOpeningComplete);
  const dragY = useMotionValue(0);
  const dragProgress = useTransform(dragY, [0, -110], [0, 1]);
  const envelopeScale = useTransform(dragProgress, [0, 1], [1, 1.025]);
  const promptOpacity = useTransform(dragProgress, [0, 0.65, 1], [1, 0.42, 0]);
  const [firstName, secondName] = useMemo(
    () => splitCoupleNames(coupleDisplayName),
    [coupleDisplayName],
  );
  const initials = useMemo(
    () => getInitials([firstName, secondName]),
    [firstName, secondName],
  );
  const heroImageUrl = heroPhoto?.url?.trim();
  const backgroundStyle = heroImageUrl
    ? { backgroundImage: `url("${heroImageUrl.replaceAll('"', "%22")}")` }
    : undefined;

  useEffect(() => {
    openingCompleteRef.current = onOpeningComplete;
  }, [onOpeningComplete]);

  useEffect(() => {
    if (stage === "dismissed") return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "opening") return undefined;
    const duration = prefersReducedMotion ? 320 : OPENING_DURATION_MS;
    const timer = window.setTimeout(() => {
      setStage("dismissed");
      openingCompleteRef.current?.();
    }, duration);
    return () => window.clearTimeout(timer);
  }, [stage, prefersReducedMotion]);

  if (stage === "dismissed") return null;

  const openInvitation = () => {
    if (stage !== "closed" || hasOpenedRef.current) return;
    hasOpenedRef.current = true;

    // This callback fires directly inside the tap/drag gesture. It is intentionally
    // called before the animation starts so mobile browsers allow audio playback.
    onOpenInvitation?.();
    setStage("opening");
  };

  return (
    <motion.section
      className={`aquarelle-opening aquarelle-opening--${stage}`}
      aria-label="Abrir invitación"
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "opening" ? 0 : 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.18 : 0.52,
        delay: stage === "opening" ? (prefersReducedMotion ? 0.12 : 1.34) : 0,
      }}
    >
      <motion.div
        className="aquarelle-opening__photo"
        style={backgroundStyle}
        aria-hidden="true"
        animate={stage === "opening" ? { scale: 1.08 } : { scale: 1.015 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 2.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="aquarelle-opening__photo-blur" aria-hidden="true" />
      <span className="aquarelle-opening__vignette" aria-hidden="true" />
      <span className="aquarelle-opening__grain" aria-hidden="true" />
      <span className="aquarelle-opening__metal-wash aquarelle-opening__metal-wash--gold" aria-hidden="true" />
      <span className="aquarelle-opening__metal-wash aquarelle-opening__metal-wash--silver" aria-hidden="true" />

      <motion.header
        className="aquarelle-opening__headline"
        animate={stage === "opening" ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
      </motion.header>

      <motion.button
        type="button"
        className="aquarelle-envelope"
        onClick={openInvitation}
        drag={stage === "closed" && !prefersReducedMotion ? "y" : false}
        dragConstraints={{ top: -116, bottom: 10 }}
        dragElastic={0.16}
        dragMomentum={false}
        style={{ y: dragY, scale: envelopeScale }}
        onDragEnd={(_, info) => {
          if (info.offset.y <= -DRAG_THRESHOLD || info.velocity.y <= -380) {
            openInvitation();
            return;
          }
          dragY.set(0);
        }}
        whileTap={stage === "closed" ? { scale: 0.992 } : undefined}
        aria-label="Pulsa o desliza hacia arriba para abrir la invitación"
      >
        <span className="aquarelle-envelope__scene" aria-hidden="true">
          <span className="aquarelle-envelope__shadow" />
          <span className="aquarelle-envelope__back" />
          <span className="aquarelle-envelope__lining" />

          <span className="aquarelle-envelope__letter">
            <span className="aquarelle-envelope__letter-watercolor aquarelle-envelope__letter-watercolor--gold" />
            <span className="aquarelle-envelope__letter-watercolor aquarelle-envelope__letter-watercolor--silver" />
            <span className="aquarelle-envelope__letter-border" />
            <span className="aquarelle-envelope__letter-copy">
              <span className="aquarelle-envelope__letter-kicker">La boda de</span>
              <span className="aquarelle-envelope__letter-name aquarelle-envelope__letter-name--first">
                {firstName}
              </span>
              <span className="aquarelle-envelope__letter-ampersand">&amp;</span>
              <span className="aquarelle-envelope__letter-name aquarelle-envelope__letter-name--second">
                {secondName}
              </span>
            </span>
          </span>

          <span className="aquarelle-envelope__front aquarelle-envelope__front--left" />
          <span className="aquarelle-envelope__front aquarelle-envelope__front--right" />
          <span className="aquarelle-envelope__front aquarelle-envelope__front--bottom" />
          <span className="aquarelle-envelope__flap">
            <span className="aquarelle-envelope__flap-inner" />
          </span>
          <span className="aquarelle-envelope__seal">
            <span className="aquarelle-envelope__seal-rim" />
            <span className="aquarelle-envelope__seal-copy">{initials}</span>
          </span>
          <span className="aquarelle-envelope__spark aquarelle-envelope__spark--one">✦</span>
          <span className="aquarelle-envelope__spark aquarelle-envelope__spark--two">✧</span>
        </span>
      </motion.button>

      <motion.button
        type="button"
        className="aquarelle-opening__prompt"
        onClick={openInvitation}
        style={{ opacity: promptOpacity }}
        animate={stage === "opening" ? { opacity: 0, y: 18 } : { y: [0, -4, 0] }}
        transition={stage === "opening"
          ? { duration: 0.28 }
          : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronUp size={17} strokeWidth={1.3} aria-hidden="true" />
        <strong>¡Pulsa aquí y desliza!</strong>
      </motion.button>

      <span className="aquarelle-opening__opening-flash" aria-hidden="true" />
    </motion.section>
  );
}
