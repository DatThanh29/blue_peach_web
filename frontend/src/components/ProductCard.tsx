"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Toast from "@/components/Toast";
import AddToCartButton from "@/components/AddToCartButton";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useState } from "react";
import { slugify } from "@/utils/slug";
import { formatShortCode } from "@/utils/formatCode";

export type ProductCardData = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  gia_goc?: number;
  phan_tram_giam?: number;
  primary_image: string | null;
  so_luong_ton?: number;
};

function WishlistIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12.1 21.35 10.55 19.94C5.4 15.27 2 12.2 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.7-3.4 6.77-8.55 11.44l-1.35 1.23Z" />
    </svg>
  );
}

export default function ProductCard({
  product,
  badgeText,
  description,
  showAddToCart = false,
  showStock = false,
  compactGrid = false,
}: {
  product: ProductCardData;
  badgeText: string;
  description?: string;
  showAddToCart?: boolean;
  showStock?: boolean;
  compactGrid?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useCustomerAuth();
  const { isWishlisted, toggleWishlist, isToggling } = useWishlist();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const active = isWishlisted(product.ma_san_pham);
  const toggling = isToggling(product.ma_san_pham);
  const hasDiscount = !!product.phan_tram_giam && product.phan_tram_giam > 0;
  const shortId = formatShortCode(product.ma_san_pham, "", 8);

  async function handleWishlistClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/products")}`);
      return;
    }

    try {
      await toggleWishlist(product.ma_san_pham);
      setToast({
        message: active
          ? "Đã xoá khỏi danh sách yêu thích"
          : "Đã thêm vào danh sách yêu thích",
        type: "success",
      });
    } catch (error: any) {
      if (error?.message === "AUTH_REQUIRED") {
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/products")}`);
        return;
      }

      setToast({
        message: "Không thể cập nhật wishlist lúc này.",
        type: "error",
      });
    }
  }

  return (
    <>
      <article
        className={[
          "group flex h-full flex-col border-l border-t border-[#E3DBCF] bg-[#FBFAF7] transition duration-300",
          "hover:bg-white",
          compactGrid ? "" : "",
        ].join(" ")}
      >
        <Link href={`/products/${slugify(product.ten_san_pham)}-${product.ma_san_pham}`} className="block flex-1">
          <div className="relative overflow-hidden">
            <button
              type="button"
              aria-label="Thêm vào danh sách yêu thích"
              onClick={handleWishlistClick}
              disabled={toggling}
              className={[
                "absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2.5 shadow-sm backdrop-blur transition",
                active ? "text-[#D14B5A]" : "text-[#8C8478] hover:text-[#1F1F1F]",
                toggling ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
            >
              <WishlistIcon active={active} />
            </button>

            <div className="relative flex aspect-square items-center justify-center bg-[linear-gradient(180deg,#FCFBF8_0%,#F2ECE3_100%)] p-8 md:p-10">
              {product.primary_image ? (
                <img
                  src={product.primary_image}
                  alt={product.ten_san_pham}
                  className="max-h-full max-w-full object-contain transition duration-700 group-hover:scale-[1.045]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#66707A]">
                  Chưa có ảnh
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/[0.03] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            </div>
          </div>

          <div className="flex min-h-[178px] flex-col px-5 pb-5 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C8478]">
              {badgeText}
            </p>

            <h3 className="mt-3 line-clamp-2 min-h-[48px] text-[15px] font-medium leading-6 text-[#111111] md:text-[16px]">
              {product.ten_san_pham}
            </h3>

            {description ? (
              <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#6F6A63]">
                {description}
              </p>
            ) : null}

            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[16px] font-medium tracking-[-0.01em] text-[#111111]">
                  {Number(product.gia_ban).toLocaleString("vi-VN")}đ
                </span>

                {hasDiscount && product.gia_goc ? (
                  <span className="text-[13px] text-[#8C8478] line-through">
                    {Number(product.gia_goc).toLocaleString("vi-VN")}đ
                  </span>
                ) : null}
              </div>

              {showStock && typeof product.so_luong_ton === "number" ? (
                <span className="shrink-0 text-[11px] text-[#8C8478]">
                  Tồn kho: {product.so_luong_ton}
                </span>
              ) : null}
            </div>
          </div>
        </Link>

        {showAddToCart ? (
          <div className="mt-auto px-5 pb-6">
            <AddToCartButton
              ma_san_pham={product.ma_san_pham}
              ten_san_pham={product.ten_san_pham}
              gia_ban={product.gia_ban}
              primary_image={product.primary_image}
            />
          </div>
        ) : null}
      </article>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}