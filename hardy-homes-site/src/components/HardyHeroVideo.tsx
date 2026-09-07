"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POSTER_SRC = "/videos/hardy-homes-hero-poster.jpg";
const VIDEO_SRC = "/videos/hardy-homes-hero.mp4";
const PLAYBACK_RATE = 1;

/**
 * Hero background video.
 *
 * The poster layer is always rendered and only fades out once the video has
 * actually emitted `playing`, so a failed or blocked autoplay simply leaves the
 * poster in place. The video is never `display:none` — hiding it that way stops
 * it loading at all and leaves no way to recover.
 *
 * `tryPlay` re-asserts muted and playback rate every time it runs (mount,
 * `canplay`, `pageshow`, visibility change), so both survive a reload of the
 * media element. `defaultPlaybackRate` is what `load()` restores, which is why
 * it is set alongside `playbackRate`. The rate is pinned to 1 so the footage
 * always plays at its true source timing.
 */
export default function HardyHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.defaultPlaybackRate = PLAYBACK_RATE;
    video.playbackRate = PLAYBACK_RATE;

    try {
      await video.play();
    } catch {
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      void tryPlay();
    };

    const onPageShow = () => {
      void tryPlay();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void tryPlay();
      }
    };

    void tryPlay();

    video.addEventListener("canplay", onCanPlay);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [tryPlay]);

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
