import ProductCard from "@/components/ProductCard";

type CollectionProduct = {
  ma_san_pham: string;
  sku?: string;
  ten_san_pham: string;
  gia_ban: number;
  gia_goc?: number;
  phan_tram_giam?: number;
  so_luong_ton?: number;
  primary_image: string | null;
  is_bestseller?: boolean;
};

export default function CollectionProductsGrid({
  title = "Sản phẩm trong bộ sưu tập",
  description,
  products,
}: {
  title?: string;
  description?: string;
  products: CollectionProduct[];
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="bp-container">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
            Curated for you
          </p>

          <h2 className="font-heading mt-4 text-4xl font-medium tracking-[-0.02em] text-[#1F1F1F] md:text-5xl">
            {title}
          </h2>

          {description ? (
            <p className="mt-4 text-sm leading-6 text-[#66707A] md:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {products.length === 0 ? (
          <div className="border border-[#DED8CC] bg-[#F8F8F5] px-6 py-14 text-center">
            <h3 className="font-heading text-4xl font-medium text-[#1F1F1F]">
              Chưa có sản phẩm hiển thị
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#66707A]">
              Bộ sưu tập này đang được cập nhật thêm sản phẩm mới từ Blue Peach.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 border-b border-r border-[#DED8CC] lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const hasDiscount =
                !!product.phan_tram_giam && product.phan_tram_giam > 0;

              return (
                <ProductCard
                  key={product.ma_san_pham}
                  product={product}
                  badgeText={
                    hasDiscount
                      ? `-${product.phan_tram_giam}%`
                      : product.is_bestseller
                      ? "Bán chạy"
                      : "Blue Peach"
                  }
                  description="Trang sức bạc Blue Peach tinh giản, nhẹ nhàng và thanh lịch cho mỗi ngày."
                  showAddToCart
                  showStock
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}