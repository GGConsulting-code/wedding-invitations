"use client";

import { LoaderCircle } from "lucide-react";

export function LoadingState({
  label = "Cargando información…",
  compact = false,
  className = "",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-3 rounded-3xl border border-[#eadde2] bg-white/90 text-[#604454] ${
        compact ? "min-h-24 p-4 text-sm" : "min-h-52 p-8"
      } ${className}`}
    >
      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

