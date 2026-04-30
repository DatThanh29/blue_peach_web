import { apiFetch } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

type ProductImage = {
  duong_dan_anh: string;
  la_anh_chinh: boolean;
  thu_tu: number;
};

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
  images?: ProductImage[];
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

type RelatedProductsResponse = {
  items: RelatedProduct[];
  total: number;
  limit: number;
};

function extractProductId(value: string): string {
  const uuidMatch = value.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  );

  return uuidMatch ? uuidMatch[0] : value;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const raw = (await params).id;
  const id = extractProductId(raw);

  try {
    const [product, reviewsData, relatedProductsRes] = await Promise.all([
      apiFetch(`/products/${id}`),
      apiFetch(`/products/${id}/reviews`).catch(() => ({
        summary: {
          average_rating: 0,
          total_reviews: 0,
        },
        items: [],
      })),
      apiFetch(`/products/${id}/related?limit=4`).catch(() => ({
        items: [],
        total: 0,
        limit: 4,
      })),
    ]);

    return (
      <ProductDetailClient
        product={product as ProductDetail}
        reviewsData={reviewsData as ProductReviewsResponse}
        relatedProducts={(relatedProductsRes as RelatedProductsResponse).items ?? []}
      />
    );
  } catch {
    notFound();
  }
}