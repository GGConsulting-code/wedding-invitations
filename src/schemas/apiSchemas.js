import { z } from "zod";

const dateTimeSchema = z.string().datetime({ offset: true });
const uuidSchema = z.string().uuid();
const httpsUrlSchema = z.string().url().regex(/^https:\/\//, "La URL debe usar HTTPS.");

export const rsvpStatusSchema = z.enum(["PENDING", "CONFIRMED", "DECLINED"]);
export const roleSchema = z.enum(["ADMIN"]);
export const invitationChannelSchema = z.enum(["WHATSAPP", "COPY_LINK", "OTHER"]);

export const fieldErrorSchema = z
  .object({
    field: z.string().nullable().optional(),
    code: z.string(),
    message: z.string(),
  })
  .strict();

export const apiMetaSchema = z.object({}).catchall(z.unknown()).nullable();

export const baseEnvelopeSchema = z
  .object({
    success: z.boolean(),
    code: z.string(),
    message: z.string(),
    errors: z.array(fieldErrorSchema),
    meta: apiMetaSchema.optional(),
    timestamp: dateTimeSchema,
    traceId: uuidSchema,
  })
  .passthrough();

export const errorResponseSchema = baseEnvelopeSchema
  .extend({
    success: z.literal(false),
    data: z.null(),
  })
  .passthrough();

export const emptySuccessResponseSchema = baseEnvelopeSchema
  .extend({
    success: z.literal(true),
    data: z.object({}).strict(),
  })
  .passthrough();

export const loginRequestSchema = z
  .object({
    username: z.string().min(3).max(80),
    password: z.string().min(8).max(128),
  })
  .strict();

export const userSchema = z
  .object({
    id: uuidSchema,
    username: z.string(),
    displayName: z.string(),
    roles: z.array(roleSchema).min(1),
  })
  .strict();

export const authDataSchema = z
  .object({
    accessToken: z.string().min(20),
    tokenType: z.literal("Bearer"),
    expiresIn: z.number().int().min(60),
    user: userSchema,
  })
  .strict();

export const loginResponseSchema = baseEnvelopeSchema
  .extend({ success: z.literal(true), data: authDataSchema })
  .passthrough();

export const currentUserResponseSchema = baseEnvelopeSchema
  .extend({
    success: z.literal(true),
    data: z.object({ user: userSchema }).passthrough(),
  })
  .passthrough();

export const addressSchema = z
  .object({
    venueName: z.string().min(2).max(160),
    formattedAddress: z.string().min(5).max(300),
    mapEmbedUrl: httpsUrlSchema.optional(),
    mapsNavigationUrl: httpsUrlSchema,
  })
  .strict();

export const photoSchema = z
  .object({
    id: z.string().min(1).max(80),
    url: httpsUrlSchema,
    altText: z.string().min(1).max(180),
    sortOrder: z.number().int().min(0),
  })
  .strict();

export const audioSchema = z
  .object({
    url: httpsUrlSchema,
    title: z.string().max(120).optional(),
    artist: z.string().max(120).optional(),
    autoplay: z.boolean(),
    loop: z.boolean(),
  })
  .strict();

const weddingEditableShape = {
  version: z.number().int().min(1),
  coupleDisplayName: z.string().min(2).max(160),
  presentationText: z.string().min(10).max(1200),
  weddingDateTime: dateTimeSchema,
  timeZone: z.string(),
  address: addressSchema,
  photos: z.array(photoSchema).max(20),
  audio: audioSchema,
};

export const weddingConfigUpdateRequestSchema = z.object(weddingEditableShape).strict();

export const weddingConfigSchema = z
  .object({
    id: uuidSchema,
    ...weddingEditableShape,
    updatedAt: dateTimeSchema,
  })
  .strict();

export const weddingConfigResponseSchema = baseEnvelopeSchema
  .extend({ success: z.literal(true), data: weddingConfigSchema })
  .passthrough();

export const attendanceSummarySchema = z
  .object({
    confirmed: z.number().int().min(0),
    declined: z.number().int().min(0),
    pending: z.number().int().min(0),
    total: z.number().int().min(0),
  })
  .strict();

export const attendanceSummaryResponseSchema = baseEnvelopeSchema
  .extend({ success: z.literal(true), data: attendanceSummarySchema })
  .passthrough();

export const invitationSchema = z
  .object({
    id: uuidSchema,
    recipientName: z.string().min(2).max(160),
    publicUrl: z.string().url(),
    status: rsvpStatusSchema,
    channel: invitationChannelSchema,
    createdAt: dateTimeSchema,
    respondedAt: dateTimeSchema.nullable(),
  })
  .strict();

export const createInvitationRequestSchema = z
  .object({
    recipientName: z.string().min(2).max(160),
    publicToken: uuidSchema,
    channel: invitationChannelSchema,
    clientRequestId: uuidSchema,
  })
  .strict();

export const invitationResponseSchema = baseEnvelopeSchema
  .extend({ success: z.literal(true), data: invitationSchema })
  .passthrough();

export const paginationMetaSchema = z
  .object({
    page: z.number().int().min(0),
    size: z.number().int().min(1),
    totalElements: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    first: z.boolean(),
    last: z.boolean(),
  })
  .strict();

export const invitationListResponseSchema = baseEnvelopeSchema
  .extend({
    success: z.literal(true),
    data: z.array(invitationSchema),
    meta: z.object({ pagination: paginationMetaSchema }).passthrough(),
  })
  .passthrough();

const publicInvitationRecipientSchema = z
  .object({ recipientName: z.string(), status: rsvpStatusSchema })
  .strict();

const publicEventSchema = z
  .object({
    coupleDisplayName: z.string(),
    presentationText: z.string(),
    weddingDateTime: dateTimeSchema,
    timeZone: z.string(),
    address: addressSchema,
    photos: z.array(photoSchema),
    audio: audioSchema,
  })
  .strict();

export const publicInvitationDataSchema = z
  .object({
    invitation: publicInvitationRecipientSchema,
    event: publicEventSchema,
  })
  .strict();

export const publicInvitationResponseSchema = baseEnvelopeSchema
  .extend({ success: z.literal(true), data: publicInvitationDataSchema })
  .passthrough();

export const rsvpRequestSchema = z
  .object({
    status: z.enum(["CONFIRMED", "DECLINED"]),
    respondedAtClient: dateTimeSchema.nullable().optional(),
  })
  .strict();

export const rsvpDataSchema = z
  .object({ status: rsvpStatusSchema, respondedAt: dateTimeSchema })
  .strict();

export const rsvpResponseSchema = baseEnvelopeSchema
  .extend({ success: z.literal(true), data: rsvpDataSchema })
  .passthrough();

export const apiSchemas = Object.freeze({
  errorResponse: errorResponseSchema,
  loginRequest: loginRequestSchema,
  loginResponse: loginResponseSchema,
  currentUserResponse: currentUserResponseSchema,
  emptySuccessResponse: emptySuccessResponseSchema,
  weddingConfig: weddingConfigSchema,
  weddingConfigUpdateRequest: weddingConfigUpdateRequestSchema,
  weddingConfigResponse: weddingConfigResponseSchema,
  attendanceSummaryResponse: attendanceSummaryResponseSchema,
  createInvitationRequest: createInvitationRequestSchema,
  invitationResponse: invitationResponseSchema,
  invitationListResponse: invitationListResponseSchema,
  publicInvitationResponse: publicInvitationResponseSchema,
  rsvpRequest: rsvpRequestSchema,
  rsvpResponse: rsvpResponseSchema,
});

export { dateTimeSchema, httpsUrlSchema, uuidSchema };
