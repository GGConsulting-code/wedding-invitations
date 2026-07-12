import { z } from "zod";
import {
  createInvitationRequestSchema,
  loginRequestSchema,
  rsvpRequestSchema,
  weddingConfigUpdateRequestSchema,
} from "./apiSchemas.js";

export const loginFormSchema = loginRequestSchema;

export const weddingConfigFormSchema = weddingConfigUpdateRequestSchema.extend({
  weddingDateTime: z.string().min(1, "La fecha y hora son obligatorias."),
});

export const generateInvitationFormSchema = createInvitationRequestSchema.pick({
  recipientName: true,
});

export const rsvpFormSchema = rsvpRequestSchema;
