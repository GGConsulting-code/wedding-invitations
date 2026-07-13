"use client";

import { BotanicalSprig, TornPaperDivider, WatercolorWash } from "./AquarelleDecor";
import { AquarelleMemoryCarousel } from "./AquarelleMemoryCarousel";

export function PhotoGallery({ photos = [] }) {
  const carouselPhotos = [...photos]
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .slice(1);

  return (
    <section className="invitation-gallery aquarelle-section" aria-labelledby="gallery-title">
      <TornPaperDivider className="invitation-gallery__torn invitation-gallery__torn--top" />
      <WatercolorWash className="aquarelle-section__wash aquarelle-section__wash--gallery" tone="silver" />
      <BotanicalSprig className="aquarelle-section__sprig aquarelle-section__sprig--gallery" />

      <div className="invitation-gallery__heading">
        <p className="invitation-section__eyebrow">Recuerdos de</p>
        <h2 id="gallery-title" className="invitation-section__title">Nuestro amor</h2>
      </div>

      <div className="invitation-gallery__frame">
        <AquarelleMemoryCarousel photos={carouselPhotos} />
      </div>

      <TornPaperDivider className="invitation-gallery__torn invitation-gallery__torn--bottom" inverted />
    </section>
  );
}
