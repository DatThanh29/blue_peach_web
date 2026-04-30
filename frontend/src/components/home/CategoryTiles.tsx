"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const tiles = [
  {
    title: "Nhẫn đôi",
    href: "products?category=nhan-doi",
    img: "/home/categories/nhan-doi.png",
  },
  {
    title: "Khuyên tai",
    href: "products?category=khuyen-tai",
    img: "/home/categories/khuyen-tai.png",
  },
  {
    title: "Dây chuyền",
    href: "products?category=day-chuyen",
    img: "/home/categories/day-chuyen.png",
  },
  {
    title: "Lắc chân",
    href: "products?category=lac-chan",
    img: "/home/categories/lac-chan.png",
  },
  {
    title: "Vòng tay",
    href: "products?category=lac-tay",
    img: "/home/categories/lac-tay.png",
  },
  {
    title: "Nhẫn",
    href: "products?category=nhan",
    img: "/home/categories/nhan.png",
  },
  {
    title: "Vòng tay đôi",
    href: "products?category=lac-tay-doi",
    img: "/home/categories/lac-tay-doi.png",
  },

  {
    title: "Phụ kiện",
    href: "products?category=phu-kien",
    img: "/home/categories/phu-kien.jpg",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: custom * 0.06,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function CategoryTiles() {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-[1500px] px-4 md:px-6">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <h2 className="font-heading text-4xl font-medium tracking-[-0.02em] text-[#111111] md:text-5xl">
            Mua theo danh mục
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.title}
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={index}
            >
              <Link href={tile.href} className="group block">
                <div className="relative aspect-square overflow-hidden bg-[#F3F3F3]">
                  <img
                    src={tile.img}
                    alt={tile.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="pt-3 text-center">
                  <h3 className="text-[15px] font-normal tracking-[0.01em] text-[#222222] md:text-base">
                    {tile.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}