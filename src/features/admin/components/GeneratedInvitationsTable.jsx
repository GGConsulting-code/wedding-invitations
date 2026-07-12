"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  LoaderCircle,
  Search,
} from "lucide-react";
import { AppButton } from "../../../components/common/AppButton";
import { EmptyState } from "../../../components/common/EmptyState";
import { ErrorState } from "../../../components/common/ErrorState";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { copyText } from "../../../utils/clipboard";

function formatDate(value, timeZone) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone,
    }).format(new Date(value));
  } catch {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }
}

function CopyUrlButton({ invitation, onCopied }) {
  const [isCopying, setIsCopying] = useState(false);

  const copy = async () => {
    setIsCopying(true);
    try {
      await copyText(invitation.publicUrl);
      onCopied(invitation.id, "Enlace copiado");
    } catch {
      onCopied(invitation.id, "No se pudo copiar");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#dfd2d7] bg-white px-3 text-xs font-semibold text-[#623b52] transition hover:bg-[#f8f0f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a496c] disabled:opacity-50"
      onClick={copy}
      disabled={isCopying}
      aria-label={`Copiar invitación para ${invitation.recipientName}`}
    >
      {isCopying ? (
        <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      Copiar
    </button>
  );
}

export function GeneratedInvitationsTable({
  invitations = [],
  pagination,
  query,
  status,
  error,
  timeZone = "America/Mexico_City",
  onQueryChange,
  onRetry,
}) {
  const [search, setSearch] = useState(query?.search ?? "");
  const [copyFeedback, setCopyFeedback] = useState(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if ((query?.search ?? "") !== search.trim()) {
        onQueryChange({ search: search.trim() || undefined, page: 0 });
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [onQueryChange, query?.search, search]);

  const notifyCopy = (id, message) => {
    setCopyFeedback({ id, message });
    window.setTimeout(() => {
      setCopyFeedback((current) => (current?.id === id ? null : current));
    }, 2200);
  };

  const page = pagination?.page ?? query?.page ?? 0;
  const size = pagination?.size ?? query?.size ?? 20;
  const totalPages = pagination?.totalPages ?? 0;
  const totalElements = pagination?.totalElements ?? invitations.length;
  const isLoading = status === "loading";

  return (
    <section
      aria-labelledby="invitations-title"
      className="rounded-[2rem] border border-[#e7dade] bg-white p-5 shadow-[0_18px_60px_rgba(77,41,61,0.07)] sm:p-7"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a6d83]">
            Enlaces individuales
          </p>
          <h2
            id="invitations-title"
            className="mt-1 text-2xl font-semibold text-[#38212f]"
          >
            Invitaciones generadas
          </h2>
        </div>
        <p className="text-sm text-[#755e6a]">
          {totalElements} {totalElements === 1 ? "registro" : "registros"}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="relative block">
          <span className="sr-only">Buscar por destinatario</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8e7381]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por destinatario"
            className="min-h-11 w-full rounded-2xl border border-[#dfd2d7] bg-white pl-10 pr-3 text-sm text-[#382733] outline-none transition placeholder:text-[#a28d97] focus:border-[#8a496c] focus:ring-2 focus:ring-[#8a496c]/20"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por estatus</span>
          <select
            value={query?.status ?? ""}
            onChange={(event) =>
              onQueryChange({ status: event.target.value || undefined, page: 0 })
            }
            className="min-h-11 w-full rounded-2xl border border-[#dfd2d7] bg-white px-3 text-sm text-[#49323f] outline-none transition focus:border-[#8a496c] focus:ring-2 focus:ring-[#8a496c]/20"
          >
            <option value="">Todos los estatus</option>
            <option value="PENDING">Pendiente</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="DECLINED">No asistirá</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div
          role="status"
          className="mt-4 flex items-center gap-2 text-sm text-[#715968]"
        >
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Actualizando resultados…
        </div>
      ) : null}

      {status === "failed" ? (
        <ErrorState
          compact
          className="mt-4"
          title={invitations.length ? "Mostramos los últimos resultados" : undefined}
          message={error?.message}
          traceId={error?.traceId}
          onRetry={onRetry}
        />
      ) : null}

      {!isLoading && status !== "failed" && invitations.length === 0 ? (
        <EmptyState
          className="mt-5"
          title="No encontramos invitaciones"
          message={
            search || query?.status
              ? "Prueba con otro nombre o cambia el filtro de estatus."
              : "Genera la primera invitación para verla aquí."
          }
        />
      ) : null}

      {invitations.length ? (
        <>
          <div className="mt-5 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[840px] border-separate border-spacing-0 text-left text-sm">
              <caption className="sr-only">
                Invitaciones individuales con destinatario, estatus, enlace y fechas
              </caption>
              <thead>
                <tr className="text-xs uppercase tracking-wide text-[#806875]">
                  <th scope="col" className="border-b border-[#e8dde1] px-3 py-3">
                    N.º
                  </th>
                  <th scope="col" className="border-b border-[#e8dde1] px-3 py-3">
                    Dirigida a
                  </th>
                  <th scope="col" className="border-b border-[#e8dde1] px-3 py-3">
                    Estatus
                  </th>
                  <th scope="col" className="border-b border-[#e8dde1] px-3 py-3">
                    URL
                  </th>
                  <th scope="col" className="border-b border-[#e8dde1] px-3 py-3">
                    Generada
                  </th>
                  <th scope="col" className="border-b border-[#e8dde1] px-3 py-3">
                    Respuesta
                  </th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation, index) => (
                  <tr key={invitation.id} className="group">
                    <td className="border-b border-[#f0e8eb] px-3 py-4 tabular-nums text-[#806b76]">
                      {page * size + index + 1}
                    </td>
                    <th
                      scope="row"
                      className="border-b border-[#f0e8eb] px-3 py-4 font-semibold text-[#44303b]"
                    >
                      {invitation.recipientName}
                    </th>
                    <td className="border-b border-[#f0e8eb] px-3 py-4">
                      <StatusBadge status={invitation.status} />
                    </td>
                    <td className="border-b border-[#f0e8eb] px-3 py-4">
                      <div className="flex items-center gap-2">
                        <CopyUrlButton
                          invitation={invitation}
                          onCopied={notifyCopy}
                        />
                        {copyFeedback?.id === invitation.id ? (
                          <span role="status" className="text-xs text-[#6c5562]">
                            {copyFeedback.message}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="border-b border-[#f0e8eb] px-3 py-4 text-[#65515d]">
                      {formatDate(invitation.createdAt, timeZone)}
                    </td>
                    <td className="border-b border-[#f0e8eb] px-3 py-4 text-[#65515d]">
                      {formatDate(invitation.respondedAt, timeZone)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 space-y-3 md:hidden">
            {invitations.map((invitation, index) => (
              <motion.article
                key={invitation.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-[#e5d8dd] bg-[#fffdfc] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#8c7480]">
                      Invitación {page * size + index + 1}
                    </p>
                    <h3 className="mt-1 font-semibold text-[#432d39]">
                      {invitation.recipientName}
                    </h3>
                  </div>
                  <StatusBadge status={invitation.status} />
                </div>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[#8d7481]">
                      Generada
                    </dt>
                    <dd className="mt-1 text-[#5f4b56]">
                      {formatDate(invitation.createdAt, timeZone)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[#8d7481]">
                      Respuesta
                    </dt>
                    <dd className="mt-1 text-[#5f4b56]">
                      {formatDate(invitation.respondedAt, timeZone)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-center gap-2">
                  <CopyUrlButton invitation={invitation} onCopied={notifyCopy} />
                  {copyFeedback?.id === invitation.id ? (
                    <span role="status" className="text-xs text-[#6c5562]">
                      {copyFeedback.message}
                    </span>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </>
      ) : null}

      {invitations.length || totalPages > 0 ? (
        <nav
          className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee3e7] pt-5"
          aria-label="Paginación de invitaciones"
        >
          <p className="text-sm text-[#745e69]">
            Página <strong>{totalPages ? page + 1 : 0}</strong> de{" "}
            <strong>{totalPages}</strong>
          </p>
          <div className="flex gap-2">
            <AppButton
              variant="secondary"
              size="sm"
              onClick={() => onQueryChange({ page: Math.max(0, page - 1) })}
              disabled={page <= 0 || isLoading}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Anterior
            </AppButton>
            <AppButton
              variant="secondary"
              size="sm"
              onClick={() => onQueryChange({ page: page + 1 })}
              disabled={page + 1 >= totalPages || isLoading}
            >
              Siguiente
              <ChevronRight className="size-4" aria-hidden="true" />
            </AppButton>
          </div>
        </nav>
      ) : null}
    </section>
  );
}
