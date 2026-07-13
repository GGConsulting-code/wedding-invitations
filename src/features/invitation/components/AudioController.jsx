"use client";

import { useEffect } from "react";
import { LoaderCircle, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useAudioAutoplay } from "../../../hooks/useAudioAutoplay";

export const INVITATION_OPEN_AUDIO_EVENT = "wedding-invitation:open-audio";

export function AudioController({ audio, startOnInvitationOpen = false }) {
  const {
    audioRef,
    error,
    isPlaying,
    setVolume,
    startPlayback,
    status,
    togglePlayback,
    volume,
  } = useAudioAutoplay({
    src: audio?.url,
    autoplay: startOnInvitationOpen ? false : audio?.autoplay,
    loop: audio?.loop,
  });

  useEffect(() => {
    if (!startOnInvitationOpen || !audio?.url) return undefined;

    const handleInvitationOpen = () => {
      // This listener runs synchronously from the envelope click/drag gesture,
      // so mobile browsers allow playback without showing an extra prompt.
      void startPlayback();
    };

    window.addEventListener(INVITATION_OPEN_AUDIO_EVENT, handleInvitationOpen);
    return () => {
      window.removeEventListener(INVITATION_OPEN_AUDIO_EVENT, handleInvitationOpen);
    };
  }, [audio?.url, startOnInvitationOpen, startPlayback]);

  if (!audio?.url) return null;

  const isLoading = status === "loading";

  return (
    <>
      <audio
        ref={audioRef}
        className="audio-controller__element"
        src={audio.url}
        preload="metadata"
        playsInline
        loop={audio.loop}
      />

      <aside className={`audio-controller audio-controller--${status}`} aria-label="Controles de música">
        <button
          type="button"
          className="audio-controller__play"
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
          onClick={() => void togglePlayback()}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="audio-controller__spinner" size={20} aria-hidden="true" />
          ) : isPlaying ? (
            <Pause size={20} aria-hidden="true" />
          ) : (
            <Play size={20} aria-hidden="true" />
          )}
        </button>

        <div className="audio-controller__track">
          <span className="audio-controller__title">{audio.title || "Nuestra canción"}</span>
          {audio.artist ? <span className="audio-controller__artist">{audio.artist}</span> : null}
        </div>

        <label className="audio-controller__volume">
          <span className="sr-only">Volumen de la música</span>
          {volume === 0 ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          <input
            className="audio-controller__volume-range"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => setVolume(event.target.value)}
            aria-label="Volumen de la música"
          />
        </label>

        {error ? (
          <span className="audio-controller__error" role="status">
            Audio no disponible
          </span>
        ) : null}
      </aside>
    </>
  );
}
