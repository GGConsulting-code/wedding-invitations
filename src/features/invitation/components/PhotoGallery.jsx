"use client";

import { Component, lazy, Suspense } from "react";
import { useReducedMotionPreference } from "../../../hooks/useReducedMotionPreference";
import { useWebGLSupport } from "../../../hooks/useWebGLSupport";
import { PhotoCarouselFallback } from "./PhotoCarouselFallback";

const LazyPhotoCarousel3D = lazy(() =>
  import("./PhotoCarousel3D").then((module) => ({ default: module.PhotoCarousel3D })),
);

class ThreeGalleryBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <PhotoCarouselFallback photos={this.props.photos} />;
    }
    return this.props.children;
  }
}

export function PhotoGallery({ photos = [] }) {
  const prefersReducedMotion = useReducedMotionPreference();
  const { isChecking, isSupported, isLowPerformance } = useWebGLSupport();
  const sortedPhotos = [...photos].sort((first, second) => first.sortOrder - second.sortOrder);
  const shouldUseFallback =
    isChecking ||
    !isSupported ||
    isLowPerformance ||
    prefersReducedMotion ||
    sortedPhotos.length < 3;

  return (
    <section className="invitation-gallery" aria-labelledby="gallery-title">
      <p className="invitation-section__eyebrow">Nuestra historia</p>
      <h2 id="gallery-title" className="invitation-section__title">Momentos que atesoramos</h2>
      <p className="invitation-gallery__hint">
        {shouldUseFallback ? "Desliza para recorrer las fotografías." : "Desliza o toca una fotografía para explorar."}
      </p>

      {shouldUseFallback ? (
        <PhotoCarouselFallback photos={sortedPhotos} />
      ) : (
        <ThreeGalleryBoundary key={sortedPhotos.map((photo) => photo.id).join("|")} photos={sortedPhotos}>
          <Suspense fallback={<div className="invitation-gallery__loading" role="status">Preparando la galería…</div>}>
            <LazyPhotoCarousel3D photos={sortedPhotos.slice(0, 8)} />
          </Suspense>
        </ThreeGalleryBoundary>
      )}
    </section>
  );
}
