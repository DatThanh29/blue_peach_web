import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

const STORES = [
  {
    name: "Blue Peach Tây Sơn",
    address: "22 Tây Sơn, Đống Đa, Hà Nội",
    mapUrl: "https://maps.app.goo.gl/iGCzA6VtDsMnwhLv6",
    embedSrc:
      "https://www.google.com/maps?q=22%20T%C3%A2y%20S%C6%A1n%2C%20%C4%90%E1%BB%91ng%20%C4%90a%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
  },
  {
    name: "Blue Peach Xuân Thủy",
    address: "47A Xuân Thuỷ, Cầu Giấy, Hà Nội",
    mapUrl: "https://maps.app.goo.gl/bYd7Ae8Qswxb1Z4y5",
    embedSrc:
      "https://www.google.com/maps?q=47A%20Xu%C3%A2n%20Thu%E1%BB%B7%2C%20C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
  },
];

export default function ContactPage() {
  const mainStore = STORES[0];

  return (
    <main className="bg-[#F7F6F2] text-[#1F1F1F]">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Liên hệ", active: true },
        ]}
      />

      <section className="bp-container py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
              Blue Peach Store
            </p>

            <h1 className="font-heading mt-4 text-4xl font-medium tracking-[-0.03em] text-[#1F1F1F] md:text-5xl">
              Ghé thăm Blue Peach
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#66707A] md:text-base">
              Trải nghiệm trực tiếp các thiết kế trang sức bạc tối giản, nữ tính
              và tinh tế tại cửa hàng Blue Peach.
            </p>

            <div className="mt-8 rounded-[28px] border border-[#DDD3C6] bg-[#FBFAF7] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.035)] md:p-8">
              <h2 className="text-xl font-semibold text-[#1F1F1F]">
                Thông tin liên hệ
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-[#4F5963]">
                <div className="flex gap-3">
                  <span className="mt-1 text-[#1F1F1F]">📍</span>
                  <div>
                    <p className="font-medium text-[#1F1F1F]">Cửa hàng</p>
                    <p>22 Tây Sơn, Đống Đa, Hà Nội</p>
                    <p>47A Xuân Thuỷ, Cầu Giấy, Hà Nội</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="mt-1 text-[#1F1F1F]">☎</span>
                  <div>
                    <p className="font-medium text-[#1F1F1F]">Số điện thoại</p>
                    <a href="tel:0975696925" className="transition hover:text-[#151515]">
                      097 569 69 25
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="mt-1 text-[#1F1F1F]">✉</span>
                  <div>
                    <p className="font-medium text-[#1F1F1F]">Email</p>
                    <a
                      href="mailto:bluepeachvietnam@gmail.com"
                      className="transition hover:text-[#151515]"
                    >
                      bluepeachvietnam@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-7 border-t border-[#E5DED4] pt-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7B8791]">
                  Liên hệ với chúng tôi
                </p>

                <form className="mt-5 space-y-4">
                  <input
                    type="text"
                    placeholder="Họ tên*"
                    className="h-12 w-full rounded-none border border-[#DDD3C6] bg-white px-4 text-sm outline-none transition focus:border-[#1F1F1F]"
                  />

                  <input
                    type="email"
                    placeholder="Email*"
                    className="h-12 w-full rounded-none border border-[#DDD3C6] bg-white px-4 text-sm outline-none transition focus:border-[#1F1F1F]"
                  />

                  <input
                    type="tel"
                    placeholder="Số điện thoại*"
                    className="h-12 w-full rounded-none border border-[#DDD3C6] bg-white px-4 text-sm outline-none transition focus:border-[#1F1F1F]"
                  />

                  <textarea
                    placeholder="Nhập nội dung*"
                    rows={5}
                    className="w-full resize-none rounded-none border border-[#DDD3C6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F1F1F]"
                  />

                  <button
                    type="button"
                    className="w-full rounded-none border border-[#1F1F1F] bg-[#1F1F1F] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Gửi liên hệ của bạn
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[28px] border border-[#DDD3C6] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
              <iframe
                src={mainStore.embedSrc}
                width="100%"
                height="620"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Blue Peach Google Map"
                className="min-h-[420px] w-full"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {STORES.map((store) => (
                <a
                  key={store.address}
                  href={store.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#DDD3C6] bg-white px-4 py-2.5 text-sm font-medium text-[#1F1F1F] transition hover:border-[#1F1F1F]/40"
                >
                  Chỉ đường: {store.name} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {STORES.map((store) => (
            <article
              key={store.address}
              className="rounded-[28px] border border-[#DDD3C6] bg-[#FBFAF7] p-6 md:p-7"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7B8791]">
                Store Location
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-[#1F1F1F]">
                {store.name}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#66707A]">
                {store.address}
              </p>

              <a
                href={store.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full border border-[#1F1F1F] bg-[#1F1F1F] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Mở trên Google Maps
              </a>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}