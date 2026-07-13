import { INVITATION_CHANNEL, RSVP_STATUS } from "../config/constants.js";
import { LOCAL_MEDIA } from "../config/localMedia.js";

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
  coupleDisplayName: "Raquel & Gerardo", 
  presentationText:
    "Con mucha alegría queremos compartir contigo el comienzo de nuestra nueva historia.",
  weddingDateTime: "2026-08-15T16:00:00-06:00",
  timeZone: "America/Mexico_City",
  address: {
    venueName: "San Andrés Timilpan.",
    formattedAddress:
      "V7RC+3CC Primera Manzana Barrio de Hidalgo, State of Mexico",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d265.05754751985666!2d-99.72905325404876!3d19.890176789486475!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2smx!4v1783911799442!5m2!1sen!2smx",
    mapsNavigationUrl:
      "https://maps.app.goo.gl/ZcWP4mik7jzUHnKj9",
  },
  photos: [
    {
      id: "photo-main",
      url: LOCAL_MEDIA.heroPhoto,
      altText: "Fotografía principal de los novios",
      sortOrder: 0,
    },
    ...LOCAL_MEDIA.galleryPhotos.map((url, index) => ({
      id: `photo-carousel-${index + 1}`,
      url,
      altText: `Fotografía ${index + 1} de la historia de los novios`,
      sortOrder: index + 1,
    })),
  ],
  audio: {
    url: LOCAL_MEDIA.audio,
    title: "Photograph",
    artist: "Nuestra canción",
    autoplay: true,
    loop: true,
  },
  updatedAt: "2026-07-10T20:00:00-06:00",
});

export const defaultInvitations = Object.freeze([
  {
    id: "87cc4a8b-8103-43e7-b8f5-c965c560a51a",
    recipientName: "García de la Cruz",
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
    recipientName: "Vertiz Santiago",
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
