"use client";

import { forwardRef, useId } from "react";

export const AppInput = forwardRef(function AppInput(
  {
    id,
    label,
    error,
    hint,
    required,
    className = "",
    inputClassName = "",
    leadingIcon,
    trailingContent,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

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
      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#856475]">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`min-h-11 w-full rounded-2xl border bg-white px-3.5 py-2.5 text-[15px] text-[#2f1d28] shadow-sm outline-none transition placeholder:text-[#a48f99] focus:border-[#8a496c] focus:ring-2 focus:ring-[#8a496c]/20 disabled:cursor-not-allowed disabled:bg-[#f6f1f3] ${
            error ? "border-[#b43c52]" : "border-[#ddcfd5]"
          } ${leadingIcon ? "pl-10" : ""} ${trailingContent ? "pr-12" : ""} ${inputClassName}`}
          {...props}
        />
        {trailingContent ? (
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            {trailingContent}
          </span>
        ) : null}
      </div>
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

