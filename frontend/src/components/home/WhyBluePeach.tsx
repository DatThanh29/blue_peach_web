"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const leftItems = [
  "925 Silver Quality",
  "Thoughtful Craftsmanship",
  "Gift-ready Packaging",
];

const rightItems = [
  "Minimal Timeless Design",
  "Everyday Wear Comfort",
  "Secure Shopping Experience",
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

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={isLeft ? chipVariantLeft : chipVariant}
      className={`flex items-center gap-3 ${isLeft ? "justify-end" : "justify-start"}`}
    >
      {!isLeft && <span className="h-2.5 w-2.5 rounded-full bg-[#CFC8BB]" />}
      <div className="rounded-full border border-[#D8D1C5] bg-white/70 px-4 py-2 text-sm text-[#1F1F1F] shadow-[0_6px_20px_rgba(31,31,31,0.03)]">
        {text}
      </div>
      {isLeft && <span className="h-2.5 w-2.5 rounded-full bg-[#CFC8BB]" />}
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
        className="bp-container px-6 py-12 md:px-10 md:py-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl font-medium leading-none tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
            Why Blue Peach
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#66707A] md:text-base">
            Tinh tế trong thiết kế, chỉn chu trong trải nghiệm và đủ nhẹ nhàng để đồng hành cùng vẻ đẹp thường ngày.
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
            <div className="absolute inset-0 rounded-full bg-[#DDD6CA] blur-2xl opacity-60" />
            <div className="relative overflow-hidden rounded-full border border-[#D8D1C5] bg-white/80 p-2 shadow-[0_12px_40px_rgba(31,31,31,0.06)]">
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
                className="rounded-full border border-[#D8D1C5] bg-white/75 px-4 py-3 text-center text-sm text-[#1F1F1F]"
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
            Learn more about Blue Peach
            <span aria-hidden>↗</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}