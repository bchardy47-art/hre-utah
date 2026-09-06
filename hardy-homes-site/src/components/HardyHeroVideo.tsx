"use client";

import { useEffect, useRef, useState } from "react";

const POSTER_SRC = "/videos/hardy-homes-hero-poster.jpg";
const VIDEO_SRC = "/videos/hardy-homes-hero.mp4";

/**
 * Hero background video.
 *
 * The poster layer is always rendered and only fades out once the video has
 * actually emitted `playing`, so a failed or blocked autoplay simply leaves the
 * poster in place. The video is never `display:none` — hiding it that way stops
 * it loading at all and leaves no way to recover.
 *
 * `prefers-reduced-motion: reduce` is honoured: we never call play(), and the
 * poster stays visible, so those users get a completely static hero.
 */
export default function HardyHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stop = () => {
      video.pause();
      setIsPlaying(false);
    };

    const start = () => {
      // Muted playback is what makes autoplay permissible; set it on the
      // element (not just the attribute) before asking to play.
      video.muted = true;
      const attempt = video.play();
      if (attempt) {
        // Autoplay can still be refused (power saving, data saver, policy).
        // That is not an error state — the poster just stays visible.
        attempt.catch(() => setIsPlaying(false));
      }
    };

    const apply = () => (query.matches ? stop() : start());

    apply();

    // Respond if the user changes the preference while the page is open.
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div className="scene hh-video-scene">
      <div
        className={`hh-hero-poster${isPlaying ? " is-hidden" : ""}`}
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        className="hh-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={POSTER_SRC}
        aria-hidden="true"
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
