import type { HardyStandardFeature } from "@hardy-homes/shared/hardyHomes";
import HardyStandardFeatureIcon from "@/components/HardyStandardFeatureIcon";

type Props = {
  features: HardyStandardFeature[];
  compact?: boolean;
  featured?: boolean;
};

export default function HardyStandardFeatureGrid({ features, compact = false, featured = false }: Props) {
  return (
    <div className={`hh-standard-feature-grid${compact ? " hh-standard-feature-grid--compact" : ""}${featured ? " hh-standard-feature-grid--featured" : ""}`}>
      {features.map((feature) => (
        <article key={feature.key} className={`card hh-standard-feature-card${compact ? " hh-standard-feature-card--compact" : ""}${featured ? " hh-standard-feature-card--featured" : ""}`}>
          <div className="feat-ico hh-standard-feature-icon">
            <HardyStandardFeatureIcon icon={feature.icon} />
          </div>
          <h3>{feature.title}</h3>
          {feature.description ? <p>{feature.description}</p> : null}
        </article>
      ))}
    </div>
  );
}
