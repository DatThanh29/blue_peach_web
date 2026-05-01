"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const leftItems = [
  "Chất liệu bạc 925 chọn lọc",
  "Chế tác chỉn chu và tinh tế",
  "Đóng gói sẵn sàng làm quà tặng",
];

const rightItems = [
  "Thiết kế tối giản, bền với thời gian",
  "Êm nhẹ và dễ đeo mỗi ngày",
  "Trải nghiệm mua sắm an tâm",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const chipVariant = {
  hidden: { opacity: 0, x: 20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const chipVariantLeft = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function ReasonChip({
  text,
  align = "left",
  index,
}: {
  text: string;
  align?: "left" | "right";
  index: number;
}) {
  const isLeft = align === "left";

  const chipClass = isLeft
    ? "border-[#D5C5AF] bg-[linear-gradient(180deg,#F6ECDD_0%,#EEDFCB_100%)] text-[#3A332C] shadow-[0_8px_22px_rgba(31,31,31,0.04)]"
    : "border-[#DCCDB9] bg-[linear-gradient(180deg,#FBF4EA_0%,#F3E7D8_100%)] text-[#403831] shadow-[0_8px_22px_rgba(31,31,31,0.035)]";

  const dotClass = isLeft ? "bg-[#BCA88E]" : "bg-[#C6B39A]";

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={isLeft ? chipVariantLeft : chipVariant}
      className={`flex items-center gap-3 ${isLeft ? "justify-end" : "justify-start"}`}
    >
      {!isLeft && <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />}

      <div
        className={[
          "rounded-full border px-4 py-2.5 text-sm backdrop-blur-sm transition duration-300",
          "hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(31,31,31,0.05)]",
          chipClass,
        ].join(" ")}
      >
        {text}
      </div>

      {isLeft && <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />}
    </motion.div>
  );
}

export default function WhyBluePeach() {
  return (
    <section className="py-14 md:py-18">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="bp-container"
      >
        <div className="rounded-[32px] border border-[#E1D6C9] bg-[linear-gradient(180deg,#F6F0E5_0%,#EFE6D9_100%)] px-6 py-12 shadow-[0_18px_44px_rgba(31,31,31,0.035)] md:px-10 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8A7D6D]">
              Blue Peach Values
            </p>

            <h2 className="font-heading mt-4 text-4xl font-medium leading-none tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
              Vì sao chọn Blue Peach
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#66707A] md:text-base">
              Từ chất liệu bạc 925 chọn lọc đến trải nghiệm mua sắm chỉn chu,
              Blue Peach hướng đến vẻ đẹp tối giản, tinh tế và bền vững theo thời gian.
            </p>
          </div>

          <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_360px_1fr] md:gap-6 lg:grid-cols-[1fr_420px_1fr]">
            <div className="hidden space-y-6 md:block">
              {leftItems.map((item, index) => (
                <ReasonChip key={item} text={item} align="left" index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto"
            >
              <div className="absolute inset-0 rounded-full bg-[#D9CCBC] blur-2xl opacity-65" />
              <div className="relative overflow-hidden rounded-full border border-[#D8C9B7] bg-[linear-gradient(180deg,#FBF5EB_0%,#F2E6D7_100%)] p-2 shadow-[0_12px_40px_rgba(31,31,31,0.06)]">
                <img
                  src="/home/whybluepeach.jpg"
                  alt="Why Blue Peach"
                  className="h-[280px] w-[280px] rounded-full object-cover md:h-[340px] md:w-[340px] lg:h-[380px] lg:w-[380px]"
                />
              </div>
            </motion.div>

            <div className="hidden space-y-6 md:block">
              {rightItems.map((item, index) => (
                <ReasonChip key={item} text={item} align="right" index={index} />
              ))}
            </div>

            <div className="grid gap-3 md:hidden">
              {[...leftItems, ...rightItems].map((item, index) => (
                <motion.div
                  key={item}
                  custom={index}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={chipVariant}
                  className="rounded-full border border-[#D9CCBA] bg-[linear-gradient(180deg,#F8F1E6_0%,#F0E5D7_100%)] px-4 py-3 text-center text-sm text-[#1F1F1F] shadow-[0_6px_18px_rgba(31,31,31,0.03)]"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 text-center"
          >
            <Link
              href="/about"
              className="bp-link inline-flex items-center gap-2 text-sm font-medium text-[#1F1F1F]"
            >
              Tìm hiểu thêm về Blue Peach
              <span aria-hidden>↗</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}