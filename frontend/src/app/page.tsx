import Link from "next/link";
import LuxHeader from "@/components/home/LuxHeader";
import { API_BASE_URL } from "@/lib/api";


async function getNewArrivals() {
  const res = await fetch(
    `${API_BASE_URL}/api/products?limit=8&sort=new`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { items: [] };
  }

  return res.json();
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="bp-container mb-8">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {desc ? <p className="mt-2 max-w-2xl text-sm text-zinc-500">{desc}</p> : null}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="bp-container grid gap-8 py-10 md:grid-cols-2 md:py-16">
        {/* Editorial text */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold tracking-[0.35em] text-zinc-500">
            SPRING / SILVER EDIT
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Silver that feels
            <span className="block font-light">effortlessly modern.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
            Bộ sưu tập trang sức bạc tối giản, tinh tế – tôn đường nét và ánh kim tự nhiên.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="bp-btn bp-btn--solid" href="/products">
              Shop New Arrivals
            </Link>
            <Link className="bp-btn bp-btn--ghost" href="/products?sort=best">
              Best Sellers
            </Link>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-xs text-zinc-600">
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="font-semibold text-zinc-900">925 Silver</div>
              <div className="mt-1 text-zinc-500">Chất liệu chuẩn</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="font-semibold text-zinc-900">Gift-ready</div>
              <div className="mt-1 text-zinc-500">Hộp quà tinh tế</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="font-semibold text-zinc-900">Fast support</div>
              <div className="mt-1 text-zinc-500">Tư vấn nhanh</div>
            </div>
          </div>
        </div>

        {/* Hero image (placeholder) */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
          {/* Bạn thay bằng ảnh hero thật trong /public */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),rgba(245,245,245,0.2),rgba(0,0,0,0.02))]" />
          <img
            src="/home/hero.jpg"
            alt="Blue Peach hero"
            className="h-[520px] w-full object-cover md:h-[640px]"
          />
          <div className="absolute bottom-5 left-5 rounded-2xl bg-white/85 px-4 py-3 backdrop-blur">
            <div className="text-xs font-semibold tracking-[0.25em] text-zinc-500">
              FEATURED
            </div>
            <div className="mt-1 text-sm font-semibold">Minimal Pearl Ring</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryTiles() {
  const tiles = [
    { title: "Earrings", href: "/products?category=earrings", img: "home/cat-earrings.jpg" },
    { title: "Rings", href: "/products?category=rings", img: "home/cat-rings.jpg" },
    { title: "Necklaces", href: "/products?category=necklaces", img: "home/cat-necklaces.jpg" },
    { title: "Bracelets", href: "/products?category=bracelets", img: "home/cat-bracelets.jpg" },
  ];

  return (
    <section className="py-10 md:py-14">
      <SectionTitle
        title="Shop by category"
        desc="Bố cục sạch, ảnh lớn, hover nhẹ — đúng tinh thần luxury minimal."
      />
      <div className="bp-container grid gap-4 md:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.title}
            href={t.href}
            className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white"
          >
            <div className="overflow-hidden">
              <img
                src={t.img}
                alt={t.title}
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="text-sm font-semibold tracking-wide">{t.title}</div>
              <div className="text-xs text-zinc-500">Explore →</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedEditorial() {
  return (
    <section className="py-12 md:py-16">
      <div className="bp-container grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.35em] text-zinc-500">
            EDITORIAL
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Everyday shine, refined.
          </h3>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Một landing kiểu Swarovski thường có “editorial block” — text ngắn, nhiều khoảng
            trắng, CTA rõ ràng, không màu mè.
          </p>
          <div className="mt-7">
            <Link className="bp-btn bp-btn--ghost" href="/products?collection=editorial">
              View the Edit
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
          <img
            src="home/editorial.jpg"
            alt="Editorial"
            className="h-full min-h-[320px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function ProductGrid({ products }: { products: any[] }) {
  return (
    <section className="py-12 md:py-16">
      <div className="bp-container">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          New arrivals
        </h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {products.map((p) => {
            const hasDiscount = p.phan_tram_giam > 0;

            return (
              <a
                key={p.ma_san_pham}
                href={`/products/${p.ma_san_pham}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                  
                  {hasDiscount && (
                    <div className="absolute left-3 top-3 z-10 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                      -{p.phan_tram_giam}%
                    </div>
                  )}

                  <img
                    src={p.primary_image}
                    alt={p.ten_san_pham}
                    className="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium leading-snug tracking-wide">
                    {p.ten_san_pham}
                  </h3>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {p.gia_ban.toLocaleString("vi-VN")}đ
                    </span>

                    {hasDiscount && (
                      <span className="text-sm text-zinc-400 line-through">
                        {p.gia_goc.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="mt-12 border-t border-zinc-200 bg-white">
      <div className="bp-container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="text-sm font-semibold tracking-[0.25em]">BLUE PEACH</div>
          <p className="mt-3 text-sm text-zinc-600">
            Trang sức bạc tối giản cho phong cách hiện đại.
          </p>
        </div>

        <div className="text-sm">
          <div className="font-semibold">Shop</div>
          <div className="mt-3 flex flex-col gap-2 text-zinc-600">
            <Link className="bp-link w-fit" href="/products">All products</Link>
            <Link className="bp-link w-fit" href="/products?sort=best">Best sellers</Link>
            <Link className="bp-link w-fit" href="/products?collection=new">New arrivals</Link>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold">Support</div>
          <div className="mt-3 flex flex-col gap-2 text-zinc-600">
            <Link className="bp-link w-fit" href="/checkout">Checkout</Link>
            <Link className="bp-link w-fit" href="/cart">Cart</Link>
            <Link className="bp-link w-fit" href="/admin/login">Admin</Link>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold">Get 10% off</div>
          <p className="mt-3 text-zinc-600">
            Đăng ký email để nhận ưu đãi và cập nhật bộ sưu tập.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              className="w-full rounded-full border border-zinc-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="Email"
            />
            <button className="bp-btn bp-btn--solid">Join</button>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Blue Peach. All rights reserved.
      </div>
    </footer>
  );
}
export default async function HomePage() {
  const data = await getNewArrivals();

  return (
    <>
      <LuxHeader />
      <Hero />
      <CategoryTiles />
      <FeaturedEditorial />
      <ProductGrid products={data.items || []} />
      <Footer />
    </>
  );
}

