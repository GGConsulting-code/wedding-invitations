"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Flower2, ShieldCheck, Sparkles } from "lucide-react";
import { loginUser, restoreSession } from "../../../store/actions/authActions";
import { clearAuthError } from "../../../store/reducers/authSlice";
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAdmin,
  selectIsAuthenticated,
  selectSessionRestored,
} from "../../../store/selectors/authSelectors";
import { LoginForm } from "../components/LoginForm";

function requestedPath(location) {
  const from = location.state?.from;
  if (!from?.pathname) return "/administracion";
  return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
}

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isRestored = useSelector(selectSessionRestored);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    if (!isRestored) dispatch(restoreSession());
  }, [dispatch, isRestored]);

  useEffect(
    () => () => {
      dispatch(clearAuthError());
    },
    [dispatch],
  );

  const submit = async (credentials) => {
    dispatch(clearAuthError());
    try {
      await dispatch(loginUser(credentials)).unwrap();
      navigate(requestedPath(location), { replace: true });
    } catch {
      // Redux conserva el error normalizado y LoginForm lo anuncia.
    }
  };

  if (isRestored && isAuthenticated && isAdmin) {
    return <Navigate to={requestedPath(location)} replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f3f2] px-5 py-10 sm:px-8">
      <div
        className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-[#d9b8c6]/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -right-16 size-80 rounded-full bg-[#d8c697]/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl overflow-hidden rounded-[2.25rem] border border-white/70 bg-white shadow-[0_30px_100px_rgba(67,33,52,0.14)] lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative hidden overflow-hidden bg-[#4e1f3e] p-10 text-white lg:flex lg:flex-col lg:justify-between"
          aria-label="Bienvenida"
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 15%, rgba(239,211,219,.24), transparent 32%), radial-gradient(circle at 80% 85%, rgba(215,190,126,.22), transparent 35%)",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <Flower2 className="size-4" aria-hidden="true" />
              Invitaciones de boda
            </span>
          </div>
          <div className="relative max-w-md">
            <Sparkles className="mb-5 size-7 text-[#e6ca82]" aria-hidden="true" />
            <h1 className="text-4xl font-semibold leading-tight">
              Cada detalle, cada invitación, en un mismo lugar.
            </h1>
            <p className="mt-5 text-base leading-7 text-white/75">
              Administra la celebración con calma: personaliza el evento, comparte
              enlaces únicos y acompaña cada confirmación.
            </p>
          </div>
          <p className="relative text-xs uppercase tracking-[0.2em] text-white/55">
            Acceso exclusivo para administración
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.08 }}
          className="flex items-center px-5 py-10 sm:px-10 lg:px-12"
        >
          <div className="mx-auto w-full max-w-md">
            <div className="lg:hidden">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f3e7ec] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#653b53]">
                <Flower2 className="size-4" aria-hidden="true" />
                Invitaciones de boda
              </span>
            </div>
            <div className="mt-7 flex size-12 items-center justify-center rounded-2xl bg-[#f3e7ec] text-[#5d2348] lg:mt-0">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#9a6d83]">
              Sesión protegida
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#38212f]">
              Bienvenido de nuevo
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#78636e]">
              Ingresa tus credenciales para continuar al panel administrativo.
            </p>

            <div className="mt-8">
              <LoginForm
                onSubmit={submit}
                isLoading={status === "loading" || !isRestored}
                apiError={error}
              />
            </div>

            <p className="mt-7 text-center text-xs leading-5 text-[#8b7781]">
              La sesión se conserva únicamente durante esta pestaña del navegador.
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
