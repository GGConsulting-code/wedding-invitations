"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBlocker, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Flower2,
  LogOut,
  Menu,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react";
import { DEFAULT_INVITATION_QUERY } from "../../../config/constants";
import { logoutUser } from "../../../store/actions/authActions";
import {
  createInvitation,
  fetchAttendanceSummary,
  fetchInvitations,
} from "../../../store/actions/invitationActions";
import {
  fetchWeddingConfig,
  updateWeddingConfig,
} from "../../../store/actions/weddingConfigActions";
import { selectAuthUser } from "../../../store/selectors/authSelectors";
import {
  selectAttendanceError,
  selectAttendanceStatus,
  selectAttendanceSummary,
  selectInvitationListError,
  selectInvitationListStatus,
  selectInvitationPagination,
  selectInvitations,
} from "../../../store/selectors/invitationSelectors";
import {
  selectIsWeddingConfigSaving,
  selectWeddingConfig,
  selectWeddingConfigFetchError,
  selectWeddingConfigFetchStatus,
} from "../../../store/selectors/weddingSelectors";
import { AppButton } from "../../../components/common/AppButton";
import { ErrorState } from "../../../components/common/ErrorState";
import { LoadingState } from "../../../components/common/LoadingState";
import { AttendanceSummary } from "../components/AttendanceSummary";
import { GenerateInvitationDialog } from "../components/GenerateInvitationDialog";
import { GeneratedInvitationsTable } from "../components/GeneratedInvitationsTable";
import { WeddingSettingsForm } from "../components/WeddingSettingsForm";

const initialQuery = {
  ...DEFAULT_INVITATION_QUERY,
  status: "",
  search: "",
};

