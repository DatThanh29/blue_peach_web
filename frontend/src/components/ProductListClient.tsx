"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";


type Product = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  so_luong_ton: number;
  primary_image: string | null;
};

type Resp = {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
};

export default function ProductListClient() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  async function load(offset: number, keyword: string) {
    setLoading(true);
    const url = new URL(`${API_BASE_URL}/api/products`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    if (keyword.trim()) url.searchParams.set("q", keyword.trim());

    const res = await fetch(url.toString());
    const json = (await res.json()) as Resp;
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load(0, "");
  }, []);

  const offset = data?.offset ?? 0;
  const total = data?.total ?? 0;

  return (
    <main style={{ padding: 24 }}>
      <h1>Blue Peach — Products</h1>

      <div style={{ display: "flex", gap: 8, margin: "12px 0 18px" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm sản phẩm..."
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", flex: 1 }}
        />
        <button
          onClick={() => load(0, q)}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Tìm
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {(data?.items ?? []).map((p) => (
          <div
            key={p.ma_san_pham}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <a
              href={`/products/${p.ma_san_pham}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ aspectRatio: "1/1", overflow: "hidden", borderRadius: 10, background: "#fafafa" }}>
                {p.primary_image ? (
                  <img
                    src={p.primary_image}
                    alt={p.ten_san_pham}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : null}
              </div>
              <div style={{ marginTop: 10, fontWeight: 600 }}>{p.ten_san_pham}</div>
              <div>Giá: {Number(p.gia_ban).toLocaleString("vi-VN")}đ</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Tồn: {p.so_luong_ton}</div>
            </a>
            
            <AddToCartButton
              ma_san_pham={p.ma_san_pham}
              ten_san_pham={p.ten_san_pham}
              gia_ban={p.gia_ban}
              primary_image={p.primary_image}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <button
          disabled={offset <= 0 || loading}
          onClick={() => load(Math.max(0, offset - limit), q)}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          ← Trước
        </button>

        <button
          disabled={offset + limit >= total || loading}
          onClick={() => load(offset + limit, q)}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Sau →
        </button>

        <div style={{ marginLeft: "auto", opacity: 0.7, alignSelf: "center" }}>
          {total ? `${offset + 1}-${Math.min(offset + limit, total)} / ${total}` : ""}
        </div>
      </div>
    </main>
  );
}
