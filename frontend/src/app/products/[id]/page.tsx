import { apiGet } from "@/lib/api";
import { notFound } from "next/navigation";

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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: ProductDetail;

  try {
    product = await apiGet<ProductDetail>(`/api/products/${id}`);
  } catch (error) {
    notFound();
  }

  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : product.primary_image 
    ? [{ duong_dan_anh: product.primary_image, la_anh_chinh: true, thu_tu: 0 }]
    : [];

  const hasDiscount = product.phan_tram_giam && product.phan_tram_giam > 0;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <a href="/" style={{ color: "#0070f3", textDecoration: "none", marginBottom: 20, display: "inline-block" }}>
        ← Quay lại
      </a>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 20 }}>
        {/* Images */}
        <div>
          {displayImages.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {displayImages.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    borderRadius: 12,
                    background: "#fafafa",
                    border: img.la_anh_chinh ? "2px solid #0070f3" : "1px solid #eee",
                  }}
                >
                  <img
                    src={img.duong_dan_anh}
                    alt={product.ten_san_pham}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                aspectRatio: "1/1",
                background: "#fafafa",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              Không có ảnh
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>SKU: {product.sku}</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>{product.ten_san_pham}</h1>

          <div style={{ marginBottom: 24 }}>
            {hasDiscount && product.gia_goc ? (
              <>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#d00" }}>
                  {Number(product.gia_ban).toLocaleString("vi-VN")}đ
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 16, textDecoration: "line-through", color: "#999" }}>
                    {Number(product.gia_goc).toLocaleString("vi-VN")}đ
                  </span>
                  <span style={{ fontSize: 14, color: "#d00", fontWeight: 600 }}>
                    -{product.phan_tram_giam}%
                  </span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {Number(product.gia_ban).toLocaleString("vi-VN")}đ
              </div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, color: product.so_luong_ton > 0 ? "#0a0" : "#d00" }}>
              {product.so_luong_ton > 0 ? `Còn hàng (${product.so_luong_ton})` : "Hết hàng"}
            </div>
          </div>

          {product.mo_ta_san_pham && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Mô tả sản phẩm</h2>
              <div style={{ lineHeight: 1.6, color: "#555" }}>{product.mo_ta_san_pham}</div>
            </div>
          )}

          <button
            style={{
              width: "100%",
              padding: "14px 24px",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              background: product.so_luong_ton > 0 ? "#0070f3" : "#ccc",
              border: "none",
              borderRadius: 8,
              cursor: product.so_luong_ton > 0 ? "pointer" : "not-allowed",
            }}
            disabled={product.so_luong_ton === 0}
          >
            {product.so_luong_ton > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
          </button>

          {product.ngay_tao && (
            <div style={{ marginTop: 24, fontSize: 12, color: "#999" }}>
              Ngày tạo: {new Date(product.ngay_tao).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
