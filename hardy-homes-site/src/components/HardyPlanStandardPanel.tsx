import Link from "next/link";
import type { HardyHomeConcept } from "@hardy-homes/shared/hardyHomes";
import {
  getHardyCollectionStandards,
  hardyPlanCoreStandards,
} from "@hardy-homes/shared/hardyHomes";
import HardyStandardFeatureGrid from "@/components/HardyStandardFeatureGrid";
import { getStandardFeaturesPath } from "@hardy-homes/shared/hardyHomesRoutes";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

type Props = {
  home: HardyHomeConcept;
};

export default function HardyPlanStandardPanel({ home }: Props) {
  const collectionStandards = getHardyCollectionStandards(home.collectionSlug);

  return (
    <article className="card hardy-standard-card plan-accent hh-plan-standard-card">
      <span className="eyebrow">The Hardy Standard</span>
      <h2>More included from the start.</h2>
      <p className="hardy-standard-inline">
        Every Hardy Home begins with our core standard of construction, efficiency, and finish.
      </p>
      <HardyStandardFeatureGrid features={hardyPlanCoreStandards} compact />
      <div className="hh-plan-standard-collection">
        <h3>{collectionStandards.eyebrow}</h3>
        <div className="hh-plan-standard-chip-list">
          {collectionStandards.planHighlights.map((feature) => (
            <span key={feature.key} className="chip">{feature.title}</span>
          ))}
        </div>
      </div>
      <Link className="btn btn-ghost" href={getStandardFeaturesPath("standalone")}>
        View All Standard Features <Arrow />
      </Link>
    </article>
  );
}
