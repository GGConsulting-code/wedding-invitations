"use client";

import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { AppButton } from "../../../components/common/AppButton";
import { AppInput } from "../../../components/common/AppInput";

const MAX_PHOTOS = 20;

function createPhotoId() {
  if (globalThis.crypto?.randomUUID) {
    return `photo-${globalThis.crypto.randomUUID()}`;
  }
  return `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function PhotoPreview({ url, altText }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const failed = Boolean(url && failedUrl === url);

  if (!url || failed) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-[#f3edef] text-[#9b8290]">
        <ImageIcon className="size-7" aria-hidden="true" />
        <span className="sr-only">Vista previa no disponible</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={altText || "Vista previa de la fotografía"}
      className="aspect-[4/3] w-full rounded-2xl object-cover"
      loading="lazy"
      onError={() => setFailedUrl(url)}
    />
  );
}

function PhotoRow({
  index,
  control,
  register,
  error,
  total,
  onMove,
  onRemove,
}) {
  const url = useWatch({ control, name: `photos.${index}.url` });
  const altText = useWatch({ control, name: `photos.${index}.altText` });

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="grid gap-4 rounded-[1.5rem] border border-[#e5d8dd] bg-[#fffdfc] p-4 sm:grid-cols-[9rem_1fr]"
    >
      <PhotoPreview url={url} altText={altText} />

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#4e3040]">
            Fotografía {index + 1}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-[#dfd2d7] bg-white text-[#68485a] transition hover:bg-[#f7eef1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a496c] disabled:opacity-35"
              aria-label={`Subir fotografía ${index + 1}`}
              disabled={index === 0}
              onClick={() => onMove(index, index - 1)}
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-[#dfd2d7] bg-white text-[#68485a] transition hover:bg-[#f7eef1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a496c] disabled:opacity-35"
              aria-label={`Bajar fotografía ${index + 1}`}
              disabled={index === total - 1}
              onClick={() => onMove(index, index + 1)}
            >
              <ArrowDown className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-[#9b354b] transition hover:bg-[#fff0f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a74458]"
              aria-label={`Eliminar fotografía ${index + 1}`}
              onClick={() => onRemove(index)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <input type="hidden" {...register(`photos.${index}.id`)} />
        <input
          type="hidden"
          value={index}
          {...register(`photos.${index}.sortOrder`, { valueAsNumber: true })}
        />
        <AppInput
          label="URL HTTPS o ruta local"
          type="url"
          inputMode="url"
          placeholder="/media/photos/uno.jpeg"
          required
          error={error?.url?.message}
          {...register(`photos.${index}.url`)}
        />
        <AppInput
          label="Texto alternativo"
          placeholder="Describe la escena de forma breve"
          required
          maxLength={180}
          error={error?.altText?.message}
          hint="Describe lo importante de la imagen para quienes usan lector de pantalla."
          {...register(`photos.${index}.altText`)}
        />
      </div>
    </motion.li>
  );
}

export function PhotoUrlListEditor({ control, register, errors }) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "photos",
    keyName: "_formKey",
  });

  const addPhoto = () => {
    if (fields.length >= MAX_PHOTOS) return;
    append({
      id: createPhotoId(),
      url: "",
      altText: "",
      sortOrder: fields.length,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#442b38]">Fotografías</h3>
          <p className="mt-1 text-sm leading-6 text-[#78636e]">
            Agrega hasta {MAX_PHOTOS} imágenes mediante URL HTTPS o rutas locales de public y ordénalas con las flechas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-sm tabular-nums text-[#715765]"
            aria-live="polite"
          >
            {fields.length}/{MAX_PHOTOS}
          </span>
          <AppButton
            variant="secondary"
            size="sm"
            onClick={addPhoto}
            disabled={fields.length >= MAX_PHOTOS}
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            Agregar foto
          </AppButton>
        </div>
      </div>

      {errors?.root?.message ? (
        <p role="alert" className="text-sm text-[#a62d44]">
          {errors.root.message}
        </p>
      ) : null}

      {fields.length ? (
        <ol className="space-y-3">
          {fields.map((field, index) => (
            <PhotoRow
              key={field._formKey}
              index={index}
              control={control}
              register={register}
              error={errors?.[index]}
              total={fields.length}
              onMove={move}
              onRemove={remove}
            />
          ))}
        </ol>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#dbcbd2] bg-[#fffaf8] p-7 text-center text-sm leading-6 text-[#78636e]">
          No hay fotografías. La invitación seguirá funcionando y mostrará una
          experiencia sin galería.
        </div>
      )}
    </div>
  );
}

export { MAX_PHOTOS };
