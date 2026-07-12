"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { AppButton } from "../../../components/common/AppButton";
import { AppInput } from "../../../components/common/AppInput";

const loginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(80, "El usuario es demasiado largo."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(128, "La contraseña es demasiado larga."),
});

export function LoginForm({ onSubmit, isLoading = false, apiError }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
    mode: "onBlur",
  });

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Inicio de sesión administrativo"
    >
      <AppInput
        label="Usuario"
        autoComplete="username"
        placeholder="Escribe tu usuario"
        required
        error={errors.username?.message}
        leadingIcon={<UserRound className="size-4" aria-hidden="true" />}
        disabled={isLoading}
        {...register("username")}
      />

      <AppInput
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Escribe tu contraseña"
        required
        error={errors.password?.message}
        leadingIcon={<LockKeyhole className="size-4" aria-hidden="true" />}
        disabled={isLoading}
        trailingContent={
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-[#69495b] transition hover:bg-[#f5ecef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a496c]"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        }
        {...register("password")}
      />

      {apiError ? (
        <div
          role="alert"
          className="rounded-2xl border border-[#ecc8cf] bg-[#fff4f5] px-4 py-3 text-sm leading-6 text-[#8a2e41]"
        >
          <p className="font-semibold">No pudimos iniciar sesión</p>
          <p>{apiError.message ?? "Verifica tus datos e inténtalo de nuevo."}</p>
          {apiError.traceId ? (
            <p className="mt-1 break-all text-xs text-[#93606b]">
              Referencia: {apiError.traceId}
            </p>
          ) : null}
        </div>
      ) : null}

      <AppButton
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isLoading}
      >
        {isLoading ? "Validando acceso…" : "Entrar a administración"}
      </AppButton>
    </form>
  );
}
