"use client";

const statusStyles = {
  PENDING: {
    label: "Pendiente",
    className: "border-[#e5cf9e] bg-[#fff7df] text-[#765716]",
    dot: "bg-[#c99c35]",
  },
  CONFIRMED: {
    label: "Confirmada",
    className: "border-[#bcd7c2] bg-[#edf8ef] text-[#2f6740]",
    dot: "bg-[#4f9563]",
  },
  DECLINED: {
    label: "No asistirá",
    className: "border-[#e7c3ca] bg-[#fff0f2] text-[#8c3144]",
    dot: "bg-[#bd5268]",
  },
};

export function StatusBadge({ status, className = "" }) {
  const config = statusStyles[status] ?? {
    label: status || "Sin estado",
    className: "border-[#d8d1d4] bg-[#f5f2f3] text-[#65575e]",
    dot: "bg-[#92858b]",
  };

  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}

