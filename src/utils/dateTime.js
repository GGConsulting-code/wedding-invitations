import { env } from "../config/env.js";

const LOCAL_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

const parseLocalDateTime = (value) => {
  const match = LOCAL_DATE_TIME_PATTERN.exec(String(value));
  if (!match) throw new RangeError("La fecha local no tiene un formato válido.");
  const [, year, month, day, hour, minute, second = "00"] = match;
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };
};

const partsInTimeZone = (instant, timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return Object.fromEntries(
    formatter
      .formatToParts(instant)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)]),
  );
};

const offsetAt = (instantMs, timeZone) => {
  const parts = partsInTimeZone(new Date(instantMs), timeZone);
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return representedAsUtc - instantMs;
};

const formatOffset = (offsetMs) => {
  const totalMinutes = Math.round(offsetMs / 60_000);
  const sign = totalMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(totalMinutes);
  return `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(
    absolute % 60,
  ).padStart(2, "0")}`;
};

export const localDateTimeToIsoWithOffset = (
  value,
  timeZone = env.defaultTimeZone,
) => {
  const parts = parseLocalDateTime(value);
  const wallClockUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  let offset = offsetAt(wallClockUtc, timeZone);
  const instant = wallClockUtc - offset;
  offset = offsetAt(instant, timeZone);
  const local = `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(
    2,
    "0",
  )}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(
    2,
    "0",
  )}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
  return `${local}${formatOffset(offset)}`;
};

export const isoToLocalDateTimeInput = (value, timeZone = env.defaultTimeZone) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = partsInTimeZone(date, timeZone);
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(
    2,
    "0",
  )}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(
    2,
    "0",
  )}:${String(parts.minute).padStart(2, "0")}`;
};

export const formatDateTime = (
  value,
  { timeZone = env.defaultTimeZone, locale = "es-MX", ...options } = {},
) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: "long",
    timeStyle: "short",
    ...options,
  }).format(date);
};

export const getCountdownParts = (target, now = Date.now()) => {
  const targetTime = new Date(target).getTime();
  const currentTime = now instanceof Date ? now.getTime() : Number(now);
  const totalMilliseconds = Math.max(0, targetTime - currentTime);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  return {
    totalMilliseconds,
    isComplete: totalMilliseconds <= 0,
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
};

export const toOffsetIsoString = localDateTimeToIsoWithOffset;
