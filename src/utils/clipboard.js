const legacyCopy = (text) => {
  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
};

export const copyText = async (value) => {
  const text = String(value ?? "");
  if (!text) throw new TypeError("No hay texto para copiar.");

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Clipboard can be denied outside a trusted user gesture; use the DOM fallback.
    }
  }

  if (legacyCopy(text)) return true;
  throw new Error("No fue posible copiar el texto al portapapeles.");
};

export const copyToClipboard = copyText;
export { legacyCopy };
