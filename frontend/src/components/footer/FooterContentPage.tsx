import Link from "next/link";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

type FooterContentSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type FooterContentPageProps = {
  eyebrow: string;
  title: string;
  description?: string;
  sections: FooterContentSection[];
  closingTitle?: string;
  closingText?: string;
  highlights?: string[];
  primaryCta?: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
};

export default function FooterContentPage({
  eyebrow,
  title,
  description,
  sections,
  closingTitle,
  closingText,
  highlights,
  primaryCta,
  secondaryCta,
}: FooterContentPageProps) {
  return (
    <main className="bg-[#F8F9FB] text-[#1F1F1F]">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: eyebrow, active: true },
        ]}
      />

      <section className="border-b border-[#E6E1D8] bg-[#F3EEE6]">
        <div className="bp-container py-10 md:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7B8791]">
            {eyebrow}
          </p>

          <h1 className="font-heading mt-4 max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-[#1F1F1F] md:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#66707A] md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </section>

      <section>
        <div className="bp-container py-14 md:py-18">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.title} className="border-b border-[#ECE6DC] pb-10 last:border-b-0 last:pb-0">
                  <h2 className="font-heading text-3xl font-medium leading-tight tracking-[-0.02em] text-[#1F1F1F] md:text-4xl">
                    {section.title}
                  </h2>

                  {section.paragraphs?.length ? (
                    <div className="mt-5 space-y-4">
                      {section.paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="max-w-3xl text-sm leading-8 text-[#4F5963] md:text-[15px]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {section.bullets?.length ? (
                    <ul className="mt-6 space-y-4">
                      {section.bullets.map((bullet, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-7 text-[#4F5963] md:text-[15px]"
                        >
                          <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F1F1F]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              {closingTitle || closingText || highlights?.length ? (
                <section className="rounded-[28px] border border-[#E4DDD2] bg-[#F6F1EA] p-7 md:p-9">
                  {closingTitle ? (
                    <h2 className="font-heading text-3xl font-medium leading-tight tracking-[-0.02em] text-[#1F1F1F] md:text-4xl">
                      {closingTitle}
                    </h2>
                  ) : null}

                  {closingText ? (
                    <p className="mt-5 max-w-3xl text-sm leading-8 text-[#4F5963] md:text-[15px]">
                      {closingText}
                    </p>
                  ) : null}

                  {highlights?.length ? (
                    <ul className="mt-6 space-y-3">
                      {highlights.map((item, index) => (
                        <li
                          key={index}
                          className="text-sm leading-7 text-[#1F1F1F] md:text-[15px]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ) : null}
            </div>

            <aside className="h-fit rounded-[28px] border border-[#E4DDD2] bg-white p-6 md:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7B8791]">
                Blue Peach
              </p>

              <h3 className="font-heading mt-4 text-2xl font-medium leading-tight text-[#1F1F1F]">
                Trang sức bạc cho vẻ đẹp tinh tế mỗi ngày.
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#66707A]">
                Khám phá các thiết kế mang tinh thần tối giản, nữ tính và thanh lịch
                của Blue Peach — phù hợp cho cả dịp đặc biệt và phong cách thường ngày.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {primaryCta ? (
                  <Link className="bp-btn bp-btn--solid text-center" href={primaryCta.href}>
                    {primaryCta.label}
                  </Link>
                ) : null}

                {secondaryCta ? (
                  <Link className="bp-btn bp-btn--ghost text-center" href={secondaryCta.href}>
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}