"use client";

import { motion } from "motion/react";
import { CheckCircle2, Clock3, UsersRound, XCircle } from "lucide-react";
import { EmptyState } from "../../../components/common/EmptyState";
import { ErrorState } from "../../../components/common/ErrorState";
import { LoadingState } from "../../../components/common/LoadingState";

const metrics = [
  {
    key: "confirmed",
    label: "Confirmadas",
    description: "Personas que compartirán el día con ustedes",
    icon: CheckCircle2,
    className: "border-[#c8dac8] bg-[#f0f7ef] text-[#2f6240]",
    iconClassName: "bg-[#dcecdc] text-[#356d47]",
  },
  {
    key: "declined",
    label: "No asistirán",
    description: "Respuestas declinadas",
    icon: XCircle,
    className: "border-[#ead0d5] bg-[#fff4f5] text-[#7a3444]",
    iconClassName: "bg-[#f6dfe3] text-[#994459]",
  },
  {
    key: "pending",
    label: "Pendientes",
    description: "Invitaciones por responder",
    icon: Clock3,
    className: "border-[#eadbb8] bg-[#fff9e9] text-[#725719]",
    iconClassName: "bg-[#f6e9c6] text-[#8b691d]",
  },
];

export function AttendanceSummary({
  summary,
  status,
  error,
  onRetry,
}) {
  if ((status === "idle" || status === "loading") && !summary) {
    return <LoadingState label="Calculando asistencias…" />;
  }

  if (status === "failed" && !summary) {
    return (
      <ErrorState
        message={error?.message}
        traceId={error?.traceId}
        onRetry={onRetry}
      />
    );
  }

  if (!summary) {
    return (
      <EmptyState
        title="Todavía no hay métricas"
        message="Las respuestas aparecerán cuando existan invitaciones registradas."
      />
    );
  }

  return (
    <section aria-labelledby="attendance-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a6d83]">
            Panorama de invitados
          </p>
          <h2
            id="attendance-title"
            className="mt-1 text-2xl font-semibold text-[#38212f]"
          >
            Confirmaciones de asistencia
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#dfd2d7] bg-white px-3 py-2 text-sm text-[#674d5b]">
          <UsersRound className="size-4" aria-hidden="true" />
          <span>
            Total: <strong className="text-[#3f2935]">{summary.total}</strong>
          </span>
        </div>
      </div>

      {status === "failed" ? (
        <ErrorState
          compact
          title="Mostramos los últimos datos disponibles"
          message={error?.message}
          traceId={error?.traceId}
          onRetry={onRetry}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.article
              key={metric.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className={`rounded-[1.75rem] border p-5 ${metric.className} ${
                metric.key === "confirmed" ? "md:-translate-y-1 md:shadow-lg" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{metric.label}</p>
                  <p className="mt-2 text-4xl font-semibold tabular-nums">
                    {summary[metric.key]}
                  </p>
                </div>
                <span className={`rounded-full p-2.5 ${metric.iconClassName}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 text-sm leading-5 opacity-80">
                {metric.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

