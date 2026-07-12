"use client";

import { useEffect, useState } from "react";
import { getCountdownParts } from "../utils/dateTime";

const EMPTY_COUNTDOWN = Object.freeze({
  totalMilliseconds: 0,
  isComplete: true,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

export function calculateCountdown(target, now = Date.now()) {
  const targetTime = new Date(target).getTime();
  if (!Number.isFinite(targetTime)) return { ...EMPTY_COUNTDOWN };
  return getCountdownParts(target, now);
}

export function useCountdown(target) {
  const [countdown, setCountdown] = useState(() => calculateCountdown(target));

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(calculateCountdown(target));
    };

    updateCountdown();
    const targetTime = new Date(target).getTime();
    if (!Number.isFinite(targetTime) || targetTime <= Date.now()) return undefined;

    const intervalId = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(intervalId);
  }, [target]);

  return countdown;
}

export { EMPTY_COUNTDOWN };
