"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_GESTURES = ["pointerdown", "touchstart", "keydown"];

export function useAudioAutoplay({ src, autoplay = false, loop = false } = {}) {
  const audioRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [error, setError] = useState(null);

  const startPlayback = useCallback(async ({ allowGestureFallback = false } = {}) => {
    const audio = audioRef.current;
    if (!audio || !src) return false;

    setStatus("loading");
    setError(null);

    try {
      await audio.play();
      setIsPlaying(true);
      setIsAutoplayBlocked(false);
      setStatus("playing");
      return true;
    } catch (playError) {
      setIsPlaying(false);

      if (allowGestureFallback || playError?.name === "NotAllowedError") {
        setIsAutoplayBlocked(true);
        setStatus("blocked");
      } else {
        setError(playError);
        setStatus("error");
      }

      return false;
    }
  }, [src]);

  const pausePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setStatus("paused");
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      pausePlayback();
      return Promise.resolve(false);
    }

    return startPlayback();
  }, [isPlaying, pausePlayback, startPlayback]);

  const setVolume = useCallback((nextVolume) => {
    const normalizedVolume = Math.min(1, Math.max(0, Number(nextVolume)));
    setVolumeState(normalizedVolume);
    if (audioRef.current) audioRef.current.volume = normalizedVolume;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return undefined;

    audio.loop = loop;

    const handlePlaying = () => {
      setIsPlaying(true);
      setStatus("playing");
      setError(null);
    };
    const handlePause = () => {
      setIsPlaying(false);
      setStatus((currentStatus) =>
        currentStatus === "blocked" || currentStatus === "error"
          ? currentStatus
          : "paused",
      );
    };
    const handleWaiting = () => setStatus("loading");
    const handleError = () => {
      setIsPlaying(false);
      setStatus("error");
      setError(audio.error ?? new Error("No se pudo reproducir el audio."));
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);

    const initializeTimer = window.setTimeout(() => {
      if (autoplay) {
        void startPlayback({ allowGestureFallback: true });
      } else {
        setStatus("paused");
      }
    }, 0);

    return () => {
      window.clearTimeout(initializeTimer);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [autoplay, loop, src, startPlayback]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!isAutoplayBlocked) return undefined;

    const unlockAudio = () => {
      void startPlayback();
    };

    AUTOPLAY_GESTURES.forEach((eventName) => {
      window.addEventListener(eventName, unlockAudio, {
        capture: true,
        once: true,
        passive: eventName !== "keydown",
      });
    });

    return () => {
      AUTOPLAY_GESTURES.forEach((eventName) => {
        window.removeEventListener(eventName, unlockAudio, { capture: true });
      });
    };
  }, [isAutoplayBlocked, startPlayback]);

  return {
    audioRef,
    error,
    isAutoplayBlocked,
    isPlaying,
    pausePlayback,
    setVolume,
    startPlayback,
    status,
    togglePlayback,
    volume,
  };
}
