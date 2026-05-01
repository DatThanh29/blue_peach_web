"use client";

import { formatShortCode } from "@/utils/formatCode";
import { slugify } from "@/utils/slug";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import Toast from "@/components/Toast";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { usePathname, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { authFetch } from "@/lib/api";

type ProductDetail = {
  ma_san_pham: string;
  sku: string;
  ten_san_pham: string;
  mo_ta_san_pham?: string;
  gia_ban: number;
  gia_goc?: number;
  phan_tram_giam?: number;
  so_luong_ton: number;
  primary_image?: string;
  url_san_pham?: string;
  ma_danh_muc?: string;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
  images?: Array<{
    duong_dan_anh: string;
    la_anh_chinh: boolean;
    thu_tu: number;
  }>;
};

type ProductReview = {
  ma_danh_gia: string;
  ten_nguoi_danh_gia: string;
  so_sao: number;
  noi_dung: string;
  ngay_tao: string;
};

type ProductReviewsResponse = {
  summary: {
    average_rating: number;
    total_reviews: number;
  };
  items: ProductReview[];
};

type ProductDetailClientProps = {
  product: ProductDetail;
  reviewsData: ProductReviewsResponse;
  relatedProducts: RelatedProduct[];
};

type RelatedProduct = {
  ma_san_pham: string;
  sku?: string;
  ten_san_pham: string;
  gia_ban: number;
  gia_goc?: number;
  phan_tram_giam?: number;
  so_luong_ton?: number;
  primary_image: string | null;
  ma_danh_muc?: string | null;
  ngay_tao?: string;
  is_bestseller?: boolean;
};

function flyToCart(imageSrc?: string) {
  const cart = document.getElementById("cart-icon");
  const source = document.getElementById("product-main-image");

  if (!cart || !source || !imageSrc) return;

  const sourceRect = source.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  const flyer = document.createElement("img");
  flyer.src = imageSrc;
  flyer.alt = "Flying product image";
  flyer.style.position = "fixed";
  flyer.style.left = `${sourceRect.left + sourceRect.width / 2 - 40}px`;
  flyer.style.top = `${sourceRect.top + sourceRect.height / 2 - 40}px`;
  flyer.style.width = "80px";
  flyer.style.height = "80px";
  flyer.style.objectFit = "cover";
  flyer.style.borderRadius = "999px";
  flyer.style.pointerEvents = "none";
  flyer.style.zIndex = "9999";
  flyer.style.transition =
    "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.4s ease";
  flyer.style.boxShadow = "0 12px 30px rgba(0,0,0,0.16)";
  flyer.style.border = "1px solid rgba(0,0,0,0.08)";
  flyer.style.background = "#fff";

  document.body.appendChild(flyer);

  requestAnimationFrame(() => {
    const translateX =
      cartRect.left + cartRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const translateY =
      cartRect.top + cartRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

    flyer.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.22)`;
    flyer.style.opacity = "0.15";
  });

  setTimeout(() => {
    flyer.remove();
  }, 1450);
}

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

function InfoPill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "soft" | "accent";
}) {
  const toneClass =
    tone === "accent"
      ? "border-[#D8CDD9] bg-[#F5EDF6] text-[#6D6179]"
      : tone === "soft"
        ? "border-[#DCD4C8] bg-[#F4EEE5] text-[#7C7267]"
        : "border-[#DED8CC] bg-white/70 text-[#66707A]";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.04em]",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function ProductDetailClient({
  product,
  reviewsData,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useCustomerAuth();
  const { isWishlisted, toggleWishlist, isToggling } = useWishlist();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const wishlisted = isWishlisted(product.ma_san_pham);
  const wishlistLoading = isToggling(product.ma_san_pham);

  const displayImages = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return [...product.images].sort((a, b) => {
        if (a.la_anh_chinh !== b.la_anh_chinh) {
          return a.la_anh_chinh ? -1 : 1;
        }
        return Number(a.thu_tu || 0) - Number(b.thu_tu || 0);
      });
    }

    if (product.primary_image) {
      return [
        {
          duong_dan_anh: product.primary_image,
          la_anh_chinh: true,
          thu_tu: 0,
        },
      ];
    }

    return [];
  }, [product.images, product.primary_image]);

  const activeImage = displayImages[selectedImage] ?? displayImages[0];
  const hasDiscount = !!product.phan_tram_giam && product.phan_tram_giam > 0;
  const inStock = product.so_luong_ton > 0;

  const reviewSummary = reviewsData?.summary ?? {
    average_rating: 0,
    total_reviews: 0,
  };
  const reviewItems = reviewsData?.items ?? [];

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) =>
          displayImages.length > 0 ? (prev + 1) % displayImages.length : prev
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedImage((prev) =>
          displayImages.length > 0
            ? (prev - 1 + displayImages.length) % displayImages.length
            : prev
        );
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, displayImages.length]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/products")}`);
      return;
    }

    const imageToFly =
      activeImage?.duong_dan_anh || product.primary_image || undefined;

    flyToCart(imageToFly);

    addToCart(
      {
        ma_san_pham: product.ma_san_pham,
        ten_san_pham: product.ten_san_pham,
        gia_ban: product.gia_ban,
        primary_image: product.primary_image ?? null,
      },
      1
    );

    setToastMessage("Đã thêm vào giỏ hàng");
  };

  async function handleToggleWishlist() {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          pathname || `/products/${slugify(product.ten_san_pham)}-${product.ma_san_pham}`
        )}`
      );
      return;
    }

    try {
      await toggleWishlist(product.ma_san_pham);
      setToastMessage(
        wishlisted
          ? "Đã xoá khỏi danh sách yêu thích"
          : "Đã thêm vào danh sách yêu thích"
      );
    } catch (error) {
      console.error("[ProductDetailClient] toggleWishlist failed:", error);
      setToastMessage("Không thể cập nhật wishlist lúc này");
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          pathname || `/products/${slugify(product.ten_san_pham)}-${product.ma_san_pham}`
        )}`
      );
      return;
    }

    setReviewError(null);

    if (reviewContent.trim().length < 10) {
      setReviewError("Nội dung đánh giá cần tối thiểu 10 ký tự.");
      return;
    }

    try {
      setReviewSubmitting(true);

      await authFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({
          ma_san_pham: product.ma_san_pham,
          so_sao: reviewRating,
          noi_dung: reviewContent.trim(),
        }),
      });

      setReviewContent("");
      setReviewRating(5);
      setToastMessage("Đã gửi đánh giá. Admin sẽ duyệt trước khi hiển thị.");
    } catch (error: any) {
      setReviewError(error?.message || "Không thể gửi đánh giá lúc này.");
    } finally {
      setReviewSubmitting(false);
    }
  }

  const goPrevImage = () => {
    if (displayImages.length <= 1) return;
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goNextImage = () => {
    if (displayImages.length <= 1) return;
    setSelectedImage((prev) => (prev + 1) % displayImages.length);
  };

  return (
    <>
      <main className="bg-[#f7f6f2] text-[#1F1F1F]">
        <PageBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Trang sức", href: "/products" },
            { label: product.ten_san_pham, active: true },
          ]}
        />

        <section className="bp-surface bp-surface-plain py-6 md:py-8">
          <div className="bp-container">
            <div className="flex flex-wrap items-center gap-2">
              <InfoPill tone="soft">Blue Peach</InfoPill>
              <InfoPill>SKU: {product.sku}</InfoPill>

              {product.ngay_tao ? (
                <InfoPill>
                  Ngày tạo: {new Date(product.ngay_tao).toLocaleDateString("vi-VN")}
                </InfoPill>
              ) : null}

              <InfoPill tone="accent">
                {reviewSummary.average_rating.toFixed(1)}/5 ·{" "}
                {reviewSummary.total_reviews} đánh giá
              </InfoPill>
            </div>
          </div>
        </section>

        <section className="bp-surface bp-surface-plain py-8 md:py-10">
          <div className="bp-container">
            <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
              <div>
                {displayImages.length > 0 ? (
                  <div className="grid gap-4 lg:grid-cols-[118px_minmax(0,1fr)]">
                    <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:grid-cols-1">
                      {displayImages.map((img, idx) => {
                        const active = idx === selectedImage;

                        return (
                          <button
                            key={`${img.duong_dan_anh}-${idx}`}
                            type="button"
                            onClick={() => setSelectedImage(idx)}
                            className={[
                              "group aspect-square overflow-hidden rounded-[20px] border bg-[#F8F8F5] transition duration-300",
                              active
                                ? "border-[#1F1F1F] ring-1 ring-[#1F1F1F]/15 shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
                                : "border-[#DED8CC] hover:-translate-y-[1px] hover:border-[#BFB6A8] hover:shadow-[0_10px_20px_rgba(0,0,0,0.04)]",
                            ].join(" ")}
                          >
                            <img
                              src={img.duong_dan_anh}
                              alt={`${product.ten_san_pham} ${idx + 1}`}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className="order-1 overflow-hidden rounded-[28px] border border-[#DED8CC] bg-[linear-gradient(180deg,#FBFAF7_0%,#F3EEE7_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.05)] lg:order-2">
                      <button
                        type="button"
                        id="product-main-image"
                        onClick={() => setLightboxOpen(true)}
                        className="group relative flex aspect-square w-full items-center justify-center overflow-hidden p-8 md:p-12"
                        aria-label="Mở ảnh lớn"
                      >
                        <img
                          src={activeImage?.duong_dan_anh}
                          alt={product.ten_san_pham}
                          className="max-h-full max-w-full object-contain transition duration-700 ease-out group-hover:scale-[1.08]"
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent opacity-70" />

                        <span className="pointer-events-none absolute bottom-5 right-5 rounded-full border border-white/40 bg-white/85 px-3.5 py-1.5 text-[11px] font-medium text-[#1F1F1F] shadow-sm backdrop-blur opacity-0 transition group-hover:opacity-100">
                          Bấm để xem ảnh lớn
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-[28px] border border-[#DED8CC] bg-[#F8F8F5] text-sm text-[#66707A]">
                    Chưa có hình ảnh
                  </div>
                )}
              </div>

              <div>
                <div className="overflow-hidden rounded-[28px] border border-[#DED8CC] bg-[linear-gradient(180deg,#FBFAF7_0%,#F7F3EC_100%)] shadow-[0_18px_44px_rgba(0,0,0,0.05)]">
                  <div className="border-b border-[#E6DED2] px-6 py-5 md:px-8">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <InfoPill tone={inStock ? "soft" : "default"}>
                        {inStock ? "Còn hàng" : "Hết hàng"}
                      </InfoPill>

                      {hasDiscount ? (
                        <InfoPill tone="accent">Giảm {product.phan_tram_giam}%</InfoPill>
                      ) : null}
                    </div>

                    <h2 className="mt-4 max-w-[16ch] text-[24px] font-medium leading-[1.12] text-[#111111] md:text-[29px]">
                      {product.ten_san_pham}
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <StarRating value={Math.round(reviewSummary.average_rating)} />
                      <span className="text-sm text-[#66707A]">
                        {reviewSummary.average_rating.toFixed(1)} • {reviewSummary.total_reviews} đánh giá
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[#8C8478]">
                      Mã sản phẩm: {product.sku || formatShortCode(product.ma_san_pham, "SP-", 8)}
                    </p>
                  </div>

                  <div className="px-6 py-6 md:px-8">
                    {hasDiscount && product.gia_goc ? (
                      <>
                        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                          <div className="text-[30px] font-medium tracking-[-0.02em] text-[#111111] md:text-[36px]">
                            {Number(product.gia_ban).toLocaleString("vi-VN")}đ
                          </div>

                          <span className="pb-1 text-[16px] text-[#8C8478] line-through">
                            {Number(product.gia_goc).toLocaleString("vi-VN")}đ
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-[#8C8478]">
                          Mức giá ưu đãi dành cho thiết kế đang được yêu thích tại Blue Peach.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-[30px] font-medium tracking-[-0.02em] text-[#111111] md:text-[36px]">
                          {Number(product.gia_ban).toLocaleString("vi-VN")}đ
                        </div>

                        <p className="mt-3 text-sm text-[#8C8478]">
                          Thiết kế bạc tinh giản với mức giá phù hợp để đồng hành mỗi ngày.
                        </p>
                      </>
                    )}

                    <div className="mt-6 grid gap-3 rounded-[22px] border border-[#E8E0D4] bg-white/70 p-4 text-sm text-[#66707A]">
                      <div className="flex items-center justify-between gap-4">
                        <span>Tình trạng tồn kho</span>
                        <span
                          className={[
                            "font-medium",
                            inStock ? "text-[#1F1F1F]" : "text-[#8C8478]",
                          ].join(" ")}
                        >
                          {inStock ? `${product.so_luong_ton} sản phẩm có sẵn` : "Đã hết hàng"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span>Chất liệu</span>
                        <span className="font-medium text-[#1F1F1F]">Trang sức bạc</span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span>Phong cách</span>
                        <span className="font-medium text-[#1F1F1F]">Tối giản & nữ tính</span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span>Đóng gói</span>
                        <span className="font-medium text-[#1F1F1F]">Sẵn sàng làm quà tặng</span>
                      </div>
                    </div>

                    {product.mo_ta_san_pham ? (
                      <div className="mt-6 rounded-[22px] border border-[#E8E0D4] bg-white/70 p-5">
                        <h3 className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#66707A]">
                          Mô tả sản phẩm
                        </h3>
                        <div className="mt-4 text-sm leading-7 text-[#555C63]">
                          {product.mo_ta_san_pham}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        onClick={handleToggleWishlist}
                        disabled={wishlistLoading}
                        className={[
                          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium transition",
                          wishlisted
                            ? "border-[#D14B5A] bg-[#FFF7F8] text-[#D14B5A]"
                            : "border-[#DED8CC] bg-white text-[#1F1F1F] hover:border-[#1F1F1F]/30 hover:bg-[#FCFBF8]",
                          wishlistLoading ? "cursor-not-allowed opacity-60" : "",
                        ].join(" ")}
                      >
                        <HeartIcon active={wishlisted} />
                        <span>{wishlisted ? "Đã lưu yêu thích" : "Lưu vào yêu thích"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className={[
                          "inline-flex h-12 w-full items-center justify-center rounded-full border text-sm font-medium transition",
                          inStock
                            ? "border-[#1F1F1F] bg-[#1F1F1F] text-white hover:opacity-92"
                            : "cursor-not-allowed border-[#DED8CC] bg-[#E8E3DA] text-[#8C8478]",
                        ].join(" ")}
                      >
                        {inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bp-surface bp-surface-blue-soft border-t border-[#DED8CC] py-12 md:py-16">
          <div className="bp-container">
            <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12">
              <div className="rounded-[28px] border border-[#DED8CC] bg-[linear-gradient(180deg,#FBFAF7_0%,#F4EEE5_100%)] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.04)] md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                  Đánh giá khách hàng
                </p>

                <div className="mt-4 text-5xl font-medium tracking-[-0.03em] text-[#1F1F1F]">
                  {reviewSummary.average_rating.toFixed(1)}
                </div>

                <div className="mt-3">
                  <StarRating value={Math.round(reviewSummary.average_rating)} />
                </div>

                <p className="mt-3 text-sm text-[#66707A]">
                  {reviewSummary.total_reviews} đánh giá
                </p>
                <div className="mt-5 rounded-2xl border border-[#E4DED2] bg-white/70 px-4 py-3 text-sm text-[#66707A]">
                  Đánh giá được hiển thị sau khi đã kiểm duyệt để đảm bảo nội dung phù hợp.
                </div>

                <p className="mt-5 text-sm leading-6 text-[#66707A]">
                  Những đánh giá đã được duyệt từ khách hàng Blue Peach.
                </p>
              </div>

              <div className="space-y-4">
                <div className="mb-6 rounded-[24px] border border-[#DED8CC] bg-white/75 p-5 md:p-6">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8C8478]">
                        Viết đánh giá
                      </p>
                      <h3 className="mt-2 text-xl font-medium text-[#1F1F1F]">
                        Chia sẻ trải nghiệm của bạn
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#66707A]">
                        Chỉ khách hàng đã mua sản phẩm mới có thể gửi đánh giá. Đánh giá sẽ
                        được hiển thị sau khi admin duyệt.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#1F1F1F]">
                        Số sao
                      </label>

                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const value = idx + 1;
                          const active = value <= reviewRating;

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setReviewRating(value)}
                              className={[
                                "text-2xl transition",
                                active ? "text-[#1F1F1F]" : "text-[#CFC8BB]",
                              ].join(" ")}
                              aria-label={`${value} sao`}
                            >
                              ★
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#1F1F1F]">
                        Nội dung đánh giá
                      </label>

                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        rows={4}
                        placeholder="Ví dụ: Sản phẩm đẹp, đóng gói cẩn thận, rất phù hợp để đeo hằng ngày..."
                        className="w-full rounded-[18px] border border-[#DED8CC] bg-white px-4 py-3 text-sm text-[#1F1F1F] outline-none transition focus:border-[#1F1F1F]/40 focus:ring-4 focus:ring-black/5"
                      />
                    </div>

                    {reviewError ? (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {reviewError}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#1F1F1F] px-6 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {reviewSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </form>
                </div>

                {reviewItems.length > 0 ? (
                  reviewItems.map((review) => (
                    <article
                      key={review.ma_danh_gia}
                      className="rounded-[24px] border border-[#DED8CC] bg-white/80 p-5 shadow-[0_10px_24px_rgba(0,0,0,0.03)] md:p-6"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-[15px] font-medium text-[#1F1F1F]">
                            {review.ten_nguoi_danh_gia}
                          </h3>
                          <div className="mt-2">
                            <StarRating value={review.so_sao} />
                          </div>
                        </div>

                        <p className="text-sm text-[#66707A]">
                          {new Date(review.ngay_tao).toLocaleDateString("vi-VN")}
                        </p>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-[#555C63] md:line-clamp-4">
                        {review.noi_dung}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[#DED8CC] bg-white/75 p-8 text-center">
                    <p className="text-sm font-medium text-[#1F1F1F]">
                      Chưa có đánh giá hiển thị
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#66707A]">
                      Đánh giá cho sản phẩm này sẽ xuất hiện tại đây sau khi được duyệt.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bp-surface bp-surface-warm border-t border-[#DED8CC] py-12 md:py-16">
          <div className="bp-container">
            <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                Gợi ý dành cho bạn
              </p>

              <h2 className="font-heading mt-4 text-4xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
                Bạn cũng có thể thích
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#66707A] md:text-base">
                Những thiết kế được chọn để đồng hành cùng phong cách bạn đang khám phá tại Blue Peach.
              </p>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 border-b border-r border-[#DED8CC] lg:grid-cols-4">
                {relatedProducts.map((item) => {
                  const hasDiscount =
                    !!item.phan_tram_giam && item.phan_tram_giam > 0;

                  return (
                    <ProductCard
                      key={item.ma_san_pham}
                      product={item}
                      badgeText={
                        hasDiscount
                          ? `-${item.phan_tram_giam}%`
                          : item.is_bestseller
                            ? "Bán chạy"
                            : "Blue Peach"
                      }
                      description="Trang sức bạc Blue Peach tinh giản, nhẹ nhàng và thanh lịch cho mỗi ngày."
                      showAddToCart
                      showStock
                    />
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[28px] border border-[#DED8CC] bg-white/80 px-6 py-14 text-center shadow-[0_12px_28px_rgba(0,0,0,0.03)]">
                <h3 className="font-heading text-4xl font-medium text-[#1F1F1F]">
                  Đang cập nhật thêm gợi ý
                </h3>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#66707A]">
                  Bạn có thể quay lại trang sản phẩm để khám phá thêm những thiết kế khác của Blue Peach.
                </p>

                <Link href="/products" className="bp-btn bp-btn--solid mt-6">
                  Xem tất cả sản phẩm
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      {lightboxOpen && activeImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative flex max-h-full w-full max-w-6xl flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-0 top-0 z-10 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur hover:bg-black/60"
            >
              Đóng
            </button>

            <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden rounded-2xl bg-[#111111] p-6 md:p-10">
              {displayImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrevImage}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-3 text-white backdrop-blur hover:bg-black/60"
                    aria-label="Ảnh trước"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={goNextImage}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-3 text-white backdrop-blur hover:bg-black/60"
                    aria-label="Ảnh sau"
                  >
                    →
                  </button>
                </>
              ) : null}

              <img
                src={activeImage.duong_dan_anh}
                alt={product.ten_san_pham}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>

            {displayImages.length > 1 ? (
              <div className="mx-auto grid max-w-3xl grid-cols-4 gap-3 md:grid-cols-6">
                {displayImages.map((img, idx) => {
                  const active = idx === selectedImage;

                  return (
                    <button
                      key={`${img.duong_dan_anh}-modal-${idx}`}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={[
                        "aspect-square overflow-hidden rounded-xl border bg-white/90 transition",
                        active
                          ? "border-white ring-1 ring-white/40"
                          : "border-white/20 hover:border-white/50",
                      ].join(" ")}
                    >
                      <img
                        src={img.duong_dan_anh}
                        alt={`${product.ten_san_pham} ảnh ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {toastMessage && (
        <Toast
          message={toastMessage}
          duration={2500}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
}

function HeartIcon({ active }: { active: boolean }) {
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