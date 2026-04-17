import Link from "next/link";

type CollectionsHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string | null;
  primaryCta?: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
};

export default function CollectionsHero({
  eyebrow = "Blue Peach Collections",
  title,
  description,
  image,
  primaryCta,
  secondaryCta,
}: CollectionsHeroProps) {
  return (
    <section className="border-b border-[#DED8CC] bg-[#e9e4da] pt-3 md:pt-4">
      <div className="bp-container py-14 md:py-18">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
              {eyebrow}
            </p>

            <h1 className="font-heading mt-4 text-5xl font-medium leading-[0.95] tracking-[-0.02em] text-[#1F1F1F] md:text-6xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#66707A] md:text-base">
                {description}
              </p>
            ) : null}

            {(primaryCta || secondaryCta) ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCta ? (
                  <Link href={primaryCta.href} className="bp-btn bp-btn--solid">
                    {primaryCta.label}
                  </Link>
                ) : null}

                {secondaryCta ? (
                  <Link href={secondaryCta.href} className="bp-btn bp-btn--ghost">
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden border border-[#DED8CC] bg-[#F8F8F5]">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full min-h-[300px] w-full object-cover md:min-h-[420px]"
              />
            ) : (
              <div className="flex min-h-[300px] items-center justify-center bg-[#F3EEE6] text-sm text-[#8C8478] md:min-h-[420px]">
                Blue Peach Collections
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}