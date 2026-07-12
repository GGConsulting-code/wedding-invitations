"use client";

import { forwardRef, useId } from "react";

export const AppTextarea = forwardRef(function AppTextarea(
  {
    id,
    label,
    error,
    hint,
    required,
    className = "",
    textareaClassName = "",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-[#4b243b]"
        >
          {label}
          {required ? (
            <span className="ml-1 text-[#9b3c50]" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(" ") || undefined
        }
        className={`min-h-28 w-full resize-y rounded-2xl border bg-white px-3.5 py-3 text-[15px] leading-6 text-[#2f1d28] shadow-sm outline-none transition placeholder:text-[#a48f99] focus:border-[#8a496c] focus:ring-2 focus:ring-[#8a496c]/20 ${
          error ? "border-[#b43c52]" : "border-[#ddcfd5]"
        } ${textareaClassName}`}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="text-xs leading-5 text-[#75616c]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-[#a62d44]">
          {error}
        </p>
      ) : null}
    </div>
  );
});

