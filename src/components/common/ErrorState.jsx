"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { AppButton } from "./AppButton";

export function ErrorState({
  title = "No pudimos cargar esta sección",
  message = "Inténtalo de nuevo en un momento.",
  traceId,
  onRetry,
  compact = false,
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`rounded-3xl border border-[#ecc8cf] bg-[#fff7f7] text-[#612b38] ${
        compact ? "p-4" : "p-6"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-full bg-[#f8dce1] p-2">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-[#79515b]">{message}</p>
          {traceId ? (
            <p className="mt-2 break-all text-xs text-[#8a6570]">
              Referencia: {traceId}
            </p>
          ) : null}
          {onRetry ? (
            <AppButton
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={onRetry}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reintentar
            </AppButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

