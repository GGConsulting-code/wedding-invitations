import { INVITATION_CHANNEL, RSVP_STATUS } from "../config/constants.js";

export const LOCAL_ADMIN_CREDENTIALS = Object.freeze({
  username: "admin",
  password: "BodaAdmin2026!",
});

export const LOCAL_ACCESS_TOKEN =
  "local-wedding-admin-access-token-2026-demo";

export const localAdminUser = Object.freeze({
  id: "d45dd70f-98a2-4da4-a32a-4b0c9fdc9456",
  username: "admin",
  displayName: "Administración de la boda",
  roles: ["ADMIN"],
});

export const defaultWeddingConfig = Object.freeze({
  id: "5f4378f1-d75e-42af-965f-d4bba407a445",
  version: 1,
  coupleDisplayName: "Gerardo & Raquel",
  presentationText:
    "Con mucha alegría queremos compartir contigo el comienzo de nuestra nueva historia.",
  weddingDateTime: "2026-08-15T17:00:00-06:00",
  timeZone: "America/Mexico_City",
  address: {
    venueName: "San Andrés Timilpan.",
    formattedAddress:
      "Camino Real 120, San Miguel de Allende, Guanajuato",
    mapEmbedUrl:
      "https://www.google.com/maps?q=San%20Miguel%20de%20Allende&output=embed",
    mapsNavigationUrl:
      "https://www.google.com/maps/search/?api=1&query=San+Miguel+de+Allende",
  },
  photos: [
    {
      id: "photo-1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      altText: "Pareja de recién casados caminando al aire libre",
      sortOrder: 0,
    },
    {
      id: "photo-2",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      altText: "Celebración de boda rodeada de flores y naturaleza",
      sortOrder: 1,
    },
    {
      id: "photo-3",
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
      altText: "Manos de la pareja mostrando sus anillos de boda",
      sortOrder: 2,
    },
    {
      id: "photo-4",
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
      altText: "Novios abrazándose durante una ceremonia al atardecer",
      sortOrder: 3,
    },
  ],
  audio: {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    title: "Nuestra canción",
    artist: "Música de demostración",
    autoplay: true,
    loop: true,
  },
  updatedAt: "2026-07-10T20:00:00-06:00",
});

export const defaultInvitations = Object.freeze([
  {
    id: "87cc4a8b-8103-43e7-b8f5-c965c560a51a",
    recipientName: "Ana López",
    publicToken: "11111111-1111-4111-8111-111111111111",
    clientRequestId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    status: RSVP_STATUS.PENDING,
    channel: INVITATION_CHANNEL.WHATSAPP,
    createdAt: "2026-07-10T18:00:00-06:00",
    respondedAt: null,
    active: true,
  },
  {
    id: "4e95c7b4-431a-422e-a297-8f020776eb48",
    recipientName: "Carlos Méndez",
    publicToken: "22222222-2222-4222-8222-222222222222",
    clientRequestId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
    status: RSVP_STATUS.CONFIRMED,
    channel: INVITATION_CHANNEL.COPY_LINK,
    createdAt: "2026-07-09T14:15:00-06:00",
    respondedAt: "2026-07-10T09:30:00-06:00",
    active: true,
  },
  {
    id: "f57ba74a-2531-44df-bf41-07c744771904",
    recipientName: "Sofía Hernández",
    publicToken: "33333333-3333-4333-8333-333333333333",
    clientRequestId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
    status: RSVP_STATUS.DECLINED,
    channel: INVITATION_CHANNEL.OTHER,
    createdAt: "2026-07-08T11:00:00-06:00",
    respondedAt: "2026-07-09T19:45:00-06:00",
    active: true,
  },
]);
