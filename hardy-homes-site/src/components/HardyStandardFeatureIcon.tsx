import type { HardyStandardIconKey } from "@hardy-homes/shared/hardyHomes";

type Props = {
  icon?: HardyStandardIconKey;
};

export default function HardyStandardFeatureIcon({ icon = "finish" }: Props) {
  switch (icon) {
    case "structure":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M3 20h18" />
          <path d="M6 20V8l6-4 6 4v12" />
          <path d="M9 11h6M9 14h6" />
        </svg>
      );
    case "efficiency":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 3v6" />
          <path d="m16.2 7.8-4.2 4.2" />
          <path d="M7 14a5 5 0 1 0 10 0c0-1.5-.7-2.9-1.9-3.9" />
        </svg>
      );
    case "technology":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M10 7h4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "storage":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M4 7h16v11H4z" />
          <path d="M9 7V5h6v2" />
          <path d="M4 12h16" />
        </svg>
      );
    case "exterior":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v10h14V10" />
          <path d="M9 20v-5h6v5" />
        </svg>
      );
    case "finish":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
  }
}
