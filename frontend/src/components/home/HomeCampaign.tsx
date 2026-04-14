import Link from "next/link";

type HomeBanner = {
  ma_banner: string;
  tieu_de?: string | null;
  mo_ta_ngan?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  image_url?: string | null;
};

export default function HomeCampaign({
  banner,
}: {
  banner?: HomeBanner | null;
}) {
  const imageUrl = banner?.image_url || "/home/campaign.jpg";

  return (
    <section className="relative -mt-[112px] min-h-[760px] overflow-hidden md:min-h-[860px]">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={banner?.tieu_de || "Blue Peach campaign"}
          className="h-full w-full object-cover object-center md:object-[center_38%]"
        />
      </div>

      <div className="absolute inset-0 bg-white/[0.04]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/[0.08] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/[0.08] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#E6EDF3]/86 via-[#E6EDF3]/28 to-transparent" />

      <div className="relative z-10 bp-container flex min-h-[760px] items-start pt-[260px] pb-20 md:min-h-[860px] md:pt-[280px] md:pb-24">
        <div className="max-w-[640px] text-white">
          {banner?.tieu_de ? (
            <h1 className="text-4xl font-medium leading-tight tracking-[-0.03em] md:text-6xl">
              {banner.tieu_de}
            </h1>
          ) : null}

          {banner?.mo_ta_ngan ? (
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 md:text-base">
              {banner.mo_ta_ngan}
            </p>
          ) : null}

          {banner?.cta_text && banner?.cta_link ? (
            <div className="mt-8">
              <Link
                href={banner.cta_link}
                className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/15"
              >
                {banner.cta_text}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}