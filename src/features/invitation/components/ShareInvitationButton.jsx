"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { shareInvitation } from "../../../utils/share";

export function ShareInvitationButton({ coupleDisplayName, url }) {
  const [feedback, setFeedback] = useState("");
  const [method, setMethod] = useState(null);

  const handleShare = async () => {
    try {
      const result = await shareInvitation({
        title: `Boda de ${coupleDisplayName}`,
        text: "Acompáñanos a celebrar este día tan especial.",
        url,
      });

      if (!result.shared) return;
      setMethod(result.method);
      setFeedback(result.method === "clipboard" ? "Enlace copiado" : "Invitación compartida");
    } catch {
      setMethod(null);
      setFeedback("No pudimos compartir el enlace. Inténtalo de nuevo.");
    }
  };

  const Icon = method ? (method === "clipboard" ? Copy : Check) : Share2;

  return (
    <div className="invitation-share">
      <span className="invitation-share__feedback" role="status" aria-live="polite">
        {feedback}
      </span>
    </div>
  );
}
