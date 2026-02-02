"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

type Props = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  primary_image?: string | null;
};

export default function AddToCartButton(props: Props) {
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addToCart(
          {
            ma_san_pham: props.ma_san_pham,
            ten_san_pham: props.ten_san_pham,
            gia_ban: props.gia_ban,
            primary_image: props.primary_image ?? null,
          },
          1
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 900);
      }}
      style={{
        marginTop: 10,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #ddd",
        cursor: "pointer",
      }}
    >
      {added ? "✅ Đã thêm" : "Thêm vào giỏ"}
    </button>
  );
}
