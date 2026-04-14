"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    eyebrow: "SILVER ESSENTIALS",
    title: "Minimal pieces for everyday elegance.",
    desc: "Những thiết kế bạc tinh giản, dễ phối và luôn vừa đủ để nâng tầm trang phục hằng ngày.",
    image: "/home/hero-1.jpg",
    primaryHref: "/products?sort=new",
    primaryLabel: "Xem hàng mới về",
    secondaryHref: "/products?category=necklaces",
    secondaryLabel: "Xem dây chuyền",
  },
  {
    id: 2,
    eyebrow: "GIFT EDIT",
    title: "Delicate silver made for thoughtful gifting.",
    desc: "Tuyển chọn những món quà nhỏ nhưng tinh tế, phù hợp cho sinh nhật, kỷ niệm và những dịp đặc biệt.",
    image: "/home/hero-2.jpg",
    primaryHref: "/products?sort=best",
    primaryLabel: "Xem bán chạy",
    secondaryHref: "/products?category=rings",
    secondaryLabel: "Xem nhẫn",
  },
  {
    id: 3,
    eyebrow: "EVERYDAY SHINE",
    title: "Quiet luxury in soft, wearable details.",
    desc: "Blue Peach hướng đến vẻ đẹp thanh lịch, nhẹ nhàng và hiện đại cho nhịp sống mỗi ngày.",
    image: "/home/hero-3.jpg",
    primaryHref: "/products?category=earrings",
    primaryLabel: "Xem khuyên tai",
    secondaryHref: "/products?category=bracelets",
    secondaryLabel: "Xem vòng tay",
  },
];

export default function HeroSlider() {
  return (
    <section className="pt-10 pb-12 md:pt-12 md:pb-16">
      <div className="bp-container">
        <div className="mb-8 md:mb-10">
          <h2 className="font-heading mt-3 text-4xl font-medium leading-none tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
            Bộ sưu tập nổi bật
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66707A] md:text-base">
            Những lựa chọn nổi bật mang tinh thần Blue Peach: tối giản, nữ tính và tinh tế.
          </p>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-[#D5DEE6] bg-[#EEF3F7] p-4 shadow-[0_10px_30px_rgba(31,31,31,0.04)] md:p-6">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop
            speed={700}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            className="hero-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="grid items-center gap-6 md:grid-cols-[0.92fr_1.08fr] md:gap-8">
                  <div className="order-2 flex flex-col justify-center rounded-[28px] border border-[#D5DEE6] bg-[#F8F9FB] p-6 md:order-1 md:p-8">
                    <p className="text-[11px] font-semibold tracking-[0.32em] text-[#66707A] md:text-xs">
                      {slide.eyebrow}
                    </p>

                    <h3 className="font-heading mt-4 max-w-[14ch] text-4xl font-medium leading-[0.95] tracking-[-0.02em] text-[#1F1F1F] md:text-6xl">
                      {slide.title}
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-[#66707A] md:text-base">
                      {slide.desc}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link className="bp-btn bp-btn--solid" href={slide.primaryHref}>
                        {slide.primaryLabel}
                      </Link>
                      <Link className="bp-btn bp-btn--ghost" href={slide.secondaryHref}>
                        {slide.secondaryLabel}
                      </Link>
                    </div>
                  </div>

                  <div className="order-1 overflow-hidden rounded-[28px] border border-[#D5DEE6] bg-[#F8F9FB] md:order-2">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-[340px] w-full object-cover md:h-[460px]"
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