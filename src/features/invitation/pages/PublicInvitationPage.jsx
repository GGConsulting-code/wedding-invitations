"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { HeartHandshake, Link2Off, LoaderCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { fetchPublicInvitation, submitRsvp } from "../../../store/actions/publicInvitationActions";
import {
  selectPublicInvitation,
  selectPublicInvitationError,
  selectPublicInvitationStatus,
  selectRsvpError,
  selectRsvpStatus,
} from "../../../store/selectors/publicInvitationSelectors";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";
import { AddToCalendarButton } from "../components/AddToCalendarButton";
import { AudioController } from "../components/AudioController";
import { Countdown } from "../components/Countdown";
import { EventDetails } from "../components/EventDetails";
import { InvitationHero } from "../components/InvitationHero";
import { LocationCard } from "../components/LocationCard";
import { PhotoGallery } from "../components/PhotoGallery";
import { RsvpDialog } from "../components/RsvpDialog";
import { ShareInvitationButton } from "../components/ShareInvitationButton";

function PublicInvitationLoading() {
  return (
    <main className="public-invitation-state public-invitation-state--loading" aria-busy="true">
      <span className="public-invitation-state__monogram" aria-hidden="true">N · B</span>
      <LoaderCircle className="public-invitation-state__spinner" size={28} aria-hidden="true" />
      <h1>Abriendo tu invitación</h1>
      <p>Estamos preparando cada detalle para ti…</p>
    </main>
  );
}

function InvalidInvitation({ error, onRetry }) {
  const canRetry = !error?.status || error.status >= 500 || error.status === 429;

  return (
    <main className="public-invitation-state public-invitation-state--invalid">
      <span className="public-invitation-state__icon" aria-hidden="true">
        <Link2Off size={30} />
      </span>
      <p className="invitation-section__eyebrow">Invitación no disponible</p>
      <h1>Este enlace no está disponible</h1>
      <p>
        Revisa que el enlace esté completo o solicita una nueva invitación a la pareja.
      </p>
      {canRetry && onRetry ? (
        <button type="button" className="public-invitation-state__retry" onClick={onRetry}>
          <RefreshCw size={18} aria-hidden="true" />
          Intentar de nuevo
        </button>
      ) : null}
    </main>
  );
}

export function PublicInvitationPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const publicToken = searchParams.get("token")?.trim() ?? "";
  const invitationData = useSelector(selectPublicInvitation);
  const fetchStatus = useSelector(selectPublicInvitationStatus);
  const fetchError = useSelector(selectPublicInvitationError);
  const rsvpStatus = useSelector(selectRsvpStatus);
  const rsvpError = useSelector(selectRsvpError);
  const prefersReducedMotion = useReducedMotionPreference();
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState(null);
  const currentUrl = typeof window === "undefined" ? "" : window.location.href;

  useEffect(() => {
    if (!publicToken) return undefined;
    const request = dispatch(fetchPublicInvitation(publicToken));
    return () => request.abort?.();
  }, [dispatch, publicToken]);

  const retryInvitation = () => {
    if (publicToken) dispatch(fetchPublicInvitation(publicToken));
  };

  const handleRsvpSubmit = async (status) => {
    setConfirmationStatus(null);

    try {
      const result = await dispatch(
        submitRsvp({
          publicToken,
          status,
          respondedAtClient: new Date().toISOString(),
        }),
      ).unwrap();
      setConfirmationStatus(result.data.status);
    } catch {
      // The normalized error is rendered from the public invitation slice.
    }
  };

  const handleRsvpOpenChange = (nextOpen) => {
    setIsRsvpOpen(nextOpen);
    if (!nextOpen) setConfirmationStatus(null);
  };

  if (!publicToken) return <InvalidInvitation />;
  if (fetchStatus === "idle" || fetchStatus === "loading") return <PublicInvitationLoading />;
  if (fetchStatus === "failed" || !invitationData) {
    return <InvalidInvitation error={fetchError} onRetry={retryInvitation} />;
  }

  const { invitation, event } = invitationData;
  const isSubmittingRsvp = rsvpStatus === "loading";
  const hasResponded = invitation.status !== "PENDING";

  return (
    <main className="public-invitation">
      <div className="public-invitation__paper">
        <InvitationHero
          coupleDisplayName={event.coupleDisplayName}
          presentationText={event.presentationText}
        />

        <motion.section
          className="invitation-recipient"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.55 }}
          aria-labelledby="recipient-title"
        >
          <span className="invitation-recipient__ornament" aria-hidden="true" />
          <p className="invitation-recipient__label">Especialmente para</p>
          <h2 id="recipient-title" className="invitation-recipient__name">{invitation.recipientName}</h2>
          <span className="invitation-recipient__ornament" aria-hidden="true" />
        </motion.section>

        <EventDetails weddingDateTime={event.weddingDateTime} timeZone={event.timeZone} />
        <Countdown weddingDateTime={event.weddingDateTime} />
        <LocationCard address={event.address} />
        <PhotoGallery photos={event.photos} />

        <section className="invitation-actions" aria-labelledby="invitation-actions-title">
          <p className="invitation-section__eyebrow">Guarda y comparte</p>
          <h2 id="invitation-actions-title" className="invitation-section__title">Lleva la fecha contigo</h2>
          <div className="invitation-actions__group">
            <AddToCalendarButton event={event} />
            <ShareInvitationButton coupleDisplayName={event.coupleDisplayName} url={currentUrl} />
          </div>
        </section>

        <section className="invitation-rsvp-card" aria-labelledby="rsvp-card-title">
          <span className="invitation-rsvp-card__icon" aria-hidden="true">
            <HeartHandshake size={28} />
          </span>
          <p className="invitation-section__eyebrow">Queremos contar contigo</p>
          <h2 id="rsvp-card-title" className="invitation-section__title">
            {hasResponded ? "Tu respuesta está registrada" : "¿Nos acompañas?"}
          </h2>
          <p className="invitation-rsvp-card__copy">
            {hasResponded
              ? "Si tus planes cambian, puedes actualizar tu respuesta aquí."
              : "Confirma tu asistencia para ayudarnos a preparar cada detalle."}
          </p>
          <button
            type="button"
            className="invitation-rsvp-card__button"
            onClick={() => setIsRsvpOpen(true)}
          >
            {hasResponded ? "Cambiar respuesta" : "Confirmar asistencia"}
          </button>
        </section>

        <footer className="public-invitation__footer">
          <span aria-hidden="true">♥</span>
          <p>Con cariño, {event.coupleDisplayName}</p>
        </footer>
      </div>

      <button
        type="button"
        className="public-invitation__fixed-rsvp"
        onClick={() => setIsRsvpOpen(true)}
      >
        <HeartHandshake size={20} aria-hidden="true" />
        {hasResponded ? "Cambiar respuesta" : "Confirmar asistencia"}
      </button>

      <AudioController audio={event.audio} />
      <RsvpDialog
        open={isRsvpOpen}
        onOpenChange={handleRsvpOpenChange}
        onSubmit={handleRsvpSubmit}
        currentStatus={invitation.status}
        isSubmitting={isSubmittingRsvp}
        error={rsvpError}
        confirmationStatus={confirmationStatus}
      />
    </main>
  );
}