export function AdminDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const weddingConfig = useSelector(selectWeddingConfig);
  const weddingFetchStatus = useSelector(selectWeddingConfigFetchStatus);
  const weddingFetchError = useSelector(selectWeddingConfigFetchError);
  const isSavingConfig = useSelector(selectIsWeddingConfigSaving);
  const attendance = useSelector(selectAttendanceSummary);
  const attendanceStatus = useSelector(selectAttendanceStatus);
  const attendanceError = useSelector(selectAttendanceError);
  const invitations = useSelector(selectInvitations);
  const invitationPagination = useSelector(selectInvitationPagination);
  const invitationStatus = useSelector(selectInvitationListStatus);
  const invitationError = useSelector(selectInvitationListError);
  const [query, setQuery] = useState(initialQuery);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigationBlocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isGenerateOpen && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!isGenerateOpen && navigationBlocker.state === "blocked") {
      navigationBlocker.reset();
    }
  }, [isGenerateOpen, navigationBlocker]);

  useEffect(() => {
    const configRequest = dispatch(fetchWeddingConfig());
    const attendanceRequest = dispatch(fetchAttendanceSummary());
    return () => {
      configRequest.abort();
      attendanceRequest.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    const request = dispatch(fetchInvitations(query));
    return () => request.abort();
  }, [dispatch, query]);

  const updateQuery = useCallback((changes) => {
    setQuery((current) => {
      const next = {
        ...current,
        ...changes,
        status:
          "status" in changes ? changes.status ?? "" : current.status ?? "",
        search: changes.search ?? ("search" in changes ? "" : current.search ?? ""),
      };
      return JSON.stringify(current) === JSON.stringify(next) ? current : next;
    });
  }, []);

  const saveConfig = (payload) => dispatch(updateWeddingConfig(payload)).unwrap();
  const reloadConfig = () => dispatch(fetchWeddingConfig()).unwrap();

  const createNewInvitation = (payload) =>
    dispatch(createInvitation(payload)).unwrap();

  const refreshAfterCreate = () => {
    dispatch(fetchInvitations(query));
    dispatch(fetchAttendanceSummary());
  };

  const logout = async () => {
    if (isGenerateOpen || isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // logoutUser always clears the local session, even if revocation fails.
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f3f2] text-[#34232c]">
      <header className="sticky top-0 z-30 border-b border-[#e6dade] bg-[#fffdfb]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#5d2348] text-white shadow-lg">
              <Flower2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-[#3d2733]">Nuestra boda</p>
              <p className="text-xs text-[#826d78]">Panel administrativo</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#49313e]">
                {user?.displayName ?? user?.username ?? "Administrador"}
              </p>
              <p className="text-xs text-[#8a7480]">Rol administrador</p>
            </div>
            <AppButton
              variant="ghost"
              size="sm"
              onClick={logout}
              isLoading={isLoggingOut}
              disabled={isGenerateOpen}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Salir
            </AppButton>
          </div>

          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full border border-[#dfd2d7] bg-white text-[#5e3c50] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a496c] sm:hidden"
            onClick={() => setMobileNavOpen((value) => !value)}
            aria-label="Mostrar opciones de cuenta"
            aria-expanded={mobileNavOpen}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
        {mobileNavOpen ? (
          <div className="border-t border-[#eee3e7] bg-white px-5 py-4 sm:hidden">
            <p className="text-sm font-semibold text-[#49313e]">
              {user?.displayName ?? user?.username ?? "Administrador"}
            </p>
            <AppButton
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={logout}
              isLoading={isLoggingOut}
              disabled={isGenerateOpen}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Cerrar sesión
            </AppButton>
          </div>
        ) : null}
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#4e1f3e] px-6 py-8 text-white shadow-[0_20px_70px_rgba(78,31,62,0.2)] sm:px-9 sm:py-10"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-[#d8bf79]/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                <Sparkles className="size-4 text-[#e6ca82]" aria-hidden="true" />
                Todo listo para compartir
              </span>
              <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
                Hola, {user?.displayName?.split(" ")?.[0] ?? "Administrador"}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                Revisa las confirmaciones, mantén actualizados los detalles y crea
                un enlace único para cada invitado.
              </p>
            </div>
            <AppButton
              size="lg"
              className="shrink-0 bg-[#e5c77c] text-[#462139] hover:bg-[#efd996] focus-visible:ring-[#f0d995]"
              onClick={() => setIsGenerateOpen(true)}
            >
              <Plus className="size-5" aria-hidden="true" />
              Generar invitación
            </AppButton>
          </div>
        </motion.section>

        <div className="mt-9">
          <AttendanceSummary
            summary={attendance}
            status={attendanceStatus}
            error={attendanceError}
            onRetry={() => dispatch(fetchAttendanceSummary())}
          />
        </div>

        <div className="mt-9 grid items-start gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(34rem,0.95fr)]">
          <div>
            {weddingFetchStatus === "loading" && !weddingConfig ? (
              <LoadingState label="Cargando configuración…" />
            ) : null}
            {weddingFetchStatus === "failed" && !weddingConfig ? (
              <ErrorState
                message={weddingFetchError?.message}
                traceId={weddingFetchError?.traceId}
                onRetry={() => dispatch(fetchWeddingConfig())}
              />
            ) : null}
            {weddingConfig ? (
              <WeddingSettingsForm
                config={weddingConfig}
                isSaving={isSavingConfig}
                onSave={saveConfig}
                onReload={reloadConfig}
              />
            ) : null}
          </div>

          <div className="xl:sticky xl:top-28">
            <GeneratedInvitationsTable
              invitations={invitations}
              pagination={invitationPagination}
              query={query}
              status={invitationStatus}
              error={invitationError}
              timeZone={weddingConfig?.timeZone}
              onQueryChange={updateQuery}
              onRetry={() => dispatch(fetchInvitations(query))}
            />
          </div>
        </div>

        <footer className="mt-10 flex items-center justify-center gap-2 py-4 text-xs text-[#8c7681]">
          <Settings2 className="size-4" aria-hidden="true" />
          Los cambios se sincronizan con la respuesta canónica del servidor.
        </footer>
      </div>

      {isGenerateOpen ? (
        <GenerateInvitationDialog
          open
          onCreate={createNewInvitation}
          onCreated={refreshAfterCreate}
          onAccept={() => setIsGenerateOpen(false)}
        />
      ) : null}
    </main>
  );
}
