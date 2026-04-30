import Link from "next/link";

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/bluepeach.silver/",
  facebook: "https://www.facebook.com/bluepeach.vn",
  tiktok: "https://www.tiktok.com/@bluepeach.silver",
};

export default function CustomerFooter() {
  return (
    <footer className="border-t border-[#D5DEE6] bg-[#EEF3F7] text-[#151515]">
      <div className="bp-container py-14 md:py-16">
        <div className="grid gap-10 border-b border-[#DED5C8] pb-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="text-xl font-semibold tracking-[0.22em] text-[#151515]">
              BLUE PEACH
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#4F5963]">
              Trang sức bạc mang tinh thần tối giản, nữ tính và tinh tế — dành
              cho vẻ đẹp thường ngày và những khoảnh khắc đặc biệt.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Blue Peach"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CDBF] bg-white/70 text-[#1F1F1F] transition hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
              >
                <InstagramIcon />
              </a>

              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Blue Peach"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CDBF] bg-white/70 text-[#1F1F1F] transition hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
              >
                <FacebookIcon />
              </a>

              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok Blue Peach"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CDBF] bg-white/70 text-[#1F1F1F] transition hover:-translate-y-[1px] hover:bg-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#151515]">
              Mua sắm
            </h3>

            <div className="mt-5 space-y-3 text-sm text-[#4F5963]">
              <Link href="/products" className="block transition hover:text-[#151515]">
                Tất cả sản phẩm
              </Link>
              <Link href="/products?sort=new" className="block transition hover:text-[#151515]">
                Hàng mới về
              </Link>
              <Link href="/products?sort=best" className="block transition hover:text-[#151515]">
                Bán chạy nhất
              </Link>
              <Link href="/collections" className="block transition hover:text-[#151515]">
                Bộ sưu tập
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#151515]">
              Giới thiệu
            </h3>

            <div className="mt-5 space-y-3 text-sm text-[#4F5963]">
              <Link href="/about" className="block transition hover:text-[#151515]">
                Về thương hiệu
              </Link>
              <Link href="/sustainability" className="block transition hover:text-[#151515]">
                Tính bền vững
              </Link>
              <Link href="/careers" className="block transition hover:text-[#151515]">
                Tuyển dụng
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#151515]">
              Hỗ trợ
            </h3>

            <div className="mt-5 space-y-3 text-sm text-[#4F5963]">
              <Link href="/returns" className="block transition hover:text-[#151515]">
                Đổi và trả hàng
              </Link>
              <Link href="/privacy-policy" className="block transition hover:text-[#151515]">
                Chính sách bảo mật
              </Link>
              <Link href="/inspection-policy" className="block transition hover:text-[#151515]">
                Chính sách kiểm hàng
              </Link>
              <Link href="/shipping-policy" className="block transition hover:text-[#151515]">
                Chính sách vận chuyển
              </Link>
              <Link href="/payment-policy" className="block transition hover:text-[#151515]">
                Chính sách thanh toán
              </Link>
              <Link href="/contact" className="block transition hover:text-[#151515]">
                Liên hệ
              </Link>
            </div>
          </div>

          {/* <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#151515]">
              Giới thiệu
            </h3>

            <div className="mt-5 space-y-3 text-sm text-[#4F5963]">
              <Link href="/about" className="block transition hover:text-[#151515]">
                Về thương hiệu
              </Link>
              <Link href="/sustainability" className="block transition hover:text-[#151515]">
                Tính bền vững
              </Link>
              <Link href="/careers" className="block transition hover:text-[#151515]">
                Tuyển dụng
              </Link>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-[#7C746B] md:flex-row md:items-center md:justify-between">
          <p>© 2016 Blue Peach. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>Trang sức bạc tối giản</span>
            <span className="hidden md:inline">•</span>
            <span>Thiết kế tinh tế mỗi ngày</span>
            <span className="hidden md:inline">•</span>
            <span>Blue Peach Official</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.6 1.7-1.6H16.5V4.8c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.5v3h2.3v7h2.7Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.8 3c.3 2 1.4 3.8 3.2 4.8 1 .6 2.1.9 3.2 1v2.7c-1.6-.1-3.2-.6-4.6-1.4v6.4c0 3.2-2.6 5.8-5.8 5.8S5 19.7 5 16.5s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v2.8a3.4 3.4 0 0 0-.9-.1 3 3 0 1 0 3 3V3h1Z" />
    </svg>
  );
} 