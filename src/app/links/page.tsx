import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Search,
  Wrench,
  MessageSquare,
  Phone,
  ClipboardList,
  Sprout,
  Crosshair,
  Globe,
  ExternalLink,
} from "lucide-react";
import styles from "./links.module.css";

const links = [
  {
    title: "Buy or Sell Smarter",
    subtitle: "Smart real estate guidance.",
    href: "/real-estate",
    icon: Home,
  },
  {
    title: "Search Homes",
    subtitle: "Browse Utah homes.",
    href: "https://hardyhomes-utah.com",
    icon: Search,
    external: true,
  },
  {
    title: "Handyman Services",
    subtitle: "Repairs, updates, clear pricing.",
    href: "/handyman",
    icon: Wrench,
  },
  {
    title: "Text Brian",
    subtitle: "Fastest way to ask.",
    href: "sms:+18013800445",
    icon: MessageSquare,
  },
  {
    title: "Call Brian",
    subtitle: "Talk through your move or project.",
    href: "tel:+18013800445",
    icon: Phone,
  },
  {
    title: "Contact / Request a Quote",
    subtitle: "Send details and get next steps.",
    href: "/contact",
    icon: ClipboardList,
  },
  {
    title: "Greener Grass Summer Mix",
    subtitle: "Lawn care resources.",
    href: "/greener-grass",
    icon: Sprout,
  },
  {
    title: "Kill Lawn Weeds Fast",
    subtitle: "Weed control help.",
    href: "/kill-lawn-weeds",
    icon: Crosshair,
  },
  {
    title: "Visit Full Website",
    subtitle: "Explore everything HRE offers.",
    href: "/",
    icon: Globe,
  },
];

export default function LinksPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.radialGlow} />
        <div className={styles.overlay} />

        <div className={styles.container}>
          <Link
            href="/"
            aria-label="Hardy Real Estate Home"
            className={styles.logoLink}
          >
            <Image
              src="/images/hre-badge-logo.png"
              alt="Hardy Real Estate"
              width={118}
              height={118}
              priority
              className={styles.logo}
            />
          </Link>

          <div className={styles.headingBlock}>
            <h1 className={styles.heading}>
              <span className={styles.headingTop}>Start Here.</span>
              <span className={styles.headingBottom}>Pick Your Path.</span>
            </h1>

            <p className={styles.intro}>
              Quick links to the most popular ways to work with Brian Hardy —
              real estate guidance, handyman help, local resources, and straight
              answers.
            </p>

            <div className={styles.nameBlock}>
              <p className={styles.name}>Brian Hardy</p>
              <p className={styles.role}>REALTOR® + Handyman</p>
            </div>
          </div>

          <div className={styles.grid}>
            {links.map((item) => {
              const Icon = item.icon;

              const content = (
                <div className={styles.circleCard}>
                  <div className={styles.iconWrap}>
                    <Icon size={38} strokeWidth={1.8} />
                  </div>

                  <p className={styles.cardTitle}>{item.title}</p>
                  <p className={styles.cardSubtitle}>{item.subtitle}</p>

                  {item.external ? (
                    <span className={styles.externalBadge} aria-hidden="true">
                      <ExternalLink size={15} strokeWidth={1.8} />
                    </span>
                  ) : null}
                </div>
              );

              if (item.external) {
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardLink}
                  >
                    {content}
                  </a>
                );
              }

              if (item.href.startsWith("tel:") || item.href.startsWith("sms:")) {
                return (
                  <a key={item.title} href={item.href} className={styles.cardLink}>
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={styles.cardLink}
                >
                  {content}
                </Link>
              );
            })}
          </div>

          <div className={styles.ctaRow}>
            <a href="sms:+18013800445" className={styles.secondaryCta}>
              <MessageSquare size={22} strokeWidth={1.8} />
              <span>Text Brian</span>
            </a>

            <a href="tel:+18013800445" className={styles.primaryCta}>
              <Phone size={22} strokeWidth={1.8} />
              <span>Call (801) 380-0445</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
