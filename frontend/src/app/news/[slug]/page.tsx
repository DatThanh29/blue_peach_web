import Link from "next/link";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import NewsCard, { NewsCardItem } from "@/components/news/NewsCard";
import { apiFetch } from "@/lib/api";

type NewsDetailItem = NewsCardItem & {
  ma_bai_viet: string;
  noi_dung: string;
};

type NewsDetailResponse = {
  item: NewsDetailItem;
  related: NewsCardItem[];
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN");
}

async function getNewsDetail(slug: string) {
  try {
    return (await apiFetch(`/news/${slug}`)) as NewsDetailResponse;
  } catch {
    return null;
  }
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await getNewsDetail(slug);

  if (!response?.item) return notFound();

  const article = response.item;
  const related = response.related ?? [];

  return (
    <main className="bg-[#F7F6F2] text-[#1F1F1F]">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức", href: "/news" },
          { label: article.tieu_de, active: true },
        ]}
      />

      <section className="bp-container py-10 md:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
            {article.danh_muc || "Tin tức"}
          </p>

          <h1 className="font-heading mt-4 text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-6xl">
            {article.tieu_de}
          </h1>

          {article.tom_tat ? (
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#66707A] md:text-base">
              {article.tom_tat}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-[#8C8478]">
            <span>{formatDate(article.ngay_dang || article.ngay_tao)}</span>
            <span>•</span>
            <span>Viết bởi {article.tac_gia || "Blue Peach"}</span>
            <span>•</span>
            <span>{article.luot_xem || 0} lượt xem</span>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl border border-[#D8D0C4] bg-[#F8F8F5] p-3">
          {article.anh_bia ? (
            <img
              src={article.anh_bia}
              alt={article.tieu_de}
              className="h-[360px] w-full object-cover md:h-[520px]"
            />
          ) : (
            <div className="flex h-[360px] w-full items-center justify-center bg-[#EFE9DF] text-sm text-[#66707A] md:h-[520px]">
              Chưa có ảnh bìa
            </div>
          )}
        </div>

        <article className="mx-auto mt-10 max-w-3xl">
          {article.tom_tat ? (
            <div className="border-y border-[#DDD3C6] py-8">
              <p className="font-heading text-3xl font-medium leading-[1.15] md:text-4xl">
                {article.tom_tat}
              </p>
            </div>
          ) : null}

          <div className="mt-8 space-y-5 text-[15px] leading-8 text-[#343434] md:text-base">
            {article.noi_dung
              .trim()
              .split("\n")
              .filter((line) => line.trim())
              .map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#DDD3C6] pt-6">
            <Link href="/news" className="bp-btn bp-btn--ghost">
              ← Quay lại tin tức
            </Link>

            <Link href="/products" className="bp-btn bp-btn--solid">
              Khám phá sản phẩm
            </Link>
          </div>
        </article>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-[#DED8CC] bg-[#E9E4DA] py-12 md:py-16">
          <div className="bp-container">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
                Đọc thêm
              </p>

              <h2 className="font-heading mt-3 text-4xl font-medium tracking-[-0.02em] md:text-5xl">
                Bài viết liên quan
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <NewsCard
                  key={item.ma_bai_viet || item.slug}
                  item={item}
                  imageHeight="h-[280px]"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}