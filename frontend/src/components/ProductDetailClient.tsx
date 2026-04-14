"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import Toast from "@/components/Toast";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { usePathname, useRouter } from "next/navigation";

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

export default function ProductDetailClient({
  product,
  reviewsData,
}: ProductDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useCustomerAuth();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
        <section className="border-b border-[#DED8CC] bg-[#e9e4da] pt-3 md:pt-4">
          <div className="bp-container py-10 md:py-14">
            <Link
              href="/products"
              className="bp-link inline-block text-sm text-[#66707A]"
            >
              ← Quay lại sản phẩm
            </Link>

            <div className="mt-6 max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                Blue Peach
              </p>

              <h1 className="font-heading mt-4 text-4xl font-medium leading-[0.96] tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
                {product.ten_san_pham}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#66707A]">
                <span>SKU: {product.sku}</span>
                {product.ngay_tao ? (
                  <span>
                    Ngày tạo: {new Date(product.ngay_tao).toLocaleDateString("vi-VN")}
                  </span>
                ) : null}
                <span>
                  {reviewSummary.average_rating.toFixed(1)}/5 · {reviewSummary.total_reviews} đánh giá
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="bp-container">
            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
              <div>
                {displayImages.length > 0 ? (
                  <div className="grid gap-4 lg:grid-cols-[110px_minmax(0,1fr)]">
                    <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:grid-cols-1">
                      {displayImages.map((img, idx) => {
                        const active = idx === selectedImage;

                        return (
                          <button
                            key={`${img.duong_dan_anh}-${idx}`}
                            type="button"
                            onClick={() => setSelectedImage(idx)}
                            className={[
                              "aspect-square overflow-hidden border bg-[#F8F8F5] transition duration-300 hover:scale-[1.03] shadow-sm",
                              active
                                ? "border-[#1F1F1F] ring-1 ring-[#1F1F1F]/20"
                                : "border-[#DED8CC] hover:border-[#BFB6A8]",
                            ].join(" ")}
                          >
                            <img
                              src={img.duong_dan_anh}
                              alt={`${product.ten_san_pham} ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className="order-1 border border-[#DED8CC] bg-[#F8F8F5] lg:order-2">
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
                          className="max-h-full max-w-full object-contain transition duration-500 ease-out group-hover:scale-125"
                        />

                        <span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-[#DED8CC] bg-white/90 px-3 py-1 text-[11px] font-medium text-[#1F1F1F] opacity-0 shadow-sm transition group-hover:opacity-100">
                          Bấm để xem lớn
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center border border-[#DED8CC] bg-[#F8F8F5] text-sm text-[#66707A]">
                    Chưa có hình ảnh
                  </div>
                )}
              </div>

              <div>
                <div className="border border-[#DED8CC] bg-[#F8F8F5] p-6 md:p-8">
                  <p className="text-[12px] font-medium text-[#8C8478]">
                    {inStock ? "Còn hàng" : "Hết hàng"}
                  </p>

                  <h2 className="mt-3 text-[24px] font-medium leading-snug text-[#111111] md:text-[30px]">
                    {product.ten_san_pham}
                  </h2>

                  <div className="mt-4 flex items-center gap-3">
                    <StarRating value={Math.round(reviewSummary.average_rating)} />
                    <span className="text-sm text-[#66707A]">
                      {reviewSummary.average_rating.toFixed(1)} • {reviewSummary.total_reviews} đánh giá
                    </span>
                  </div>

                  <div className="mt-6 border-t border-[#DED8CC] pt-6">
                    {hasDiscount && product.gia_goc ? (
                      <>
                        <div className="text-[28px] font-medium text-[#111111] md:text-[32px]">
                          {Number(product.gia_ban).toLocaleString("vi-VN")}đ
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="text-[16px] text-[#8C8478] line-through">
                            {Number(product.gia_goc).toLocaleString("vi-VN")}đ
                          </span>
                          <span className="border border-[#DED8CC] px-3 py-1 text-[12px] font-medium text-[#1F1F1F]">
                            -{product.phan_tram_giam}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-[28px] font-medium text-[#111111] md:text-[32px]">
                        {Number(product.gia_ban).toLocaleString("vi-VN")}đ
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-t border-[#DED8CC] pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-[#66707A]">Tình trạng tồn kho</span>
                      <span
                        className={[
                          "text-sm font-medium",
                          inStock ? "text-[#1F1F1F]" : "text-[#8C8478]",
                        ].join(" ")}
                      >
                        {inStock ? `${product.so_luong_ton} sản phẩm có sẵn` : "Đã hết hàng"}
                      </span>
                    </div>
                  </div>

                  {product.mo_ta_san_pham ? (
                    <div className="mt-6 border-t border-[#DED8CC] pt-6">
                      <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#66707A]">
                        Mô tả sản phẩm
                      </h3>
                      <div className="mt-4 text-sm leading-7 text-[#555C63]">
                        {product.mo_ta_san_pham}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-8">
                    <button
                      onClick={handleAddToCart}
                      disabled={!inStock}
                      className={[
                        "inline-flex h-12 w-full items-center justify-center border text-sm font-medium transition",
                        inStock
                          ? "border-[#1F1F1F] bg-[#1F1F1F] text-white hover:opacity-92"
                          : "cursor-not-allowed border-[#DED8CC] bg-[#E8E3DA] text-[#8C8478]",
                      ].join(" ")}
                    >
                      {inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
                    </button>
                  </div>

                  <div className="mt-6 grid gap-3 border-t border-[#DED8CC] pt-6 text-sm text-[#66707A]">
                    <div className="flex items-center justify-between gap-4">
                      <span>Chất liệu</span>
                      <span className="text-[#1F1F1F]">Trang sức bạc</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span>Phong cách</span>
                      <span className="text-[#1F1F1F]">Tối giản & nữ tính</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span>Đóng gói</span>
                      <span className="text-[#1F1F1F]">Sẵn sàng làm quà tặng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#DED8CC] py-10 md:py-14">
          <div className="bp-container">
            <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
              <div className="border border-[#DED8CC] bg-[#F8F8F5] p-6 md:p-8">
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
                {reviewItems.length > 0 ? (
                  reviewItems.map((review) => (
                    <article
                      key={review.ma_danh_gia}
                      className="border border-[#DED8CC] bg-[#F8F8F5] p-5 md:p-6"
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
                  <div className="border border-dashed border-[#DED8CC] bg-[#F8F8F5] p-8 text-center">
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