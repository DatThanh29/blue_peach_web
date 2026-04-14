"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Product = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  gia_goc: number;
  phan_tram_giam: number;
  primary_image: string;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function WishlistIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12.1 21.35 10.55 19.94C5.4 15.27 2 12.2 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.7-3.4 6.77-8.55 11.44l-1.35 1.23Z" />
    </svg>
  );
}

export default function BestSellersGrid({
  products,
}: {
  products: Product[];
}) {
  const visibleProducts = products.slice(0, 4);

  return (
    <section className="py-14 md:py-20">
      <div className="bp-container">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
            Được yêu thích
          </p>

          <h2 className="font-heading mt-4 text-4xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
            Bán chạy nhất
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#66707A] md:text-base">
            Những thiết kế được yêu thích và lựa chọn nhiều nhất tại Blue Peach.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 border-b border-r border-[#DED8CC] md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          {visibleProducts.map((p) => {
            const hasDiscount = p.phan_tram_giam > 0;

            return (
              <motion.div
                key={p.ma_san_pham}
                variants={itemVariants}
                className="border-l border-t border-[#DED8CC] bg-[#F8F8F5]"
              >
                <Link href={`/products/${p.ma_san_pham}`} className="group block h-full">
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Thêm vào danh sách yêu thích"
                      className="absolute right-4 top-4 z-10 text-[#8C8478] transition hover:text-[#1F1F1F]"
                    >
                      <WishlistIcon />
                    </button>

                    <div className="flex aspect-square items-center justify-center p-8 md:p-10">
                      <img
                        src={p.primary_image}
                        alt={p.ten_san_pham}
                        className="max-h-full max-w-full object-contain transition duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  <div className="px-4 pb-5 pt-3 md:px-5 md:pb-6">
                    <p className="text-[12px] font-medium text-[#8C8478]">
                      Bán chạy
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-[15px] font-medium leading-6 text-[#111111] md:text-[16px]">
                      {p.ten_san_pham}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[#6F6A63]">
                      Trang sức bạc Blue Peach tinh giản, nhẹ nhàng và thanh lịch cho mỗi ngày.
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-[15px] font-medium text-[#111111]">
                        {p.gia_ban.toLocaleString("vi-VN")}đ
                      </span>

                      {hasDiscount && (
                        <span className="text-[14px] text-[#8C8478] line-through">
                          {p.gia_goc.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}