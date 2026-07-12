"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, HeartHandshake, LoaderCircle, UserRoundX, X } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";

const CONFIRMATION_COPY = {
  CONFIRMED: {
    title: "¡Gracias por confirmar!",
    description: "Nos emociona muchísimo saber que celebrarás con nosotros.",
  },
  DECLINED: {
    title: "Gracias por avisarnos",
    description: "Te llevaremos en el corazón durante este día tan especial.",
  },
};

export function RsvpDialog({
  open,
  onOpenChange,
  onSubmit,
  currentStatus = "PENDING",
  isSubmitting = false,
  error = null,
  confirmationStatus = null,
}) {
  const prefersReducedMotion = useReducedMotionPreference();
  const confirmation = confirmationStatus ? CONFIRMATION_COPY[confirmationStatus] : null;

  const handleOpenChange = (nextOpen) => {
    if (isSubmitting && !nextOpen) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="rsvp-dialog__overlay"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </Dialog.Overlay>
        <Dialog.Content
          className="rsvp-dialog__content"
          onEscapeKeyDown={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          aria-describedby="rsvp-description"
        >
          <motion.div
            className="rsvp-dialog__panel"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {!isSubmitting ? (
              <Dialog.Close asChild>
                <button type="button" className="rsvp-dialog__close" aria-label="Cerrar confirmación">
                  <X size={20} aria-hidden="true" />
                </button>
              </Dialog.Close>
            ) : null}

            {confirmation ? (
              <div className="rsvp-dialog__confirmation" role="status">
                <span className="rsvp-dialog__confirmation-icon" aria-hidden="true">
                  <Check size={28} />
                </span>
                <Dialog.Title className="rsvp-dialog__title">{confirmation.title}</Dialog.Title>
                <Dialog.Description id="rsvp-description" className="rsvp-dialog__description">
                  {confirmation.description}
                </Dialog.Description>
                <Dialog.Close asChild>
                  <button type="button" className="rsvp-dialog__done">Cerrar</button>
                </Dialog.Close>
              </div>
            ) : (
              <>
                <p className="rsvp-dialog__eyebrow">RSVP</p>
                <Dialog.Title className="rsvp-dialog__title">¿Podrás acompañarnos?</Dialog.Title>
                <Dialog.Description id="rsvp-description" className="rsvp-dialog__description">
                  Elige una opción. Podrás cambiar tu respuesta más adelante si lo necesitas.
                </Dialog.Description>

                {currentStatus !== "PENDING" ? (
                  <p className="rsvp-dialog__current-status">
                    Respuesta actual: {currentStatus === "CONFIRMED" ? "Sí asistiré" : "No podré asistir"}
                  </p>
                ) : null}

                <div className="rsvp-dialog__options">
                  <button
                    type="button"
                    className={`rsvp-dialog__option rsvp-dialog__option--confirmed${currentStatus === "CONFIRMED" ? " rsvp-dialog__option--selected" : ""}`}
                    onClick={() => onSubmit("CONFIRMED")}
                    disabled={isSubmitting}
                  >
                    <HeartHandshake size={24} aria-hidden="true" />
                    <span>
                      <strong>Confirmar asistencia</strong>
                      <small>Sí, celebraré con ustedes</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`rsvp-dialog__option rsvp-dialog__option--declined${currentStatus === "DECLINED" ? " rsvp-dialog__option--selected" : ""}`}
                    onClick={() => onSubmit("DECLINED")}
                    disabled={isSubmitting}
                  >
                    <UserRoundX size={24} aria-hidden="true" />
                    <span>
                      <strong>No podré asistir</strong>
                      <small>Les acompaño de corazón</small>
                    </span>
                  </button>
                </div>

                {isSubmitting ? (
                  <p className="rsvp-dialog__submitting" role="status">
                    <LoaderCircle className="rsvp-dialog__spinner" size={18} aria-hidden="true" />
                    Guardando tu respuesta…
                  </p>
                ) : null}

                {error ? (
                  <p className="rsvp-dialog__error" role="alert">
                    {error.message || "No pudimos guardar tu respuesta. Inténtalo de nuevo."}
                  </p>
                ) : null}
              </>
            )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
