"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type Product = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  gia_goc?: number;
  phan_tram_giam?: number;
  so_luong_ton: number;
  primary_image: string | null;
  ma_danh_muc?: string | null;
};

type Resp = {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
};

type Category = {
  ma_danh_muc: string;
  ten_danh_muc: string;
};

type CategoryResp = {
  items: Category[];
};

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá tăng dần", value: "price-asc" },
  { label: "Giá giảm dần", value: "price-desc" },
  { label: "Tên A-Z", value: "name-asc" },
];

const MIN_PRICE = 0;
const MAX_PRICE = 3000000;
const PRICE_STEP = 50000;

function formatPrice(value: number) {
  return `${Number(value).toLocaleString("vi-VN")}đ`;
}

function ProductSkeleton() {
  return (
    <div className="border-l border-t border-[#E3DBCF] bg-[#FBFAF7]">
      <div className="aspect-square animate-pulse bg-[#EFE9DF]" />
      <div className="px-5 pb-6 pt-4">
        <div className="h-3 w-16 animate-pulse bg-[#EFE9DF]" />
        <div className="mt-4 h-4 w-3/4 animate-pulse bg-[#EFE9DF]" />
        <div className="mt-2 h-4 w-2/3 animate-pulse bg-[#EFE9DF]" />
        <div className="mt-5 h-4 w-1/3 animate-pulse bg-[#EFE9DF]" />
        <div className="mt-6 h-11 w-full animate-pulse rounded-full bg-[#EFE9DF]" />
      </div>
    </div>
  );
}

