import { loadMediaKit, loadAllPlatforms } from "@/lib/data/loader";
import { PLATFORM_CONFIG, formatNumber } from "@/lib/constants";
import Link from "next/link";

export default function MediaKitPage() {
  const config = loadMediaKit();
  const platforms = loadAllPlatforms();

  const totalFollowers = platforms.reduce((sum, p) => sum + p.followers, 0);

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1A2E1A] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-5xl tracking-wide md:text-7xl">
            {config.creatorName}
          </h1>
          <p className="mt-4 text-lg text-white/80 md:text-xl">
            {config.tagline}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/60">
            {config.bio}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {Object.entries(config.socialLinks).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm transition hover:bg-white/10"
              >
                @{platform === "tiktok" ? "alsokal" : "kal.bog"}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* The Numbers */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-3xl text-[#1A2E1A]">
            the numbers
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {config.highlightMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-3xl font-bold text-[#1A2E1A] md:text-4xl">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm text-[#1A2E1A]/60">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Breakdown */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-3xl text-[#1A2E1A]">
            platforms
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((p) => {
              const config =
                PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG];
              if (!config) return null;
              return (
                <div
                  key={p.platform}
                  className="rounded-xl border p-5 transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <h3 className="font-bold">{config.name}</h3>
                  </div>
                  <p className="mt-2 text-2xl font-bold">
                    {formatNumber(p.followers)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {p.handle}
                  </p>
                  <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                    <span>{p.engagementRate}% engagement</span>
                    <span>{p.postsCount} posts</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg font-bold text-[#1A2E1A]">
              {formatNumber(totalFollowers)}+ combined followers
            </p>
          </div>
        </div>
      </section>

      {/* Audience Demographics */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-3xl text-[#1A2E1A]">
            audience
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {/* Age */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Age Range
              </h3>
              <div className="space-y-2">
                {config.demographics.ageRanges.map((item) => (
                  <div key={item.range}>
                    <div className="flex justify-between text-sm">
                      <span>{item.range}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[#1A2E1A]/10">
                      <div
                        className="h-full rounded-full bg-[#6bd9c5]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Gender */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Gender
              </h3>
              <div className="space-y-2">
                {config.demographics.genderSplit.map((item) => (
                  <div key={item.gender}>
                    <div className="flex justify-between text-sm">
                      <span>{item.gender}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[#1A2E1A]/10">
                      <div
                        className="h-full rounded-full bg-[#7C9A82]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Location */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Top Locations
              </h3>
              <div className="space-y-2">
                {config.demographics.topLocations.map((item) => (
                  <div key={item.location}>
                    <div className="flex justify-between text-sm">
                      <span>{item.location}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[#1A2E1A]/10">
                      <div
                        className="h-full rounded-full bg-[#5BA55B]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Partners */}
      {config.pastPartners.length > 0 && (
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-heading text-3xl text-[#1A2E1A]">
              past collaborations
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {config.pastPartners.map((partner) => (
                <div
                  key={partner.name}
                  className="rounded-xl border p-5 text-center"
                >
                  <p className="text-lg font-bold">{partner.name}</p>
                  {partner.result && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {partner.result}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-3xl text-[#1A2E1A]">
            collaboration packages
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {config.packages.map((pkg) => (
              <div
                key={pkg.name}
                className="rounded-xl border bg-white p-6 text-center transition hover:shadow-md"
              >
                <h3 className="font-heading text-xl">{pkg.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {pkg.description}
                </p>
                <p className="mt-4 text-sm font-bold text-[#6bd9c5]">
                  {pkg.startingAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1A2E1A] px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl">let&apos;s work together</h2>
          <p className="mt-4 text-white/70">
            Interested in reaching an engaged audience of outdoor enthusiasts,
            young families, and adventure seekers?
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-[#6bd9c5] px-8 py-3 font-bold text-[#1A2E1A] transition hover:bg-[#5bc4b1]"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2E1A] px-6 py-6 text-center text-sm text-white/40">
        <p>&copy; {new Date().getFullYear()} AlsoKal. All rights reserved.</p>
      </footer>
    </div>
  );
}
