"use client";

import { Inbox } from "lucide-react";

export function EmptyState({
  title = "Aún no hay información",
  message = "Cuando haya datos disponibles aparecerán en esta sección.",
  action,
  className = "",
}) {
  return (
    <div
      className={`flex min-h-44 flex-col items-center justify-center rounded-3xl border border-dashed border-[#d9c8cf] bg-[#fffdfb] p-8 text-center ${className}`}
    >
      <span className="rounded-full bg-[#f5ecef] p-3 text-[#71425c]">
        <Inbox className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-semibold text-[#3e2734]">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-[#796570]">
        {message}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

