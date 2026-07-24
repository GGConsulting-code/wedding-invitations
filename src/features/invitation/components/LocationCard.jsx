"use client";

import { MapPin, Navigation } from "lucide-react";
import { BotanicalSprig, WatercolorWash } from "./AquarelleDecor";

export function LocationCard({ address }) {
  if (!address) return null;

  return (
    <section className="invitation-location aquarelle-section" aria-labelledby="location-title">
      <WatercolorWash className="aquarelle-section__wash aquarelle-section__wash--location" tone="gold" />
      <BotanicalSprig className="aquarelle-section__sprig aquarelle-section__sprig--location" mirrored />
      <header className="invitation-location__heading-block">
        <p className="invitation-section__eyebrow">En la ceremonia de</p>
        <h2 id="location-title" className="invitation-section__title">Celebración</h2>
      </header>
      <div className="invitation-location__card">
        <div className="invitation-location__details">
          <span className="invitation-location__pin" aria-hidden="true">
            <MapPin size={25} />
          </span>
          <p className="invitation-location__microcopy">Ubicación</p>
          <div className="invitation-event-details__divider" aria-hidden="true" />
          <h3 className="invitation-location__venue">{address.venueName}</h3>
          <p className="invitation-location__address">{address.formattedAddress}</p>
         
{address.mapEmbedUrl ? (
          <div className="invitation-location__map-frame">
            <iframe
              className="invitation-location__map"
              src={address.mapEmbedUrl}
              title={`Mapa para llegar a ${address.venueName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="invitation-location__map-fallback">
            <MapPin size={28} aria-hidden="true" />
            <p>Consulta la ruta en tu aplicación de mapas.</p>
          </div>
        )}
          
        </div>
 <a
            className="invitation-location__directions"
            href={address.mapsNavigationUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Navigation size={18} aria-hidden="true" />
            Pulsa para ver en Maps
          </a>
        
      </div>
    </section>
  );
}
