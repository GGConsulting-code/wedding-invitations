"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";

const SWIPE_THRESHOLD = 54;

function normalizeIndex(index, length) {
  if (!length) return 0;
  return (index + length) % length;
}

export function AquarelleMemoryCarousel({ photos = [] }) {
  const prefersReducedMotion = useReducedMotionPreference();
  const orderedPhotos = useMemo(
    () => [...photos].sort((first, second) => first.sortOrder - second.sortOrder),
    [photos],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    if (activeIndex > orderedPhotos.length - 1) setActiveIndex(0);
  }, [activeIndex, orderedPhotos.length]);

  useEffect(() => {
    setHasImageError(false);
  }, [activeIndex]);

  if (!orderedPhotos.length) {
    return (
      <div className="aquarelle-memory-carousel aquarelle-memory-carousel--empty">
        <ImageOff size={32} aria-hidden="true" />
        <p>Muy pronto compartiremos nuestros recuerdos.</p>
      </div>
    );
  }

  const activePhoto = orderedPhotos[activeIndex];
  const selectPhoto = (nextIndex, nextDirection) => {
    setDirection(nextDirection);
    setActiveIndex(normalizeIndex(nextIndex, orderedPhotos.length));
  };

  const previousPhoto = () => selectPhoto(activeIndex - 1, -1);
  const nextPhoto = () => selectPhoto(activeIndex + 1, 1);

  const variants = {
    enter: (slideDirection) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : slideDirection > 0 ? 42 : -42,
      scale: prefersReducedMotion ? 1 : 0.985,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (slideDirection) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : slideDirection > 0 ? -42 : 42,
      scale: prefersReducedMotion ? 1 : 0.985,
    }),
  };

  return (
    <div
      className="aquarelle-memory-carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Recuerdos de la pareja"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previousPhoto();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          nextPhoto();
        }
      }}
    >
      <div className="aquarelle-memory-carousel__stage">
        <span className="aquarelle-memory-carousel__wash aquarelle-memory-carousel__wash--gold" aria-hidden="true" />
        <span className="aquarelle-memory-carousel__wash aquarelle-memory-carousel__wash--silver" aria-hidden="true" />
        <span className="aquarelle-memory-carousel__sketch aquarelle-memory-carousel__sketch--left" aria-hidden="true" />
        <span className="aquarelle-memory-carousel__sketch aquarelle-memory-carousel__sketch--right" aria-hidden="true" />

        <button
          type="button"
          className="aquarelle-memory-carousel__arrow aquarelle-memory-carousel__arrow--previous"
          aria-label="Ver fotografía anterior"
          onClick={previousPhoto}
        >
          <ChevronLeft size={23} strokeWidth={1.35} aria-hidden="true" />
        </button>

        <div className="aquarelle-memory-carousel__viewport">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.figure
              key={activePhoto.id ?? `${activePhoto.url}-${activeIndex}`}
              className="aquarelle-memory-carousel__figure"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: prefersReducedMotion ? 0.12 : 0.52,
                ease: [0.22, 1, 0.36, 1],
              }}
              drag={orderedPhotos.length > 1 && !prefersReducedMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x <= -SWIPE_THRESHOLD) nextPhoto();
                if (info.offset.x >= SWIPE_THRESHOLD) previousPhoto();
              }}
            >
              <span className="aquarelle-memory-carousel__paper-edge" aria-hidden="true" />
              {hasImageError ? (
                <div
                  className="aquarelle-memory-carousel__placeholder"
                  role="img"
                  aria-label={activePhoto.altText || "Fotografía no disponible"}
                >
                  <ImageOff size={30} aria-hidden="true" />
                  <span>Esta fotografía no está disponible</span>
                </div>
              ) : (
                <img
                  className="aquarelle-memory-carousel__image"
                  src={activePhoto.url}
                  alt={activePhoto.altText || `Recuerdo ${activeIndex + 1}`}
                  loading={activeIndex === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable="false"
                  onError={() => setHasImageError(true)}
                />
              )}
              <span className="aquarelle-memory-carousel__photo-veil" aria-hidden="true" />
            </motion.figure>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="aquarelle-memory-carousel__arrow aquarelle-memory-carousel__arrow--next"
          aria-label="Ver fotografía siguiente"
          onClick={nextPhoto}
        >
          <ChevronRight size={23} strokeWidth={1.35} aria-hidden="true" />
        </button>
      </div>

      <div className="aquarelle-memory-carousel__footer">
        <span className="aquarelle-memory-carousel__counter" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")}
          <i aria-hidden="true" />
          {String(orderedPhotos.length).padStart(2, "0")}
        </span>
        <div className="aquarelle-memory-carousel__dots" aria-label={`Fotografía ${activeIndex + 1} de ${orderedPhotos.length}`}>
          {orderedPhotos.map((photo, index) => (
            <button
              key={photo.id ?? `${photo.url}-${index}`}
              type="button"
              className={`aquarelle-memory-carousel__dot${index === activeIndex ? " aquarelle-memory-carousel__dot--active" : ""}`}
              aria-label={`Ir a la fotografía ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => selectPhoto(index, index >= activeIndex ? 1 : -1)}
            />
          ))}
        </div>
      </div>

      {activePhoto.altText ? (
        <p className="aquarelle-memory-carousel__caption">{activePhoto.altText}</p>
      ) : null}
    </div>
  );
}
