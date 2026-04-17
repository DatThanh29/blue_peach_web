import { apiFetch } from "@/lib/api";
import HeroSlider from "@/components/home/HeroSlider";
import CollectionCard from "@/components/collections/CollectionCard";

type CollectionItem = {
  ma_bo_suu_tap: string;
  slug: string;
  ten_bo_suu_tap: string;
  mo_ta_ngan?: string | null;
  anh_the?: string | null;
  anh_bia?: string | null;
  thu_tu_hien_thi: number;
  noi_bat: boolean;
  trang_thai_hien_thi: boolean;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
  product_count?: number;
};

type CollectionsResponse = {
  items: CollectionItem[];
  total: number;
};

async function getCollections() {
  return apiFetch("/collections", {
    cache: "no-store",
  }) as Promise<CollectionsResponse>;
}

export default async function CollectionsPage() {
  const response = await getCollections();
  const collections = response?.items ?? [];

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#1F1F1F]">
      <section className="bp-surface bp-surface-plain">
        <HeroSlider />
      </section>

      <section className="py-4 md:py-6">
        <div className="bp-container">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                Curated edits
              </p>

              <h1 className="font-heading mt-4 text-4xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
                Những lựa chọn mang dấu ấn riêng
              </h1>

              <p className="mt-4 text-sm leading-6 text-[#66707A] md:text-base">
                Mỗi bộ sưu tập là một câu chuyện nhỏ về phong cách, cảm hứng và cách Blue Peach tuyển chọn những thiết kế phù hợp với từng mood khác nhau.
              </p>
            </div>

            <div className="text-sm text-[#66707A]">
              {collections.length} bộ sưu tập
            </div>
          </div>

          {collections.length === 0 ? (
            <div className="border border-[#DED8CC] bg-[#F8F8F5] px-6 py-14 text-center">
              <h3 className="font-heading text-4xl font-medium text-[#1F1F1F]">
                Chưa có bộ sưu tập hiển thị
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#66707A]">
                Dữ liệu bộ sưu tập đang được cập nhật. Bạn có thể xem toàn bộ sản phẩm của Blue Peach trong lúc chờ.
              </p>

              <a href="/products" className="bp-btn bp-btn--solid mt-6">
                Xem tất cả sản phẩm
              </a>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.ma_bo_suu_tap}
                  collection={collection}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}