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
import { AquarelleOpening } from "../components/AquarelleOpening";
import { BotanicalSprig, TornPaperDivider, WatercolorWash } from "../components/AquarelleDecor";
import { AudioController, INVITATION_OPEN_AUDIO_EVENT } from "../components/AudioController";
import { Countdown } from "../components/Countdown";
import { EventDetails } from "../components/EventDetails";
import { InvitationHero } from "../components/InvitationHero";
import { LocationCard } from "../components/LocationCard";
import { PhotoGallery } from "../components/PhotoGallery";
import { RsvpDialog } from "../components/RsvpDialog";
import { ShareInvitationButton } from "../components/ShareInvitationButton";


function useAquarelleTextReveal(enabled, prefersReducedMotion) {
  useEffect(() => {
    if (!enabled) return undefined;

    const root = document.querySelector(".public-invitation--aquarelle .public-invitation__paper");
    if (!root) return undefined;

    const selectors = [
      ".aquarelle-hero__pretitle",
      ".aquarelle-hero__names",
      ".aquarelle-hero__announcement",
      ".aquarelle-hero__date",
      ".invitation-section__eyebrow",
      ".invitation-section__title",
      ".invitation-recipient__name",
      ".invitation-recipient__message",
      ".invitation-event-details__value",
      ".invitation-location__venue",
      ".invitation-location__address",
      ".invitation-countdown__kicker",
      ".invitation-countdown__heading",
      ".invitation-countdown__value",
      ".invitation-gallery__hint",
      ".aquarelle-memory-carousel__caption",
      ".invitation-rsvp-card__copy",
      ".aquarelle-footer p",
    ].join(",");

    const elements = Array.from(root.querySelectorAll(selectors));
    if (!elements.length) return undefined;

    const showAllText = () => {
      elements.forEach((element) => {
        element.classList.add("aq-text-reveal--visible");
      });
    };

    try {
      elements.forEach((element, index) => {
        element.classList.add("aq-text-reveal");
        if (element.matches(
          ".aquarelle-hero__names, .invitation-section__title, .invitation-recipient__name, .invitation-countdown__heading, .invitation-location__venue, .aquarelle-footer p",
        )) {
          element.classList.add("aq-text-reveal--script");
        }
        element.style.setProperty("--aq-reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
      });

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        showAllText();
        return undefined;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("aq-text-reveal--visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isAlreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isAlreadyVisible) {
          window.requestAnimationFrame(() => {
            element.classList.add("aq-text-reveal--visible");
          });
        } else {
          observer.observe(element);
        }
      });

      // Safety fallback: text must never remain hidden if a browser delays or
      // cancels IntersectionObserver callbacks.
      const fallbackTimer = window.setTimeout(showAllText, 3500);

      return () => {
        window.clearTimeout(fallbackTimer);
        observer.disconnect();
        showAllText();
      };
    } catch {
      showAllText();
      return undefined;
    }
  }, [enabled, prefersReducedMotion]);
}

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
      <p>Revisa que el enlace esté completo o solicita una nueva invitación a la pareja.</p>
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
  const [isInvitationRevealed, setIsInvitationRevealed] = useState(false);
  const currentUrl = typeof window === "undefined" ? "" : window.location.href;

  useAquarelleTextReveal(Boolean(invitationData) && isInvitationRevealed, prefersReducedMotion);

  useEffect(() => {
    if (!publicToken) return undefined;
    const request = dispatch(fetchPublicInvitation(publicToken));
    return () => request.abort?.();
  }, [dispatch, publicToken]);

  const retryInvitation = () => {
    if (publicToken) dispatch(fetchPublicInvitation(publicToken));
  };

  const handleInvitationOpen = () => {
    window.dispatchEvent(new Event(INVITATION_OPEN_AUDIO_EVENT));
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
  const sortedPhotos = [...(event.photos ?? [])].sort((first, second) => first.sortOrder - second.sortOrder);
  const heroPhoto = sortedPhotos[0] ?? null;

  return (
    <main className="public-invitation public-invitation--aquarelle">
      <AquarelleOpening
        coupleDisplayName={event.coupleDisplayName}
        heroPhoto={heroPhoto}
        onOpenInvitation={handleInvitationOpen}
        onOpeningComplete={() => setIsInvitationRevealed(true)}
      />

      <div className="public-invitation__paper">
        <InvitationHero
          coupleDisplayName={event.coupleDisplayName}
          heroPhoto={heroPhoto}
          weddingDateTime={event.weddingDateTime}
          timeZone={event.timeZone}
        />

        <motion.section
          className=" aquarelle-quote"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65 }}
          aria-labelledby="recipient-title"
        >
          <WatercolorWash className="aquarelle-quote__wash aquarelle-quote__wash--gold" tone="gold" />
          <WatercolorWash className="aquarelle-quote__wash aquarelle-quote__wash--silver" tone="silver" />
          <BotanicalSprig className="aquarelle-quote__sprig aquarelle-quote__sprig--left" />
          <BotanicalSprig className="aquarelle-quote__sprig aquarelle-quote__sprig--right" mirrored />
          <p className="invitation-recipient__label">Esta invitación es especialmente para:</p>
          <h2 id="recipient-title" className="invitation-recipient__name">{invitation.recipientName}</h2>
          <span className="invitation-recipient__ornament" aria-hidden="true" />
          <p className="invitation-recipient__message">{event.presentationText}</p>
        </motion.section>

        <EventDetails weddingDateTime={event.weddingDateTime} timeZone={event.timeZone} />
        <LocationCard address={event.address} />
        <Countdown weddingDateTime={event.weddingDateTime} />
        <PhotoGallery photos={event.photos} />

        <section className="invitation-actions aquarelle-actions" aria-labelledby="invitation-actions-title">
          <WatercolorWash className="aquarelle-actions__wash" tone="gold" />
          <p className="invitation-section__eyebrow">Guarda este recuerdo</p>
          <h2 id="invitation-actions-title" className="invitation-section__title">Lleva la fecha contigo</h2>
          <div className="invitation-actions__group">
            <AddToCalendarButton event={event} />
            <ShareInvitationButton coupleDisplayName={event.coupleDisplayName} url={currentUrl} />
          </div>
        </section>

       {/*
        <section className="invitation-rsvp-card aquarelle-rsvp" aria-labelledby="rsvp-card-title">
          <TornPaperDivider className="aquarelle-rsvp__torn" />
          <WatercolorWash className="aquarelle-rsvp__wash" tone="silver" />
          <BotanicalSprig className="aquarelle-rsvp__sprig" />
          <div className="aquarelle-rsvp__letter">
            <p className="invitation-section__eyebrow">Asistencia</p>
            <h2 id="rsvp-card-title" className="invitation-section__title">
              {hasResponded ? "Tu respuesta está registrada" : "¿Nos acompañas?"}
            </h2>
            <p className="invitation-rsvp-card__copy">
              {hasResponded
                ? "Si tus planes cambian, puedes actualizar tu respuesta aquí."
                : "Contar con tu presencia hará este día todavía más especial."}
            </p>
            <button
              type="button"
              className="invitation-rsvp-card__button"
              onClick={() => setIsRsvpOpen(true)}
            >
              <HeartHandshake size={19} aria-hidden="true" />
              {hasResponded ? "Cambiar respuesta" : "Pulsa en el sobre"}
            </button>
          </div>
          <div className="aquarelle-rsvp__envelope" aria-hidden="true">
            <span className="aquarelle-rsvp__envelope-back" />
            <span className="aquarelle-rsvp__envelope-front" />
            <span className="aquarelle-rsvp__seal">♥</span>
          </div>
        </section> 
        */
       }
        

        <footer className="public-invitation__footer aquarelle-footer">
          <WatercolorWash className="aquarelle-footer__wash" tone="gold" />
          <span aria-hidden="true">♥</span>
          <p>Con cariño, {event.coupleDisplayName}</p>
          <p>{invitation.invitacionIndividual ? "¡Te esperamos!" : "¡Los esperamos!"}</p>
        </footer>
      </div>

       {
        /*
              <button
        type="button"
        className="public-invitation__fixed-rsvp"
        onClick={() => setIsRsvpOpen(true)}
      >
        <HeartHandshake size={20} aria-hidden="true" />
        {hasResponded ? "Cambiar respuesta" : "Confirmar asistencia"}
      </button>

        */
       }


      <AudioController audio={event.audio} startOnInvitationOpen />
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
