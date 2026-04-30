"use client";

import Link from "next/link";
import { useState } from "react";

type CollectionCardData = {
  slug: string;
  ten_bo_suu_tap: string;
  mo_ta_ngan?: string | null;
  anh_the?: string | null;
  product_count?: number;
  noi_bat?: boolean;
};

export default function CollectionCard({
  collection,
}: {
  collection: CollectionCardData;
}) {
  const [imageError, setImageError] = useState(false);
  const showImage = !!collection.anh_the && !imageError;

  return (
    <article className="group overflow-hidden border border-[#DED8CC] bg-[#F8F8F5] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
      <Link href={`/collections/${collection.slug}`} className="block">
        <div className="overflow-hidden border-b border-[#DED8CC] bg-[#F3EEE6]">
          {showImage ? (
            <img
              src={collection.anh_the!}
              alt={collection.ten_bo_suu_tap}
              className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center text-sm text-[#8C8478]">
              Chưa có ảnh bộ sưu tập
            </div>
          )}
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#7B8791]">
              Bộ sưu tập
            </span>

            {collection.noi_bat ? (
              <span className="border border-[#DED8CC] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#1F1F1F]">
                Nổi bật
              </span>
            ) : null}
          </div>

          <h2 className="font-heading mt-4 text-3xl font-medium leading-none tracking-[-0.02em] text-[#1F1F1F] md:text-4xl">
            {collection.ten_bo_suu_tap}
          </h2>

          {collection.mo_ta_ngan ? (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#66707A]">
              {collection.mo_ta_ngan}
            </p>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-sm text-[#66707A]">
              {typeof collection.product_count === "number"
                ? `${collection.product_count} sản phẩm`
                : "Khám phá ngay"}
            </span>

            <span className="bp-link text-sm font-semibold text-[#1F1F1F]">
              Xem bộ sưu tập
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}