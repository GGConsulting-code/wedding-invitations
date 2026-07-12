"use client";

import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";

const variants = {
  primary:
    "bg-[#5d2348] text-white shadow-[0_10px_30px_rgba(93,35,72,0.2)] hover:bg-[#471936] focus-visible:ring-[#5d2348]",
  secondary:
    "border border-[#d9c7cf] bg-white text-[#4b243b] hover:border-[#b88da0] hover:bg-[#fff9f5] focus-visible:ring-[#8a496c]",
  ghost:
    "bg-transparent text-[#5d2348] hover:bg-[#f7eef1] focus-visible:ring-[#8a496c]",
  danger:
    "bg-[#8f2f3f] text-white hover:bg-[#712331] focus-visible:ring-[#8f2f3f]",
};

const sizes = {
  sm: "min-h-10 px-3.5 py-2 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

export const AppButton = forwardRef(function AppButton(
  {
    children,
    className = "",
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    type = "button",
    ...props
  },
  ref,
) {
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
});

