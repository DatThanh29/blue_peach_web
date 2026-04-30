import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import CollectionProductsGrid from "@/components/collections/CollectionProductsGrid";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

type CollectionItem = {
  ma_bo_suu_tap: string;
  slug: string;
  ten_bo_suu_tap: string;
  mo_ta_ngan?: string | null;
  mo_ta_chi_tiet?: string | null;
  anh_the?: string | null;
  anh_bia?: string | null;
  thu_tu_hien_thi: number;
  noi_bat: boolean;
  trang_thai_hien_thi: boolean;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
};

type CollectionProduct = {
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
  thu_tu_hien_thi?: number;
};

type CollectionDetailResponse = {
  item: CollectionItem;
  products: CollectionProduct[];
};

async function getCollection(slug: string) {
  return apiFetch(`/collections/${slug}`, {
    cache: "no-store",
  }) as Promise<CollectionDetailResponse>;
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const response = await getCollection(slug);
    const collection = response?.item;
    const products = response?.products ?? [];

    if (!collection) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-[#f7f6f2] text-[#1F1F1F]">
        <PageBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Bộ sưu tập", href: "/collections" },
            { label: collection.ten_bo_suu_tap, active: true },
          ]}
        />

        <section className="bp-surface bp-surface-plain py-6 md:py-8">
          <div className="bp-container">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                  Blue Peach Collection
                </p>

                <h1 className="font-heading mt-3 text-3xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-4xl">
                  {collection.ten_bo_suu_tap}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66707A]">
                  {collection.mo_ta_ngan ||
                    "Khám phá những thiết kế bạc được tuyển chọn theo tinh thần tối giản, nữ tính và tinh tế."}
                </p>
              </div>

              <div className="text-sm text-[#8C8478]">
                {products.length} sản phẩm
              </div>
            </div>
          </div>
        </section>

       <CollectionProductsGrid products={products} compactHeader />

        <section className="border-t border-[#DED8CC] py-12 md:py-16">
          <div className="bp-container">
            <div className="grid gap-6 border border-[#DED8CC] bg-[#F8F8F5] p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                  Discover more
                </p>

                <h2 className="font-heading mt-4 text-4xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
                  Khám phá thêm từ Blue Peach
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#66707A] md:text-base">
                  Tiếp tục khám phá những thiết kế mới, sản phẩm bán chạy và các lựa chọn quà tặng phù hợp với nhiều phong cách khác nhau.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:justify-center">
                <Link href="/products?sort=new" className="bp-btn bp-btn--solid">
                  Xem hàng mới
                </Link>

                <Link href="/products?sort=best" className="bp-btn bp-btn--ghost">
                  Xem bán chạy
                </Link>

                <Link href="/collections" className="bp-btn bp-btn--ghost">
                  Tất cả bộ sưu tập
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  } catch {
    notFound();
  }
}