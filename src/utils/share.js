import { copyText } from "./clipboard.js";

export const canUseWebShare = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

export const shareInvitation = async ({ title, text, url }) => {
  if (!url) throw new TypeError("Se requiere la URL de la invitación.");

  if (canUseWebShare()) {
    try {
      await navigator.share({ title, text, url });
      return { method: "share", shared: true };
    } catch (error) {
      if (error?.name === "AbortError") return { method: "share", shared: false };
    }
  }

  await copyText(url);
  return { method: "clipboard", shared: true };
};
