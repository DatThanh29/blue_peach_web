"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";

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
const MAX_PRICE = 2000000;
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
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [search, setSearch] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (q) {
      setSearch(q);
    }
  }, [q]);

  useEffect(() => {
    load(0, search, categoryId, minPrice, maxPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryId, minPrice, maxPrice, sort]);

  const sortedItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filteredProducts = (data?.items ?? []).filter((p) => {
      return (
        !normalizedSearch ||
        p.ten_san_pham.toLowerCase().includes(normalizedSearch)
      );
    });

    const items = [...filteredProducts];

    if (sort === "price-asc") {
      items.sort((a, b) => Number(a.gia_ban) - Number(b.gia_ban));
    } else if (sort === "price-desc") {
      items.sort((a, b) => Number(b.gia_ban) - Number(a.gia_ban));
    } else if (sort === "name-asc") {
      items.sort((a, b) => a.ten_san_pham.localeCompare(b.ten_san_pham, "vi"));
    }

    return items;
  }, [data?.items, search, sort]);

  const offset = data?.offset ?? 0;
  const total = data?.total ?? 0;
  const selectedCategoryName =
    categoryId === "all"
      ? "Tất cả sản phẩm"
      : categories.find((item) => item.ma_danh_muc === categoryId)?.ten_danh_muc ||
      "Danh mục đã chọn";

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[var(--bp-text)]">
      <section className="border-b border-[#E5DED4] bg-[#F4F1EB]">
        <div className="bp-container py-4">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[#8C8478]">
            <a href="/" className="transition hover:text-[#1F1F1F]">
              Trang chủ
            </a>

            <span>/</span>

            <span className="text-[#C46B3A]">Danh mục</span>

            <span>/</span>

            <span className="text-[#66707A]">Tất cả sản phẩm</span>
          </nav>
        </div>
      </section>


      <section className="bp-surface bp-surface-plain py-10 md:py-12">
        <div className="bp-container">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                Blue Peach Edit
              </p>

              <h2 className="font-heading mt-3 text-3xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-4xl">
                Thiết kế dành cho vẻ đẹp thường ngày
              </h2>

              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#66707A]">
                <span>{selectedCategoryName}</span>

                <span className="text-[#CFC7BA]">/</span>

                <span>{loading ? "Đang tải sản phẩm..." : `${total} sản phẩm`}</span>

                {search ? (
                  <>
                    <span className="text-[#CFC7BA]">/</span>
                    <span>Tìm kiếm: {search}</span>
                  </>
                ) : null}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-[#66707A]">Sắp xếp:</span>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 min-w-[180px] rounded-full border border-[#E2D9CC] bg-white px-4 text-sm text-[#1F1F1F] outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[24px] border border-[#E3DBCF] bg-[#FBFAF7] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.03)] md:p-5">
                <div className="border-b border-[#E9E1D6] pb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7B8791]">
                    Bộ lọc
                  </p>

                  <h3 className="mt-2 text-lg font-medium text-[#1F1F1F]">
                    Thu hẹp lựa chọn
                  </h3>
                </div>

                <div className="space-y-5 py-5">
                  <div>
                    <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B8791]">
                      Tìm kiếm
                    </label>

                    <div className="flex gap-2">
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setSearch(search.trim());
                          }
                        }}
                        placeholder="Tên sản phẩm..."
                        className="h-11 w-full rounded-full border border-[#E2D9CC] bg-white px-4 text-sm text-[#1F1F1F] outline-none transition focus:border-[#1F1F1F]/25"
                      />

                      <button
                        onClick={() => {
                          setSearch(search.trim());
                        }}
                        className="h-11 rounded-full border border-[#1F1F1F] bg-[#1F1F1F] px-4 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Tìm
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[#E9E1D6] pt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B8791]">
                        Mức giá
                      </label>

                      <span className="text-xs text-[#8C8478]">
                        0đ - {formatPrice(MAX_PRICE)}
                      </span>
                    </div>

                    <div className="rounded-[22px] border border-[#E8E0D4] bg-white px-4 py-4">
                      <div className="mb-3 text-sm font-medium text-[#1F1F1F]">
                        {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                      </div>

                      <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        step={PRICE_STEP}
                        value={maxPrice}
                        onChange={(e) => {
                          const nextMax = Math.max(
                            Number(e.target.value),
                            minPrice + PRICE_STEP
                          );
                          setMaxPrice(nextMax);
                        }}
                        className="w-full accent-[#1F1F1F]"
                        aria-label="Giá tối đa"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#E9E1D6] pt-6">
                    <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7B8791]">
                      Danh mục
                    </label>

                    <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
                      <button
                        onClick={() => {
                          setCategoryId("all");
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left text-sm transition hover:text-[#1F1F1F]"
                      >
                        <span
                          className={[
                            "flex h-4 w-4 shrink-0 items-center justify-center border",
                            categoryId === "all"
                              ? "border-[#1F1F1F] bg-[#1F1F1F]"
                              : "border-[#CFC7BA] bg-white",
                          ].join(" ")}
                        >
                          {categoryId === "all" ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          ) : null}
                        </span>

                        <span
                          className={[
                            categoryId === "all" ? "font-medium text-[#1F1F1F]" : "text-[#66707A]",
                          ].join(" ")}
                        >
                          Tất cả
                        </span>
                      </button>

                      {categories.map((option) => {
                        const active = categoryId === option.ma_danh_muc;

                        return (
                          <button
                            key={option.ma_danh_muc}
                            onClick={() => {
                              setCategoryId(option.ma_danh_muc);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left text-sm transition hover:text-[#1F1F1F]"
                          >
                            <span
                              className={[
                                "flex h-4 w-4 shrink-0 items-center justify-center border",
                                active
                                  ? "border-[#1F1F1F] bg-[#1F1F1F]"
                                  : "border-[#CFC7BA] bg-white",
                              ].join(" ")}
                            >
                              {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                            </span>

                            <span
                              className={[
                                "line-clamp-1",
                                active ? "font-medium text-[#1F1F1F]" : "text-[#66707A]",
                              ].join(" ")}
                            >
                              {option.ten_danh_muc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#E9E1D6] pt-5">
                  <button
                    onClick={() => load(0, search, categoryId, minPrice, maxPrice)}
                    className="rounded-full border border-[#1F1F1F] bg-[#1F1F1F] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Áp dụng bộ lọc
                  </button>

                  <button
                    onClick={() => {
                      const nextMin = MIN_PRICE;
                      const nextMax = MAX_PRICE;
                      setSearch("");
                      setCategoryId("all");
                      setSort("newest");
                      setMinPrice(nextMin);
                      setMaxPrice(nextMax);
                      load(0, "", "all", nextMin, nextMax);
                    }}
                    className="rounded-full border border-[#E2D9CC] bg-white px-5 py-3 text-sm font-medium text-[#1F1F1F] transition hover:border-[#1F1F1F]/30"
                  >
                    Đặt lại bộ lọc
                  </button>

                  {(minPrice > MIN_PRICE || maxPrice < MAX_PRICE) ? (
                    <p className="text-center text-xs leading-5 text-[#66707A]">
                      Đang lọc theo giá:{" "}
                      <span className="font-medium text-[#1F1F1F]">
                        {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
            </aside>

            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="text-sm text-[#8C8478]">
                  {loading
                    ? "Đang cập nhật danh sách..."
                    : total
                      ? `${offset + 1}-${Math.min(offset + limit, total)} / ${total} sản phẩm`
                      : "0 sản phẩm"}
                </div>

                <div className="hidden text-sm text-[#8C8478] md:block">
                  {categoriesLoading ? "Đang tải danh mục..." : "Blue Peach Products"}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 border-b border-r border-[#E3DBCF] xl:grid-cols-3 2xl:grid-cols-4">
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
                    Hãy thử lại với từ khóa khác, điều chỉnh khoảng giá hoặc chọn một danh mục khác.
                  </p>

                  <button
                    onClick={() => {
                      const nextMin = MIN_PRICE;
                      const nextMax = MAX_PRICE;
                      setSearch("");
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
                <div className="grid grid-cols-2 border-b border-r border-[#E3DBCF] xl:grid-cols-3 2xl:grid-cols-4">
                  {sortedItems.map((p) => (
                    <ProductCard
                      key={p.ma_san_pham}
                      product={p}
                      badgeText={p.so_luong_ton > 0 ? "Blue Peach" : "Hết hàng"}
                      showAddToCart
                      showStock
                    />
                  ))}
                </div>
              )}

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-[#66707A]">
                  {loading
                    ? "Đang cập nhật danh sách..."
                    : "Tiếp tục khám phá thêm các thiết kế khác"}
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={offset <= 0 || loading}
                    onClick={() =>
                      load(Math.max(0, offset - limit), search, categoryId, minPrice, maxPrice)
                    }
                    className="rounded-full border border-[#E2D9CC] bg-white px-5 py-3 text-sm font-medium text-[#1F1F1F] transition disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Trước
                  </button>

                  <button
                    disabled={offset + limit >= total || loading}
                    onClick={() =>
                      load(offset + limit, search, categoryId, minPrice, maxPrice)
                    }
                    className="rounded-full border border-[#E2D9CC] bg-white px-5 py-3 text-sm font-medium text-[#1F1F1F] transition disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}