export default function ProductListClient() {
  const [q, setQ] = useState("");
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [categoryId, setCategoryId] = useState("all");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const limit = 24;

  async function loadCategories() {
    try {
      setCategoriesLoading(true);
      const res = await fetch(`${API_BASE_URL}/categories`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setCategories([]);
        return;
      }

      const json = (await res.json()) as CategoryResp;
      setCategories(json.items ?? []);
    } finally {
      setCategoriesLoading(false);
    }
  }

  async function load(
    offset: number,
    searchKeyword: string,
    nextCategoryId: string = categoryId,
    nextMinPrice: number = minPrice,
    nextMaxPrice: number = maxPrice
  ) {
    try {
      setLoading(true);

      const url = new URL(`${API_BASE_URL}/products`);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(offset));

      if (searchKeyword.trim()) {
        url.searchParams.set("q", searchKeyword.trim());
      }

      if (nextCategoryId !== "all") {
        url.searchParams.set("categoryId", nextCategoryId);
      }

      if (nextMinPrice > MIN_PRICE) {
        url.searchParams.set("minPrice", String(nextMinPrice));
      }

      if (nextMaxPrice < MAX_PRICE) {
        url.searchParams.set("maxPrice", String(nextMaxPrice));
      }

      const res = await fetch(url.toString(), { cache: "no-store" });

      if (!res.ok) {
        setData({
          items: [],
          total: 0,
          limit,
          offset: 0,
        });
        return;
      }

      const json = (await res.json()) as Resp;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    load(0, "", "all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedItems = useMemo(() => {
    const items = [...(data?.items ?? [])];

    if (sort === "price-asc") {
      items.sort((a, b) => Number(a.gia_ban) - Number(b.gia_ban));
    } else if (sort === "price-desc") {
      items.sort((a, b) => Number(b.gia_ban) - Number(a.gia_ban));
    } else if (sort === "name-asc") {
      items.sort((a, b) => a.ten_san_pham.localeCompare(b.ten_san_pham, "vi"));
    }

    return items;
  }, [data?.items, sort]);

  const offset = data?.offset ?? 0;
  const total = data?.total ?? 0;

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[var(--bp-text)]">
      <section className="bp-surface bp-surface-warm border-b border-[#DED8CC] pt-3 md:pt-4">
        <div className="bp-container py-12 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
            Blue Peach
          </p>

          <div className="mt-5 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-3xl">
              <h1 className="font-heading text-[46px] font-medium leading-[0.94] tracking-[-0.03em] text-[#1F1F1F] md:text-[72px]">
                Tất cả sản phẩm
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#66707A] md:text-base">
                Khám phá toàn bộ thiết kế bạc của Blue Peach — tinh giản, nữ tính và được tuyển chọn cho vẻ đẹp thường ngày theo tinh thần hiện đại, nhẹ nhàng.
              </p>
            </div>

            <div className="self-end text-sm text-[#8C8478]">
              {loading ? "Đang tải sản phẩm..." : `${total} sản phẩm`}
            </div>
          </div>
        </div>
      </section>

      <section className="bp-surface bp-surface-plain py-8 md:py-10">
        <div className="bp-container">
          <div className="overflow-hidden rounded-[28px] border border-[#E3DBCF] bg-[#FBFAF7] shadow-[0_18px_44px_rgba(0,0,0,0.04)]">
            <div className="border-b border-[#EEE6D9] px-5 py-4 md:px-7 md:py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7B8791]">
                    Curated filters
                  </p>
                  <h2 className="mt-2 text-[16px] font-medium text-[#1F1F1F] md:text-[18px]">
                    Thu hẹp lựa chọn theo phong cách của bạn
                  </h2>
                </div>

                <div className="text-sm text-[#8C8478]">
                  {categoriesLoading ? "Đang tải danh mục..." : "Tìm kiếm • Danh mục • Giá"}
                </div>
              </div>
            </div>

            <div className="px-5 py-5 md:px-7 md:py-6">
              <div className="grid gap-4 xl:grid-cols-[1.2fr_0.85fr_0.85fr_1.1fr]">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B8791]">
                    Tìm kiếm
                  </label>

                  <div className="flex gap-3">
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setKeyword(q);
                          load(0, q, categoryId, minPrice, maxPrice);
                        }
                      }}
                      placeholder="Tên sản phẩm, kiểu dáng..."
                      className="h-12 w-full rounded-full border border-[#E2D9CC] bg-white px-5 text-sm text-[#1F1F1F] outline-none transition focus:border-[#1F1F1F]/25"
                    />

                    <button
                      onClick={() => {
                        setKeyword(q);
                        load(0, q, categoryId, minPrice, maxPrice);
                      }}
                      className="h-12 rounded-full border border-[#1F1F1F] bg-[#1F1F1F] px-6 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Tìm
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B8791]">
                    Danh mục
                  </label>

                  <select
                    value={categoryId}
                    onChange={(e) => {
                      const nextCategoryId = e.target.value;
                      setCategoryId(nextCategoryId);
                      load(0, keyword, nextCategoryId, minPrice, maxPrice);
                    }}
                    className="h-12 w-full rounded-full border border-[#E2D9CC] bg-white px-5 text-sm text-[#1F1F1F] outline-none"
                  >
                    <option value="all">Tất cả</option>
                    {categories.map((option) => (
                      <option key={option.ma_danh_muc} value={option.ma_danh_muc}>
                        {option.ten_danh_muc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B8791]">
                    Sắp xếp
                  </label>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-12 w-full rounded-full border border-[#E2D9CC] bg-white px-5 text-sm text-[#1F1F1F] outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B8791]">
                    Khoảng giá
                  </label>

                  <div className="rounded-[24px] border border-[#E8E0D4] bg-white px-5 py-4">
                    <div className="flex items-center justify-between gap-3 text-sm text-[#1F1F1F]">
                      <span>{formatPrice(minPrice)}</span>
                      <span className="text-[#8C8478]">—</span>
                      <span>{formatPrice(maxPrice)}</span>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="mb-1.5 text-[10px] uppercase tracking-[0.18em] text-[#8C8478]">
                          Giá từ
                        </div>
                        <input
                          type="range"
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          step={PRICE_STEP}
                          value={minPrice}
                          onChange={(e) => {
                            const nextMin = Math.min(Number(e.target.value), maxPrice - PRICE_STEP);
                            setMinPrice(nextMin);
                          }}
                          className="w-full accent-[#1F1F1F]"
                        />
                      </div>

                      <div>
                        <div className="mb-1.5 text-[10px] uppercase tracking-[0.18em] text-[#8C8478]">
                          Giá đến
                        </div>
                        <input
                          type="range"
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          step={PRICE_STEP}
                          value={maxPrice}
                          onChange={(e) => {
                            const nextMax = Math.max(Number(e.target.value), minPrice + PRICE_STEP);
                            setMaxPrice(nextMax);
                          }}
                          className="w-full accent-[#1F1F1F]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    setCategoryId("all");
                    load(0, keyword, "all", minPrice, maxPrice);
                  }}
                  className={[
                    "rounded-full border px-4 py-2.5 text-sm transition",
                    categoryId === "all"
                      ? "border-[#1F1F1F] bg-[#1F1F1F] text-white"
                      : "border-[#E2D9CC] bg-white text-[#66707A] hover:text-[#1F1F1F]",
                  ].join(" ")}
                >
                  Tất cả
                </button>

                {categories.map((option) => {
                  const active = categoryId === option.ma_danh_muc;

                  return (
                    <button
                      key={option.ma_danh_muc}
                      onClick={() => {
                        setCategoryId(option.ma_danh_muc);
                        load(0, keyword, option.ma_danh_muc, minPrice, maxPrice);
                      }}
                      className={[
                        "rounded-full border px-4 py-2.5 text-sm transition",
                        active
                          ? "border-[#1F1F1F] bg-[#1F1F1F] text-white"
                          : "border-[#E2D9CC] bg-white text-[#66707A] hover:text-[#1F1F1F]",
                      ].join(" ")}
                    >
                      {option.ten_danh_muc}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => load(0, keyword, categoryId, minPrice, maxPrice)}
                  className="rounded-full border border-[#1F1F1F] bg-[#1F1F1F] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Áp dụng khoảng giá
                </button>

                <button
                  onClick={() => {
                    const nextMin = MIN_PRICE;
                    const nextMax = MAX_PRICE;
                    setMinPrice(nextMin);
                    setMaxPrice(nextMax);
                    load(0, keyword, categoryId, nextMin, nextMax);
                  }}
                  className="rounded-full border border-[#E2D9CC] bg-white px-5 py-3 text-sm font-medium text-[#1F1F1F] transition hover:border-[#1F1F1F]/30"
                >
                  Đặt lại giá
                </button>

                {(minPrice > MIN_PRICE || maxPrice < MAX_PRICE) ? (
                  <p className="text-sm text-[#66707A]">
                    Khoảng giá:{" "}
                    <span className="font-medium text-[#1F1F1F]">
                      {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                    </span>
                  </p>
                ) : null}
              </div>

              {keyword ? (
                <p className="mt-4 text-sm text-[#66707A]">
                  Kết quả tìm kiếm cho{" "}
                  <span className="font-medium text-[#1F1F1F]">{keyword}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bp-surface bp-surface-plain pb-14 md:pb-16">
        <div className="bp-container">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                Blue Peach Edit
              </p>
              <h2 className="font-heading mt-3 text-3xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-4xl">
                Thiết kế dành cho vẻ đẹp thường ngày
              </h2>
            </div>

            <div className="text-sm text-[#8C8478]">
              {total ? `${offset + 1}-${Math.min(offset + limit, total)} / ${total}` : ""}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 border-b border-r border-[#E3DBCF] lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="rounded-[28px] border border-[#E3DBCF] bg-[#FBFAF7] px-6 py-14 text-center shadow-[0_16px_38px_rgba(0,0,0,0.03)]">
              <h2 className="font-heading text-4xl font-medium text-[#1F1F1F]">
                Không tìm thấy sản phẩm
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#66707A]">
                Hãy thử lại với từ khóa khác, điều chỉnh khoảng giá hoặc chọn một danh mục khác để xem thêm sản phẩm phù hợp.
              </p>

              <button
                onClick={() => {
                  const nextMin = MIN_PRICE;
                  const nextMax = MAX_PRICE;
                  setQ("");
                  setKeyword("");
                  setCategoryId("all");
                  setSort("newest");
                  setMinPrice(nextMin);
                  setMaxPrice(nextMax);
                  load(0, "", "all", nextMin, nextMax);
                }}
                className="mt-6 rounded-full border border-[#1F1F1F] bg-[#1F1F1F] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 border-b border-r border-[#E3DBCF] lg:grid-cols-3 xl:grid-cols-4">
              {sortedItems.map((p) => (
                <ProductCard
                  key={p.ma_san_pham}
                  product={p}
                  badgeText={p.so_luong_ton > 0 ? "Blue Peach" : "Hết hàng"}
                  description="Trang sức bạc được tuyển chọn theo tinh thần tối giản, nữ tính và thanh lịch."
                  showAddToCart
                  showStock
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#66707A]">
              {loading ? "Đang cập nhật danh sách..." : "Tiếp tục khám phá thêm các thiết kế khác"}
            </div>

            <div className="flex gap-3">
              <button
                disabled={offset <= 0 || loading}
                onClick={() =>
                  load(Math.max(0, offset - limit), keyword, categoryId, minPrice, maxPrice)
                }
                className="rounded-full border border-[#E2D9CC] bg-white px-5 py-3 text-sm font-medium text-[#1F1F1F] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Trước
              </button>

              <button
                disabled={offset + limit >= total || loading}
                onClick={() =>
                  load(offset + limit, keyword, categoryId, minPrice, maxPrice)
                }
                className="rounded-full border border-[#E2D9CC] bg-white px-5 py-3 text-sm font-medium text-[#1F1F1F] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}