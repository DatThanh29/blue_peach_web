"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
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
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

function WishlistIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12.1 21.35 10.55 19.94C5.4 15.27 2 12.2 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.7-3.4 6.77-8.55 11.44l-1.35 1.23Z" />
    </svg>
  );
}

function ProductSkeleton() {
  return (
    <div className="border-l border-t border-[#DED8CC] bg-[#F8F8F5]">
      <div className="aspect-square animate-pulse bg-[#ECE8DF]" />
      <div className="px-4 pb-5 pt-4 md:px-5 md:pb-6">
        <div className="h-3 w-14 animate-pulse bg-[#ECE8DF]" />
        <div className="mt-3 h-4 w-3/4 animate-pulse bg-[#ECE8DF]" />
        <div className="mt-2 h-4 w-2/3 animate-pulse bg-[#ECE8DF]" />
        <div className="mt-4 h-4 w-1/3 animate-pulse bg-[#ECE8DF]" />
        <div className="mt-5 h-11 w-full animate-pulse bg-[#ECE8DF]" />
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
    nextCategoryId: string = categoryId
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
      <section className="border-b border-[#DED8CC] bg-[#e9e4da] pt-3 md:pt-4">
        <div className="bp-container py-14 md:py-18">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
            Blue Peach
          </p>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-heading text-5xl font-medium leading-[0.95] tracking-[-0.02em] text-[#1F1F1F] md:text-6xl">
                Tất cả sản phẩm
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#66707A] md:text-base">
                Khám phá toàn bộ thiết kế bạc của Blue Peach — tối giản, tinh tế và phù hợp với vẻ đẹp thường ngày.
              </p>
            </div>

            <div className="text-sm text-[#66707A]">
              {loading ? "Đang tải sản phẩm..." : `${sortedItems.length} sản phẩm`}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="bp-container">
          <div className="border border-[#DED8CC] bg-[#F8F8F5] p-5 md:p-6">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr_1fr]">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#66707A]">
                  Tìm kiếm
                </label>

                <div className="flex gap-3">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setKeyword(q);
                        load(0, q, categoryId);
                      }
                    }}
                    placeholder="Tìm sản phẩm..."
                    className="h-12 w-full border border-[#DED8CC] bg-white px-4 text-sm text-[#1F1F1F] outline-none transition focus:border-[#1F1F1F]/25"
                  />

                  <button
                    onClick={() => {
                      setKeyword(q);
                      load(0, q, categoryId);
                    }}
                    className="h-12 border border-[#1F1F1F] bg-[#1F1F1F] px-5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#66707A]">
                  Danh mục
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => {
                    const nextCategoryId = e.target.value;
                    setCategoryId(nextCategoryId);
                    load(0, keyword, nextCategoryId);
                  }}
                  className="h-12 w-full border border-[#DED8CC] bg-white px-4 text-sm text-[#1F1F1F] outline-none"
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
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#66707A]">
                  Sắp xếp theo
                </label>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-12 w-full border border-[#DED8CC] bg-white px-4 text-sm text-[#1F1F1F] outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setCategoryId("all");
                  load(0, keyword, "all");
                }}
                className={[
                  "border px-4 py-2 text-sm transition",
                  categoryId === "all"
                    ? "border-[#1F1F1F] bg-[#1F1F1F] text-white"
                    : "border-[#DED8CC] bg-white text-[#66707A] hover:text-[#1F1F1F]",
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
                      load(0, keyword, option.ma_danh_muc);
                    }}
                    className={[
                      "border px-4 py-2 text-sm transition",
                      active
                        ? "border-[#1F1F1F] bg-[#1F1F1F] text-white"
                        : "border-[#DED8CC] bg-white text-[#66707A] hover:text-[#1F1F1F]",
                    ].join(" ")}
                  >
                    {option.ten_danh_muc}
                  </button>
                );
              })}
            </div>

            {keyword ? (
              <p className="mt-4 text-sm text-[#66707A]">
                Kết quả tìm kiếm cho: {" "}
                <span className="font-medium text-[#1F1F1F]">{keyword}</span>
              </p>
            ) : null}

            {categoriesLoading ? (
              <p className="mt-3 text-xs text-[#8C8478]">Đang tải danh mục...</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-16">
        <div className="bp-container">
          {loading ? (
            <div className="grid grid-cols-2 border-b border-r border-[#DED8CC] lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="border border-[#DED8CC] bg-[#F8F8F5] px-6 py-14 text-center">
              <h2 className="font-heading text-4xl font-medium text-[#1F1F1F]">
                Không tìm thấy sản phẩm
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#66707A]">
                Hãy thử tìm với từ khóa khác hoặc chọn một danh mục khác để xem thêm sản phẩm.
              </p>

              <button
                onClick={() => {
                  setQ("");
                  setKeyword("");
                  setCategoryId("all");
                  setSort("newest");
                  load(0, "", "all");
                }}
                className="mt-6 border border-[#1F1F1F] bg-[#1F1F1F] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 border-b border-r border-[#DED8CC] lg:grid-cols-3 xl:grid-cols-4">
              {sortedItems.map((p) => (
                <article
                  key={p.ma_san_pham}
                  className="group border-l border-t border-[#DED8CC] bg-[#F8F8F5]"
                >
                  <Link href={`/products/${p.ma_san_pham}`} className="block">
                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Thêm vào danh sách yêu thích"
                        className="absolute right-4 top-4 z-10 text-[#8C8478] transition hover:text-[#1F1F1F]"
                      >
                        <WishlistIcon />
                      </button>

                      <div className="flex aspect-square items-center justify-center p-8 md:p-10">
                        {p.primary_image ? (
                          <img
                            src={p.primary_image}
                            alt={p.ten_san_pham}
                            className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-[#66707A]">
                            Chưa có ảnh
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-4 pb-5 pt-3 md:px-5 md:pb-6">
                      <p className="text-[12px] font-medium text-[#8C8478]">
                        {p.so_luong_ton > 0 ? "Còn hàng" : "Hết hàng"}
                      </p>

                      <h3 className="mt-3 line-clamp-2 text-[15px] font-medium leading-6 text-[#111111] md:text-[16px]">
                        {p.ten_san_pham}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[#6F6A63]">
                        Trang sức bạc Blue Peach tinh giản, nhẹ nhàng và thanh lịch cho mỗi ngày.
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-[15px] font-medium text-[#111111]">
                          {Number(p.gia_ban).toLocaleString("vi-VN")}đ
                        </p>

                        <span className="text-[12px] text-[#8C8478]">
                          Tồn kho: {p.so_luong_ton}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="px-4 pb-5 md:px-5 md:pb-6">
                    <AddToCartButton
                      ma_san_pham={p.ma_san_pham}
                      ten_san_pham={p.ten_san_pham}
                      gia_ban={p.gia_ban}
                      primary_image={p.primary_image}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#66707A]">
              {total ? `${offset + 1}-${Math.min(offset + limit, total)} / ${total}` : ""}
            </div>

            <div className="flex gap-3">
              <button
                disabled={offset <= 0 || loading}
                onClick={() => load(Math.max(0, offset - limit), keyword, categoryId)}
                className="border border-[#DED8CC] bg-[#F8F8F5] px-5 py-3 text-sm font-medium text-[#1F1F1F] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <button
                disabled={offset + limit >= total || loading}
                onClick={() => load(offset + limit, keyword, categoryId)}
                className="border border-[#DED8CC] bg-[#F8F8F5] px-5 py-3 text-sm font-medium text-[#1F1F1F] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}