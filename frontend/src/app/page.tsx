import Link from "next/link";
import { apiFetch } from "@/lib/api";
import HomeCampaign from "@/components/home/HomeCampaign";
import IntroBand from "@/components/home/IntroBand";
import CategoryTiles from "@/components/home/CategoryTiles";
import NewArrivalsGrid from "@/components/home/NewArrivalsGrid";
import BestSellersGrid from "@/components/home/BestSellersGrid";
import FeaturedReviews from "@/components/home/FeaturedReviews";
import WhyBluePeach from "@/components/home/WhyBluePeach";

async function getNewArrivals() {
  return await apiFetch("/products?limit=8&sort=new", {
    cache: "no-store",
  });
}

async function getBestSellers() {
  return await apiFetch("/products?limit=8&sort=best", {
    cache: "no-store",
  });
}

async function getHomeBanner() {
  return await apiFetch("/banners/home", {
    cache: "no-store",
  });
}

async function getFeaturedReviews() {
  return await apiFetch("/reviews/featured?limit=6", {
    cache: "no-store",
  }).catch(() => ({
    items: [],
    total: 0,
  }));
}

function FeaturedEditorial() {
  return (
    <section className="py-16 md:py-24 bg-transparent">
      <div className="bp-container grid gap-6 md:grid-cols-12 items-stretch">
        <div className="md:col-span-5 relative overflow-hidden border border-[#E4DDD2] bg-[#F6F0E8] p-8 md:p-12 lg:p-14">
          <div className="absolute left-0 top-0 h-full w-[2px] bg-[#1F1F1F]/8" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#8C8478]">
            Featured Collection
          </p>

          <h3 className="font-heading mt-6 text-4xl font-medium leading-[0.96] tracking-[-0.03em] text-[#1F1F1F] md:text-5xl lg:text-6xl">
            Trang sức cho những khoảnh khắc tinh tế mỗi ngày.
          </h3>

          <div className="mt-6 h-[1px] w-12 bg-[#D8D0C4]" />

          <p className="mt-6 max-w-md text-sm leading-7 text-[#66707A] md:text-base">
            Một tuyển chọn mang tinh thần nhẹ nhàng, nữ tính và hiện đại của
            Blue Peach — dành cho những ai yêu vẻ đẹp tối giản nhưng vẫn muốn
            giữ lại cảm giác nổi bật vừa đủ.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              className="bp-btn bp-btn--solid"
              href="/collections/clover-moonstone"
            >
              Khám phá bộ sưu tập
            </Link>

            <Link
              className="bp-btn bp-btn--ghost"
              href="/collections"
            >
              Xem tất cả bộ sưu tập
            </Link>
          </div>

          <div className="mt-12 border-t border-[#E8E0D4] pt-7">
            <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-3 sm:gap-x-8">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#9A9184]">
                  Mood
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[#2A2A2A]">
                  Minimal & refined
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#9A9184]">
                  Chất liệu
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[#2A2A2A]">
                  Bạc 925 thanh lịch
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#9A9184]">
                  Dành cho
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[#2A2A2A]">
                  Everyday styling
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="group md:col-span-7 relative overflow-hidden border border-[#E4DDD2] bg-[#F6F0E8]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/28 via-black/6 to-transparent" />

          <img
            src="/home/editorial.jpg"
            alt="Editorial Jewelry"
            className="h-full min-h-[460px] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          />

          <div className="absolute left-6 top-6 z-20">
            <span className="inline-flex rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm">
              Blue Peach Editorial
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 lg:p-10"></div>

          <div className="absolute bottom-6 right-6 z-20">
            <p className="text-[10px] font-light uppercase tracking-[0.2em] text-white/75">
              © Blue Peach 2016
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Page() {
  const [newRes, bestRes, bannerRes, featuredReviewsRes] = await Promise.all([
    getNewArrivals(),
    getBestSellers(),
    getHomeBanner(),
    getFeaturedReviews(),
  ]);

  const newArrivals = newRes?.items ?? [];
  const bestSellers = bestRes?.items ?? [];
  const homeBanner = bannerRes?.item ?? null;
  const featuredReviews = featuredReviewsRes?.items ?? [];

  return (
    <main>
      <section className="bp-surface bp-surface-plain">
        <HomeCampaign banner={homeBanner} />
      </section>

      <section className="bp-surface bp-surface-warm">
        <IntroBand />
      </section>

      <section className="bp-surface bp-surface-plain">
        <CategoryTiles />
      </section>

      <section className="bp-surface bp-surface-warm">
        <NewArrivalsGrid products={newArrivals} />
      </section>

      <section className="bp-surface bp-surface-plain">
        <BestSellersGrid products={bestSellers} />
      </section>

      <section className="bp-surface bp-surface-warm">
        <FeaturedEditorial />
      </section>

      {featuredReviews.length > 0 ? (
        <section className="bp-surface bp-surface-plain">
          <FeaturedReviews reviews={featuredReviews} />
        </section>
      ) : null}

      <section className="bp-surface bp-surface-warm">
        <WhyBluePeach />
      </section>
    </main>
  );
}