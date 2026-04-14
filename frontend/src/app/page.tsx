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
    <section className="py-14 md:py-20">
      <div className="bp-container grid gap-8 md:grid-cols-2">
        <div className="border border-[#D5DEE6] bg-[#F6F7F5] p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.35em] text-[#66707A]">
            EDITORIAL
          </p>

          <h3 className="font-heading mt-4 text-4xl font-medium leading-none tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
            Everyday shine, refined.
          </h3>

          <p className="mt-4 text-sm leading-6 text-[#66707A]">
            Những thiết kế bạc mang tinh thần tối giản, tinh tế và dễ đồng hành cùng mọi khoảnh khắc thường ngày.
          </p>

          <div className="mt-7">
            <Link className="bp-btn bp-btn--ghost" href="/products?collection=editorial">
              View the Edit
            </Link>
          </div>
        </div>

        <div className="overflow-hidden border border-[#D5DEE6] bg-[#F6F7F5]">
          <img
            src="/home/editorial.jpg"
            alt="Editorial"
            className="h-full min-h-[320px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#D5DEE6] bg-[#EEF3F7] text-[#1F1F1F]">
      <div className="bp-container py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <div className="text-xl font-semibold tracking-[0.22em] text-[#1F1F1F]">
              BLUE PEACH
            </div>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#66707A]">
              Minimal silver jewelry designed for modern elegance.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#66707A]">
              <Link href="#" className="transition hover:text-[#1F1F1F]">
                Instagram
              </Link>
              <Link href="#" className="transition hover:text-[#1F1F1F]">
                Facebook
              </Link>
              <Link href="#" className="transition hover:text-[#1F1F1F]">
                TikTok
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1F1F1F]">
              Shop
            </h3>

            <div className="mt-4 space-y-3 text-sm text-[#66707A]">
              <Link href="/products" className="block transition hover:text-[#1F1F1F]">
                All Products
              </Link>
              <Link href="/products?sort=new" className="block transition hover:text-[#1F1F1F]">
                New Arrivals
              </Link>
              <Link href="/products?sort=best" className="block transition hover:text-[#1F1F1F]">
                Best Sellers
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1F1F1F]">
              About
            </h3>

            <div className="mt-4 space-y-3 text-sm text-[#66707A]">
              <Link href="#" className="block transition hover:text-[#1F1F1F]">
                Our Story
              </Link>
              <Link href="#" className="block transition hover:text-[#1F1F1F]">
                Craftsmanship
              </Link>
              <Link href="#" className="block transition hover:text-[#1F1F1F]">
                Gift Services
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1F1F1F]">
              Support
            </h3>

            <div className="mt-4 space-y-3 text-sm text-[#66707A]">
              <Link href="#" className="block transition hover:text-[#1F1F1F]">
                Contact
              </Link>
              <Link href="#" className="block transition hover:text-[#1F1F1F]">
                Shipping
              </Link>
              <Link href="#" className="block transition hover:text-[#1F1F1F]">
                Returns
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1F1F1F]">
              Blue Peach Notes
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#66707A]">
              Subscribe for product updates, gifting ideas, and new collection launches.
            </p>

            <form className="mt-5 flex items-center gap-2 border border-[#D5DEE6] bg-white px-4 py-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8A949D]"
              />
              <button type="submit" className="text-sm font-semibold text-[#1F1F1F]">
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
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
        <FeaturedEditorial />
      </section>

      <section className="bp-surface bp-surface-warm">
        <BestSellersGrid products={bestSellers} />
      </section>

      {featuredReviews.length > 0 ? (
        <section className="bp-surface bp-surface-plain">
          <FeaturedReviews reviews={featuredReviews} />
        </section>
      ) : null}

      <section className="bp-surface bp-surface-plain">
        <WhyBluePeach />
      </section>

      <Footer />
    </main>
  );
}