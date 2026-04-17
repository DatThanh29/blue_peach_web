"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

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
      </div>
    </section>
  );
}