"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    eyebrow: "BỘ SƯU TẬP 01",
    collectionName: "Clover & Moonstone",
    title: "Nhẹ nhàng, may mắn và tinh tế trong từng chi tiết bạc.",
    desc: "Một tuyển chọn mang cảm hứng từ cỏ bốn lá và moonstone — dịu dàng, nữ tính và phù hợp cho phong cách thanh lịch mỗi ngày.",
    image: "/collections/timeless-hero.jpg",
    primaryHref: "/collections/clover-moonstone",
    primaryLabel: "Khám phá bộ sưu tập",
    secondaryHref: "/collections",
    secondaryLabel: "Xem tất cả bộ sưu tập",
    accent: "bg-[#E8EEF3] text-[#5F7488]",
    panel: "bg-[#F8F8F5]",
    imagePanel: "bg-[#EEF3F7]",
  },
  {
    id: 2,
    eyebrow: "BỘ SƯU TẬP 02",
    collectionName: "Celestial Butterfly",
    title: "Mềm mại như ánh trăng và chuyển động của đôi cánh bướm.",
    desc: "Những thiết kế lấy cảm hứng từ bướm, bầu trời đêm và ánh sáng dịu — mang tinh thần thơ mộng nhưng vẫn hiện đại của Blue Peach.",
    image: "/collections/softminimal-hero.jpg",
    primaryHref: "/collections/celestial-butterfly",
    primaryLabel: "Xem bộ sưu tập này",
    secondaryHref: "/products?sort=new",
    secondaryLabel: "Khám phá hàng mới",
    accent: "bg-[#F3E9EC] text-[#8A6671]",
    panel: "bg-[#FBF8F6]",
    imagePanel: "bg-[#F4ECE7]",
  },
  {
    id: 3,
    eyebrow: "BỘ SƯU TẬP 03",
    collectionName: "Heart & Infinity",
    title: "Một lựa chọn có ý nghĩa cho quà tặng và những kỷ niệm đẹp.",
    desc: "Tập hợp những thiết kế mang biểu tượng trái tim và kết nối — phù hợp cho quà tặng, dịp đặc biệt và những món trang sức có chiều sâu cảm xúc.",
    image: "/collections/gifted-hero.jpg",
    primaryHref: "/collections/heart-infinity",
    primaryLabel: "Khám phá ngay",
    secondaryHref: "/products?sort=best",
    secondaryLabel: "Xem sản phẩm bán chạy",
    accent: "bg-[#EFE9F6] text-[#786892]",
    panel: "bg-[#FAF8FC]",
    imagePanel: "bg-[#F3EEF8]",
  },
];

export default function HeroSlider() {
  return (
    <section className="pt-8 pb-10 md:pt-10 md:pb-14">
      <div className="bp-container">
        <div className="mb-8 md:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
            Tuyển chọn nổi bật
          </p>

          <h2 className="font-heading mt-4 text-4xl font-medium leading-none tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
            Những bộ sưu tập mang tinh thần Blue Peach
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66707A] md:text-base">
            Mỗi bộ sưu tập là một cách kể chuyện khác nhau — vẫn tối giản, nữ tính và tinh tế, nhưng mang sắc thái riêng cho từng khoảnh khắc.
          </p>
        </div>

        <div className="overflow-hidden rounded-[34px] border border-[#D9D0C3] bg-gradient-to-br from-[#EEE7DC] to-[#E7DFD2] p-4 shadow-[0_14px_36px_rgba(31,31,31,0.05)] md:p-6">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            speed={750}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            className="hero-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="grid items-stretch gap-6 md:grid-cols-[0.92fr_1.08fr] md:gap-8">
                  <div
                    className={[
                      "order-2 flex h-full flex-col justify-center rounded-[28px] border border-[#DDD3C6] p-6 md:order-1 md:min-h-[500px] md:p-9",
                      slide.panel,
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791] md:text-xs">
                        {slide.eyebrow}
                      </span>

                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.08em]",
                          slide.accent,
                        ].join(" ")}
                      >
                        {slide.collectionName}
                      </span>
                    </div>

                    <h3 className="font-heading mt-6 max-w-[12ch] text-[46px] font-medium leading-[0.94] tracking-[-0.03em] text-[#1F1F1F] md:text-[64px]">
                      {slide.title}
                    </h3>

                    <p className="mt-5 max-w-[56ch] text-sm leading-7 text-[#66707A] md:text-base">
                      {slide.desc}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link className="bp-btn bp-btn--solid" href={slide.primaryHref}>
                        {slide.primaryLabel}
                      </Link>

                      <Link className="bp-btn bp-btn--ghost" href={slide.secondaryHref}>
                        {slide.secondaryLabel}
                      </Link>
                    </div>
                  </div>

                  <div
                    className={[
                      "order-1 overflow-hidden rounded-[28px] border border-[#DDD3C6] md:order-2 md:min-h-[500px]",
                      slide.imagePanel,
                    ].join(" ")}
                  >
                    <img
                      src={slide.image}
                      alt={slide.collectionName}
                      className="h-[320px] w-full object-cover md:h-[500px]"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}   