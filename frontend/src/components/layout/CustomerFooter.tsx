import Link from "next/link";

export default function CustomerFooter() {
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
              <Link href="/collections" className="block transition hover:text-[#1F1F1F]">
                Collections
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