"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";

function PhotoCard({ photo, index, prefersReducedMotion }) {
  const [hasError, setHasError] = useState(false);

  return (
    <motion.li
      className="photo-carousel-fallback__item"
      data-photo-index={index}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.35, once: true }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
    >
      {hasError ? (
        <div className="photo-carousel-fallback__placeholder" role="img" aria-label={photo.altText}>
          <ImageOff size={28} aria-hidden="true" />
          <span>Esta fotografía no está disponible</span>
        </div>
      ) : (
        <img
          className="photo-carousel-fallback__image"
          src={photo.url}
          alt={photo.altText}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      )}
    </motion.li>
  );
}

export function PhotoCarouselFallback({ photos = [] }) {
  const prefersReducedMotion = useReducedMotionPreference();
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos.length) {
    return (
      <div className="photo-carousel-fallback photo-carousel-fallback--empty">
        <ImageOff size={30} aria-hidden="true" />
        <p>Muy pronto compartiremos nuestras fotografías.</p>
      </div>
    );
  }

  const scrollToPhoto = (nextIndex) => {
    const normalizedIndex = Math.min(photos.length - 1, Math.max(0, nextIndex));
    const item = listRef.current?.querySelector(`[data-photo-index="${normalizedIndex}"]`);
    item?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
    setActiveIndex(normalizedIndex);
  };

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;

    const listCenter = list.scrollLeft + list.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(list.children).forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const distance = Math.abs(itemCenter - listCenter);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
    <div
      className="photo-carousel-fallback"
      role="region"
      aria-label="Carrusel de fotografías de la pareja"
      aria-roledescription="carrusel"
    >
      <ul
        ref={listRef}
        className="photo-carousel-fallback__track"
        aria-label="Fotografías de la pareja"
        onScroll={handleScroll}
      >
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id ?? `${photo.url}-${index}`}
            photo={photo}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </ul>

      {photos.length > 1 ? (
        <div className="photo-carousel-fallback__navigation">
          <button
            type="button"
            className="photo-carousel-fallback__arrow"
            aria-label="Ver fotografía anterior"
            onClick={() => scrollToPhoto(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <div className="photo-carousel-fallback__dots" aria-label={`Fotografía ${activeIndex + 1} de ${photos.length}`}>
            {photos.map((photo, index) => (
              <button
                key={photo.id ?? index}
                type="button"
                className={`photo-carousel-fallback__dot${index === activeIndex ? " photo-carousel-fallback__dot--active" : ""}`}
                aria-label={`Ir a la fotografía ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => scrollToPhoto(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="photo-carousel-fallback__arrow"
            aria-label="Ver fotografía siguiente"
            onClick={() => scrollToPhoto(activeIndex + 1)}
            disabled={activeIndex === photos.length - 1}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
