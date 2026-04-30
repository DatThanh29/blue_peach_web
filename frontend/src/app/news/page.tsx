import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import NewsCard, { NewsCardItem } from "@/components/news/NewsCard";
import { apiFetch } from "@/lib/api";

type NewsListResponse = {
  items: NewsCardItem[];
  total: number;
  limit: number;
  offset: number;
};

async function getNews() {
  try {
    return (await apiFetch("/news?limit=6&offset=0")) as NewsListResponse;
  } catch {
    return {
      items: [],
      total: 0,
      limit: 6,
      offset: 0,
    };
  }
}

export default async function NewsPage() {
  const response = await getNews();
  const visibleItems = response.items ?? [];

  return (
    <main className="bg-[#F7F6F2] text-[#1F1F1F]">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức", active: true },
        ]}
      />

      <section className="bp-container py-10 md:py-12">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7B8791]">
            Blue Peach Journal
          </p>

          <h1 className="font-heading mt-3 text-4xl font-medium tracking-[-0.02em] md:text-5xl">
            Tin tức & Cảm hứng
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#66707A]">
            Những câu chuyện về trang sức bạc, phong cách phối đồ và cảm hứng
            sống tinh tế từ Blue Peach.
          </p>
        </div>

        {visibleItems.length === 0 ? (
          <div className="border border-[#D8D0C4] bg-[#F8F8F5] px-6 py-14 text-center">
            <h2 className="font-heading text-4xl font-medium">
              Chưa có bài viết hiển thị
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#66707A]">
              Hãy kiểm tra lại dữ liệu trong bảng news hoặc trạng thái xuất bản
              của bài viết.
            </p>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-3">
            <div className="space-y-6">
              {visibleItems[0] ? (
                <NewsCard item={visibleItems[0]} imageHeight="h-[360px]" />
              ) : null}

              {visibleItems[3] ? (
                <NewsCard item={visibleItems[3]} imageHeight="h-[260px]" />
              ) : null}
            </div>

            <div className="space-y-6 pt-0 lg:pt-24">
              {visibleItems[1] ? (
                <NewsCard item={visibleItems[1]} imageHeight="h-[420px]" />
              ) : null}

              {visibleItems[4] ? (
                <NewsCard item={visibleItems[4]} imageHeight="h-[260px]" />
              ) : null}
            </div>

            <div className="space-y-6">
              {visibleItems[2] ? (
                <NewsCard item={visibleItems[2]} imageHeight="h-[360px]" />
              ) : null}

              {visibleItems[5] ? (
                <NewsCard item={visibleItems[5]} imageHeight="h-[260px]" />
              ) : null}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}