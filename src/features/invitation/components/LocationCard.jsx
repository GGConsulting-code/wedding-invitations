"use client";

import { MapPin, Navigation } from "lucide-react";

export function LocationCard({ address }) {
  if (!address) return null;

  return (
    <section className="invitation-location" aria-labelledby="location-title">
      <p className="invitation-section__eyebrow">El lugar</p>
      <h2 id="location-title" className="invitation-section__title">Aquí nos encontraremos</h2>
      <div className="invitation-location__card">
        <div className="invitation-location__details">
          <span className="invitation-location__pin" aria-hidden="true">
            <MapPin size={24} />
          </span>
          <div>
            <h3 className="invitation-location__venue">{address.venueName}</h3>
            <p className="invitation-location__address">{address.formattedAddress}</p>
          </div>
        </div>

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

        <a
          className="invitation-location__directions"
          href={address.mapsNavigationUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Navigation size={18} aria-hidden="true" />
          Cómo llegar
        </a>
      </div>
    </section>
  );
}
