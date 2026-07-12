"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";

export function InvitationHero({ coupleDisplayName, presentationText }) {
  const prefersReducedMotion = useReducedMotionPreference();

  return (
    <header className="invitation-hero">
      <motion.div
        className="invitation-hero__envelope"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24, rotateX: -8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="invitation-hero__botanical invitation-hero__botanical--left" aria-hidden="true" />
        <span className="invitation-hero__botanical invitation-hero__botanical--right" aria-hidden="true" />
        <div className="invitation-hero__flap" aria-hidden="true" />
        <div className="invitation-hero__card">
          <span className="invitation-hero__eyebrow">Nos casamos</span>
          <Heart className="invitation-hero__heart" size={22} strokeWidth={1.5} aria-hidden="true" />
          <h1 className="invitation-hero__title">{coupleDisplayName}</h1>
          <p className="invitation-hero__presentation">{presentationText}</p>
        </div>
      </motion.div>
      <span className="invitation-hero__spark invitation-hero__spark--one" aria-hidden="true" />
      <span className="invitation-hero__spark invitation-hero__spark--two" aria-hidden="true" />
    </header>
  );
}
