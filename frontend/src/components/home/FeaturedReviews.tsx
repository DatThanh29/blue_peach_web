"use client";

import Link from "next/link";
import { slugify } from "@/utils/slug";
import { motion } from "framer-motion";

type FeaturedReviewItem = {
    ma_danh_gia: string;
    ma_san_pham: string;
    ten_nguoi_danh_gia: string;
    so_sao: number;
    noi_dung: string;
    ngay_tao: string;
    products?: {
        ma_san_pham?: string;
        ten_san_pham?: string;
        primary_image?: string;
    } | null;
};

function StarRating({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-1" aria-label={`${value} trên 5 sao`}>
            {Array.from({ length: 5 }).map((_, idx) => {
                const filled = idx < value;
                return (
                    <span key={idx} className={filled ? "text-[#1F1F1F]" : "text-[#CFC8BB]"}>
                        ★
                    </span>
                );
            })}
        </div>
    );
}

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
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

export default function FeaturedReviews({
    reviews,
}: {
    reviews: FeaturedReviewItem[];
}) {
    if (!reviews || reviews.length === 0) return null;

    const visibleReviews = reviews.slice(0, 3);

    return (
        <section className="py-14 md:py-20">
            <div className="bp-container">
                <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                        Khách hàng nói gì
                    </p>

                    <h2 className="font-heading mt-4 text-4xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
                        Đánh giá nổi bật
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-[#66707A] md:text-base">
                        Những chia sẻ nổi bật từ khách hàng Blue Peach sau khi trải nghiệm sản phẩm.
                    </p>
                </div>

                <motion.div
                    className="grid gap-4 md:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {visibleReviews.map((review) => {
                        const productId = review.products?.ma_san_pham || review.ma_san_pham;
                        const productName = review.products?.ten_san_pham || "Sản phẩm Blue Peach";
                        const productImage = review.products?.primary_image;

                        return (
                            <motion.article
                                key={review.ma_danh_gia}
                                variants={itemVariants}
                                className="flex h-full flex-col border border-[#DED8CC] bg-[#F8F8F5] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(31,31,31,0.06)]"
                            >
                                {productImage ? (
                                        <Link
                                            href={`/products/${slugify(productName)}-${productId}`}
                                            className="block border-b border-[#DED8CC] bg-[#F3F1EB]"
                                        >
                                        <div className="flex aspect-[4/3] items-center justify-center p-6">
                                            {productImage ? (
                                                <img
                                                    src={productImage}
                                                    alt={productName}
                                                    className="max-h-full max-w-full object-contain transition duration-500 hover:scale-[1.03]"
                                                />
                                            ) : (
                                                <div className="text-sm text-[#8C8478]">Blue Peach</div>
                                            )}
                                        </div>
                                    </Link>
                                ) : null}

                                <div className="flex flex-1 flex-col p-5 md:p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-[15px] font-medium text-[#1F1F1F]">
                                                {review.ten_nguoi_danh_gia}
                                            </h3>
                                            <p className="mt-1 text-xs text-[#8C8478]">
                                                {new Date(review.ngay_tao).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>

                                        <StarRating value={review.so_sao} />
                                    </div>

                                    <p className="mt-4 flex-1 text-sm leading-7 text-[#555C63] line-clamp-4">
                                        “{review.noi_dung}”
                                    </p>

                                    <div className="mt-5 border-t border-[#DED8CC] pt-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C8478]">
                                            Sản phẩm
                                        </p>

                                        <Link
                                            href={`/products/${slugify(productName)}-${productId}`}
                                            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#1F1F1F] transition hover:opacity-70"
                                        >
                                            {productName}
                                            <span aria-hidden>→</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}