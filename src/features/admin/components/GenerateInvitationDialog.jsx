"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Clipboard,
  Copy,
  Link2,
  Send,
  Share2,
  Sparkles,
} from "lucide-react";
import { INVITATION_CHANNEL } from "../../../config/constants";
import { AppButton } from "../../../components/common/AppButton";
import { AppInput } from "../../../components/common/AppInput";
import { copyText } from "../../../utils/clipboard";
import { buildInvitationUrl } from "../../../utils/invitationUrl";
import { shareInvitation } from "../../../utils/share";

const invitationFormSchema = z.object({
  recipientName: z
    .string()
    .trim()
    .min(2, "Escribe el nombre de la persona, pareja o familia.")
    .max(160, "Usa máximo 160 caracteres."),
});

function createUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Este navegador no puede generar un enlace seguro.");
  }
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

export function GenerateInvitationDialog({
  open,
  onAccept,
  onCreate,
  onCreated,
}) {
  const recipientInputRef = useRef(null);
  const [publicToken] = useState(() => createUuid());
  const [clientRequestId] = useState(() => createUuid());
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: { recipientName: "" },
    mode: "onBlur",
  });

  const preliminaryUrl = useMemo(
    () => buildInvitationUrl(publicToken),
    [publicToken],
  );
  const displayedUrl = canonicalUrl || preliminaryUrl;

  useEffect(() => {
    if (!open) return undefined;
    const preventAccidentalUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", preventAccidentalUnload);
    return () => window.removeEventListener("beforeunload", preventAccidentalUnload);
  }, [open]);

  const copyUrl = async () => {
    try {
      await copyText(displayedUrl);
      setFeedback({ type: "success", message: "Enlace copiado." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message ?? "No fue posible copiar el enlace.",
      });
    }
  };

  const shareUrl = async () => {
    try {
      const result = await shareInvitation({
        title: "Invitación de boda",
        text: "Tenemos una invitación muy especial para ti.",
        url: displayedUrl,
      });
      if (result.shared) {
        setFeedback({
          type: "success",
          message:
            result.method === "clipboard"
              ? "Enlace copiado."
              : "Invitación compartida.",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message ?? "No fue posible compartir el enlace.",
      });
    }
  };

  const persistInvitation = async ({ recipientName }) => {
    if (isSaving) return;
    setIsSaving(true);
    setFeedback(null);
    try {
      const result = await onCreate({
        recipientName: recipientName.trim(),
        publicToken,
        channel: INVITATION_CHANNEL.WHATSAPP,
        clientRequestId,
      });
      const createdInvitation = result?.data ?? result;
      if (!createdInvitation?.publicUrl) {
        throw new Error("El servidor no devolvió la URL canónica.");
      }
      setCanonicalUrl(createdInvitation.publicUrl);
      onCreated?.(createdInvitation);
      onAccept?.(createdInvitation);
    } catch (error) {
      const recipientError = error?.fieldErrors?.recipientName;
      if (recipientError) {
        setError("recipientName", {
          type: "server",
          message: Array.isArray(recipientError)
            ? recipientError[0]
            : recipientError,
        });
      }
      setFeedback({
        type: "error",
        message:
          error?.message ??
          "No pudimos guardar la invitación. El diálogo permanecerá abierto.",
        traceId: error?.traceId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const recipientRegistration = register("recipientName");

  return (
    <Dialog.Root open={open} onOpenChange={() => {}} modal>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-[#24131d]/65 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              onEscapeKeyDown={(event) => event.preventDefault()}
              onPointerDownOutside={(event) => event.preventDefault()}
              onInteractOutside={(event) => event.preventDefault()}
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                recipientInputRef.current?.focus();
              }}
            >
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-white/60 bg-[#fffdfb] p-5 shadow-2xl outline-none sm:p-7"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex items-start gap-4">
                  <span className="rounded-full bg-[#f3e6ec] p-3 text-[#6c3655]">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <Dialog.Title className="text-2xl font-semibold text-[#392330]">
                      Generar invitación
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm leading-6 text-[#78636e]">
                      El enlace será único. Solo quedará guardado cuando pulses
                      Aceptar y el servidor confirme el alta.
                    </Dialog.Description>
                  </div>
                </div>

                <form
                  className="mt-6 space-y-5"
                  noValidate
                  onSubmit={handleSubmit(persistInvitation)}
                >
                  <AppInput
                    ref={(element) => {
                      recipientRegistration.ref(element);
                      recipientInputRef.current = element;
                    }}
                    label="¿A quién va dirigida?"
                    placeholder="Familia Hernández"
                    required
                    maxLength={160}
                    autoComplete="off"
                    disabled={isSaving}
                    error={errors.recipientName?.message}
                    onBlur={recipientRegistration.onBlur}
                    onChange={recipientRegistration.onChange}
                    name={recipientRegistration.name}
                  />

                  <div className="rounded-3xl border border-[#dfd1d7] bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#4b3040]">
                      <Link2 className="size-4" aria-hidden="true" />
                      URL individual
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#f6f1f3] p-2 pl-3">
                      <input
                        readOnly
                        value={displayedUrl}
                        aria-label="URL individual de la invitación"
                        className="min-w-0 flex-1 bg-transparent text-xs text-[#5f4b56] outline-none sm:text-sm"
                        onFocus={(event) => event.currentTarget.select()}
                      />
                      <button
                        type="button"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#623750] shadow-sm transition hover:bg-[#fceff4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a496c]"
                        aria-label="Copiar URL"
                        onClick={copyUrl}
                      >
                        <Copy className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#806c77]">
                      Token opaco: <span className="font-mono">{publicToken}</span>
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <AppButton
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={copyUrl}
                    >
                      <Clipboard className="size-4" aria-hidden="true" />
                      Copiar URL
                    </AppButton>
                    <AppButton
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={shareUrl}
                    >
                      <Share2 className="size-4" aria-hidden="true" />
                      Compartir
                    </AppButton>
                  </div>

                  {feedback ? (
                    <div
                      role={feedback.type === "error" ? "alert" : "status"}
                      className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm leading-5 ${
                        feedback.type === "error"
                          ? "border-[#ecc8cf] bg-[#fff4f5] text-[#8a2e41]"
                          : "border-[#bdd7c3] bg-[#eff8f1] text-[#326442]"
                      }`}
                    >
                      {feedback.type === "error" ? (
                        <Send className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      ) : (
                        <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      )}
                      <span>
                        {feedback.message}
                        {feedback.traceId ? (
                          <span className="mt-1 block break-all text-xs opacity-75">
                            Referencia: {feedback.traceId}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  ) : null}

                  <div className="border-t border-[#eee3e7] pt-5">
                    <AppButton
                      type="submit"
                      size="lg"
                      className="w-full"
                      isLoading={isSaving}
                    >
                      {isSaving ? "Guardando invitación…" : "Aceptar"}
                    </AppButton>
                    <p className="mt-3 text-center text-xs leading-5 text-[#806c77]">
                      Este es el único control que cierra el diálogo y lo hará
                      después de una respuesta exitosa.
                    </p>
                  </div>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
