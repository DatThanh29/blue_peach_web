"use client";

import { useCart } from "@/hooks/useCart";
import { flyToCart } from "@/utils/flyToCart";

type AddToCartButtonProps = {
  product: {
    ma_san_pham: string;
    ten_san_pham: string;
    gia_ban: number;
    primary_image?: string;
    so_luong_ton: number;
  };
};

export default function AddToCartButtonDetail({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // Thêm vào giỏ hàng
    addItem(
      {
        ma_san_pham: product.ma_san_pham,
        ten_san_pham: product.ten_san_pham,
        gia_ban: product.gia_ban,
        primary_image: product.primary_image || null,
      },
      1
    );

    // Chạy animation bay vào giỏ
    flyToCart('product-main-image', 'cart-icon');
  };

  return (
    <button
      onClick={handleAddToCart}
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
        transition: "background 0.2s",
      }}
      disabled={product.so_luong_ton === 0}
      onMouseEnter={(e) => {
        if (product.so_luong_ton > 0) {
          e.currentTarget.style.background = "#0051cc";
        }
      }}
      onMouseLeave={(e) => {
        if (product.so_luong_ton > 0) {
          e.currentTarget.style.background = "#0070f3";
        }
      }}
    >
      {product.so_luong_ton > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
    </button>
  );
}
