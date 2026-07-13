"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Music2,
  RefreshCw,
  Save,
  Sparkles,
} from "lucide-react";
import { AppButton } from "../../../components/common/AppButton";
import { AppInput } from "../../../components/common/AppInput";
import { AppTextarea } from "../../../components/common/AppTextarea";
import { ErrorState } from "../../../components/common/ErrorState";
import { PhotoUrlListEditor } from "./PhotoUrlListEditor";

const httpsUrl = (label, { optional = false } = {}) => {
  const schema = z
    .string()
    .trim()
    .refine(
      (value) => optional || value.length > 0,
      `${label} es obligatoria.`,
    )
    .refine((value) => {
      if (!value && optional) return true;
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    }, `${label} debe ser una URL HTTPS válida.`);
  return schema;
};


const mediaUrl = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatoria.`)
    .refine((value) => {
      if (value.startsWith("/")) return true;
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    }, `${label} debe ser una URL HTTPS o una ruta local que comience con /.`);

const weddingSettingsSchema = z.object({
  version: z.coerce.number().int().min(1),
  coupleDisplayName: z
    .string()
    .trim()
    .min(2, "Escribe los nombres que aparecerán en la invitación.")
    .max(160, "Usa máximo 160 caracteres."),
  presentationText: z
    .string()
    .trim()
    .min(10, "El texto de presentación debe tener al menos 10 caracteres.")
    .max(1200, "Usa máximo 1,200 caracteres."),
  weddingDateTime: z
    .string()
    .min(1, "Selecciona la fecha y hora de la boda."),
  timeZone: z.string().trim().min(1, "Escribe una zona horaria IANA válida."),
  address: z.object({
    venueName: z
      .string()
      .trim()
      .min(2, "Escribe el nombre del recinto.")
      .max(160, "Usa máximo 160 caracteres."),
    formattedAddress: z
      .string()
      .trim()
      .min(5, "Escribe la dirección completa.")
      .max(300, "Usa máximo 300 caracteres."),
    mapEmbedUrl: httpsUrl("La URL del mapa", { optional: true }),
    mapsNavigationUrl: httpsUrl("La URL de navegación"),
  }),
  photos: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        url: mediaUrl("La URL de la fotografía"),
        altText: z
          .string()
          .trim()
          .min(1, "Describe la fotografía.")
          .max(180, "Usa máximo 180 caracteres."),
        sortOrder: z.coerce.number().int().min(0),
      }),
    )
    .max(20, "Puedes agregar máximo 20 fotografías."),
  audio: z.object({
    url: mediaUrl("La URL del audio"),
    title: z.string().trim().max(120, "Usa máximo 120 caracteres."),
    artist: z.string().trim().max(120, "Usa máximo 120 caracteres."),
    autoplay: z.boolean(),
    loop: z.boolean(),
  }),
});

const pad = (value) => String(value).padStart(2, "0");

function getZonedParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
}

function getTimeZoneOffset(date, timeZone) {
  const parts = getZonedParts(date, timeZone);
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const instantWithoutMilliseconds = Math.floor(date.getTime() / 1000) * 1000;
  return representedAsUtc - instantWithoutMilliseconds;
}

function toLocalDateTime(isoDate, timeZone) {
  if (!isoDate) return "";
  try {
    const parts = getZonedParts(new Date(isoDate), timeZone);
    return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
  } catch {
    return String(isoDate).slice(0, 16);
  }
}

function zonedLocalToIso(localDateTime, timeZone) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(
    localDateTime,
  );
  if (!match) throw new Error("La fecha y hora no tienen un formato válido.");

  const [, year, month, day, hour, minute] = match.map(Number);
  const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let instant = desiredAsUtc;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const offset = getTimeZoneOffset(new Date(instant), timeZone);
    instant = desiredAsUtc - offset;
  }

  const roundTrip = getZonedParts(new Date(instant), timeZone);
  const expected = [year, month, day, hour, minute];
  const actual = [
    roundTrip.year,
    roundTrip.month,
    roundTrip.day,
    roundTrip.hour,
    roundTrip.minute,
  ];
  if (expected.some((value, index) => value !== actual[index])) {
    throw new Error(
      "Esa hora no existe en la zona seleccionada por un cambio de horario.",
    );
  }

  const offsetMinutes = Math.round(
    getTimeZoneOffset(new Date(instant), timeZone) / 60_000,
  );
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offset = `${sign}${pad(Math.floor(absoluteOffset / 60))}:${pad(
    absoluteOffset % 60,
  )}`;

  return `${localDateTime}:00${offset}`;
}

function toFormValues(config) {
  const timeZone = config?.timeZone || "America/Mexico_City";
  return {
    version: config?.version ?? 1,
    coupleDisplayName: config?.coupleDisplayName ?? "",
    presentationText: config?.presentationText ?? "",
    weddingDateTime: toLocalDateTime(config?.weddingDateTime, timeZone),
    timeZone,
    address: {
      venueName: config?.address?.venueName ?? "",
      formattedAddress: config?.address?.formattedAddress ?? "",
      mapEmbedUrl: config?.address?.mapEmbedUrl ?? "",
      mapsNavigationUrl: config?.address?.mapsNavigationUrl ?? "",
    },
    photos: (config?.photos ?? []).map((photo, index) => ({
      ...photo,
      sortOrder: index,
    })),
    audio: {
      url: config?.audio?.url ?? "",
      title: config?.audio?.title ?? "",
      artist: config?.audio?.artist ?? "",
      autoplay: config?.audio?.autoplay ?? true,
      loop: config?.audio?.loop ?? true,
    },
  };
}

function preparePayload(values) {
  const mapEmbedUrl = values.address.mapEmbedUrl.trim();
  const address = {
    venueName: values.address.venueName.trim(),
    formattedAddress: values.address.formattedAddress.trim(),
    mapsNavigationUrl: values.address.mapsNavigationUrl.trim(),
  };
  if (mapEmbedUrl) address.mapEmbedUrl = mapEmbedUrl;

  const audio = {
    url: values.audio.url.trim(),
    autoplay: values.audio.autoplay,
    loop: values.audio.loop,
  };
  if (values.audio.title.trim()) audio.title = values.audio.title.trim();
  if (values.audio.artist.trim()) audio.artist = values.audio.artist.trim();

  return {
    version: Number(values.version),
    coupleDisplayName: values.coupleDisplayName.trim(),
    presentationText: values.presentationText.trim(),
    weddingDateTime: zonedLocalToIso(
      values.weddingDateTime,
      values.timeZone.trim(),
    ),
    timeZone: values.timeZone.trim(),
    address,
    photos: values.photos.map((photo, index) => ({
      id: photo.id,
      url: photo.url.trim(),
      altText: photo.altText.trim(),
      sortOrder: index,
    })),
    audio,
  };
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="rounded-full bg-[#f3e8ed] p-2.5 text-[#6f3a58]">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-lg font-semibold text-[#432b38]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#796570]">{description}</p>
      </div>
    </div>
  );
}

function ToggleField({ id, label, description, register, disabled }) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#e3d6db] bg-white px-4 py-3"
    >
      <span>
        <span className="block text-sm font-semibold text-[#4a303e]">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-[#806c77]">
          {description}
        </span>
      </span>
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        className="size-5 shrink-0 accent-[#5d2348] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a496c] focus-visible:ring-offset-2"
        {...register}
      />
    </label>
  );
}

export function WeddingSettingsForm({
  config,
  onSave,
  onReload,
  isSaving = false,
}) {
  const defaultValues = useMemo(() => toFormValues(config), [config]);
  const [feedback, setFeedback] = useState(null);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(weddingSettingsSchema),
    defaultValues,
    values: defaultValues,
    mode: "onBlur",
  });

  const submit = async (values) => {
    setFeedback(null);
    let payload;
    try {
      payload = preparePayload(values);
    } catch (error) {
      setError("weddingDateTime", {
        type: "validate",
        message: error.message,
      });
      return;
    }

    try {
      const savedConfig = await onSave(payload);
      if (savedConfig) reset(toFormValues(savedConfig));
      setFeedback({ type: "success", message: "Los cambios quedaron guardados." });
    } catch (error) {
      const isConflict =
        error?.status === 409 || error?.code === "CONFIG_VERSION_CONFLICT";
      setFeedback({
        type: isConflict ? "conflict" : "error",
        message:
          error?.message ??
          "No pudimos guardar los cambios. Inténtalo de nuevo.",
        traceId: error?.traceId,
      });
    }
  };

  const reloadAfterConflict = async () => {
    try {
      const freshConfig = await onReload?.();
      if (freshConfig) reset(toFormValues(freshConfig));
      setFeedback(null);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message ?? "No pudimos recuperar la versión más reciente.",
        traceId: error?.traceId,
      });
    }
  };

  return (
    <section
      aria-labelledby="settings-title"
      className="rounded-[2rem] border border-[#e7dade] bg-white p-5 shadow-[0_18px_60px_rgba(77,41,61,0.07)] sm:p-7"
    >
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-[#eee3e7] pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a6d83]">
            Datos compartidos
          </p>
          <h2
            id="settings-title"
            className="mt-1 text-2xl font-semibold text-[#38212f]"
          >
            Configuración de la boda
          </h2>
        </div>
        <span className="rounded-full bg-[#f6eef1] px-3 py-1.5 text-xs font-semibold text-[#70445c]">
          Versión {config?.version ?? 1}
        </span>
      </div>

      <form noValidate onSubmit={handleSubmit(submit)} className="space-y-8">
        <input type="hidden" {...register("version", { valueAsNumber: true })} />

        <fieldset disabled={isSaving} className="space-y-5">
          <legend className="sr-only">Información principal</legend>
          <SectionHeading
            icon={Sparkles}
            title="Información principal"
            description="Estos textos se muestran a todas las personas invitadas."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <AppInput
              label="Nombres de la pareja"
              placeholder="Andrea & Daniel"
              required
              maxLength={160}
              error={errors.coupleDisplayName?.message}
              {...register("coupleDisplayName")}
            />
            <AppInput
              label="Fecha y hora"
              type="datetime-local"
              required
              error={errors.weddingDateTime?.message}
              {...register("weddingDateTime")}
            />
          </div>
          <AppInput
            label="Zona horaria IANA"
            placeholder="America/Mexico_City"
            required
            list="wedding-time-zones"
            hint="Se usa para guardar la fecha con el offset correcto."
            error={errors.timeZone?.message}
            {...register("timeZone")}
          />
          <datalist id="wedding-time-zones">
            <option value="America/Mexico_City" />
            <option value="America/Cancun" />
            <option value="America/Tijuana" />
            <option value="America/Monterrey" />
          </datalist>
          <AppTextarea
            label="Texto de presentación"
            placeholder="Nos encantará compartir contigo este día tan especial…"
            required
            maxLength={1200}
            hint="Entre 10 y 1,200 caracteres."
            error={errors.presentationText?.message}
            {...register("presentationText")}
          />
        </fieldset>

        <fieldset
          disabled={isSaving}
          className="border-t border-[#eee3e7] pt-8"
        >
          <legend className="sr-only">Ubicación</legend>
          <SectionHeading
            icon={MapPin}
            title="Ubicación"
            description="El mapa embebido es opcional; el enlace de navegación siempre estará disponible."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <AppInput
              label="Nombre del recinto"
              placeholder="Jardín Los Olivos"
              required
              error={errors.address?.venueName?.message}
              {...register("address.venueName")}
            />
            <AppInput
              label="Dirección completa"
              placeholder="Calle, número, colonia, ciudad"
              required
              error={errors.address?.formattedAddress?.message}
              {...register("address.formattedAddress")}
            />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <AppInput
              label="URL para iframe del mapa"
              type="url"
              inputMode="url"
              placeholder="https://www.google.com/maps/embed?..."
              hint="Opcional. Si se omite, se mostrará la dirección sin iframe."
              error={errors.address?.mapEmbedUrl?.message}
              leadingIcon={<MapPin className="size-4" aria-hidden="true" />}
              {...register("address.mapEmbedUrl")}
            />
            <AppInput
              label="URL de Cómo llegar"
              type="url"
              inputMode="url"
              placeholder="https://maps.google.com/?q=..."
              required
              error={errors.address?.mapsNavigationUrl?.message}
              leadingIcon={<ExternalLink className="size-4" aria-hidden="true" />}
              {...register("address.mapsNavigationUrl")}
            />
          </div>
        </fieldset>

        <fieldset
          disabled={isSaving}
          className="border-t border-[#eee3e7] pt-8"
        >
          <legend className="sr-only">Fotografías</legend>
          <PhotoUrlListEditor
            control={control}
            register={register}
            errors={errors.photos}
          />
        </fieldset>

        <fieldset
          disabled={isSaving}
          className="border-t border-[#eee3e7] pt-8"
        >
          <legend className="sr-only">Música</legend>
          <SectionHeading
            icon={Music2}
            title="Música"
            description="Usa una URL HTTPS de almacenamiento autorizado o CDN."
          />
          <AppInput
            label="URL del audio"
            type="url"
            inputMode="url"
            placeholder="https://cdn.ejemplo.com/nuestra-cancion.mp3"
            required
            error={errors.audio?.url?.message}
            {...register("audio.url")}
          />
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <AppInput
              label="Título"
              placeholder="Nuestra canción"
              error={errors.audio?.title?.message}
              {...register("audio.title")}
            />
            <AppInput
              label="Artista"
              placeholder="Nombre del artista"
              error={errors.audio?.artist?.message}
              {...register("audio.artist")}
            />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <ToggleField
              id="audio-autoplay"
              label="Intentar reproducción automática"
              description="Si el navegador la bloquea, se pedirá un gesto."
              disabled={isSaving}
              register={register("audio.autoplay")}
            />
            <ToggleField
              id="audio-loop"
              label="Repetir canción"
              description="La pista volverá a empezar mientras la invitación esté abierta."
              disabled={isSaving}
              register={register("audio.loop")}
            />
          </div>
        </fieldset>

        {feedback?.type === "success" ? (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-[#bdd7c3] bg-[#eff8f1] px-4 py-3 text-sm text-[#326442]"
          >
            <CheckCircle2 className="size-5" aria-hidden="true" />
            {feedback.message}
          </div>
        ) : null}

        {feedback?.type === "conflict" ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#e5d099] bg-[#fff9e8] p-4 text-[#6f5317]"
          >
            <p className="font-semibold">Hay una versión más reciente</p>
            <p className="mt-1 text-sm leading-6">
              {feedback.message} Recarga los datos antes de volver a guardar.
            </p>
            <AppButton
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={reloadAfterConflict}
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Recargar versión actual
            </AppButton>
          </div>
        ) : null}

        {feedback?.type === "error" ? (
          <ErrorState
            compact
            title="No se guardaron los cambios"
            message={feedback.message}
            traceId={feedback.traceId}
          />
        ) : null}

        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfd1d7] bg-white/95 p-3 shadow-xl backdrop-blur">
          <p className="flex items-center gap-2 text-xs text-[#78636e]">
            <CalendarClock className="size-4" aria-hidden="true" />
            {isDirty ? "Tienes cambios sin guardar" : "Todo está actualizado"}
          </p>
          <AppButton type="submit" isLoading={isSaving} disabled={!isDirty}>
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? "Guardando…" : "Guardar cambios"}
          </AppButton>
        </div>
      </form>
    </section>
  );
}
