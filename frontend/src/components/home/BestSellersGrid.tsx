"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

type Product = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  gia_goc: number;
  phan_tram_giam: number;
  primary_image: string;
};

const PAGE_SIZE = 4;

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function BestSellersGrid({
  products,
}: {
  products: Product[];
}) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const groupedProducts = useMemo(() => {
    const groups: Product[][] = [];

    for (let i = 0; i < products.length; i += PAGE_SIZE) {
      groups.push(products.slice(i, i + PAGE_SIZE));
    }

    return groups;
  }, [products]);

  const totalPages = groupedProducts.length;
  const visibleProducts = groupedProducts[page] ?? [];
  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  function handlePrev() {
    if (!canGoPrev) return;
    setDirection(-1);
    setPage((prev) => prev - 1);
  }

  function handleNext() {
    if (!canGoNext) return;
    setDirection(1);
    setPage((prev) => prev + 1);
  }

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

        <div className="mb-5 flex items-center justify-between">
          <div className="text-sm text-[#8C8478]">
            {totalPages > 0 ? `${page + 1} / ${totalPages}` : "0 / 0"}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoPrev}
                aria-label="Xem nhóm sản phẩm trước"
                className={[
                  "inline-flex h-11 w-11 items-center justify-center border text-lg transition",
                  canGoPrev
                    ? "border-[#D7CFC2] bg-white text-[#1F1F1F] hover:bg-[#F6F1E8]"
                    : "cursor-not-allowed border-[#E7E0D6] bg-[#F4EFE7] text-[#B7AEA1]",
                ].join(" ")}
              >
                ←
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                aria-label="Xem nhóm sản phẩm tiếp theo"
                className={[
                  "inline-flex h-11 w-11 items-center justify-center border text-lg transition",
                  canGoNext
                    ? "border-[#1F1F1F] bg-[#1F1F1F] text-white hover:opacity-90"
                    : "cursor-not-allowed border-[#E7E0D6] bg-[#F4EFE7] text-[#B7AEA1]",
                ].join(" ")}
              >
                →
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 border-b border-r border-[#DED8CC] md:grid-cols-4"
              variants={containerVariants}
            >
              {visibleProducts.map((p) => (
                <motion.div key={p.ma_san_pham} variants={itemVariants}>
                  <ProductCard
                    product={p}
                    badgeText="Bán chạy"
                    description="Trang sức bạc Blue Peach tinh giản, nhẹ nhàng và thanh lịch cho mỗi ngày."
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}