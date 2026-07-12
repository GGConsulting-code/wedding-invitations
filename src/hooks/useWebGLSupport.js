"use client";

import { useState } from "react";

export function detectWebGLSupport() {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");

  try {
    const context =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });

    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  } finally {
    canvas.remove();
  }
}

export function isLowPerformanceDevice() {
  if (typeof navigator === "undefined") return false;

  const memory = Number(navigator.deviceMemory ?? 0);
  const cores = Number(navigator.hardwareConcurrency ?? 0);
  const saveData = Boolean(navigator.connection?.saveData);

  return saveData || (memory > 0 && memory <= 4) || (cores > 0 && cores <= 4);
}

export function useWebGLSupport() {
  const [capabilities] = useState(() => {
    if (typeof document === "undefined") {
      return {
        isChecking: false,
        isSupported: false,
        isLowPerformance: false,
      };
    }

    return {
      isChecking: false,
      isSupported: detectWebGLSupport(),
      isLowPerformance: isLowPerformanceDevice(),
    };
  });

  return capabilities;
}
