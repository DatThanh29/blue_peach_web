import Link from "next/link";

export type NewsCardItem = {
  ma_bai_viet?: string;
  slug: string;
  tieu_de: string;
  tom_tat?: string | null;
  anh_bia?: string | null;
  danh_muc?: string | null;
  tac_gia?: string | null;
  ngay_dang?: string | null;
  ngay_tao?: string | null;
  luot_xem?: number | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN");
}

export default function NewsCard({
  item,
  imageHeight = "h-[300px]",
}: {
  item: NewsCardItem;
  imageHeight?: string;
}) {
  return (
    <article className="border border-[#D8D0C4] bg-[#F8F8F5]">
      <Link href={`/news/${item.slug}`} className="group block p-3">
        <div className="overflow-hidden bg-white">
          {item.anh_bia ? (
            <img
              src={item.anh_bia}
              alt={item.tieu_de}
              className={`${imageHeight} w-full object-cover transition duration-700 group-hover:scale-[1.04]`}
            />
          ) : (
            <div className={`${imageHeight} flex w-full items-center justify-center bg-[#EFE9DF] text-sm text-[#66707A]`}>
              Chưa có ảnh
            </div>
          )}
        </div>

        <div className="px-1 pb-5 pt-5">
          <p className="text-sm font-medium text-[#1F1F1F]">
            {formatDate(item.ngay_dang || item.ngay_tao)}
          </p>

          <h3 className="mt-4 text-[18px] font-semibold leading-7 text-[#111111] transition group-hover:opacity-70">
            {item.tieu_de}
          </h3>

          <p className="mt-3 text-sm italic text-[#7B7168]">
            Viết bởi {item.tac_gia || "Blue Peach"} / {item.luot_xem || 0} lượt xem
          </p>

          <p className="mt-5 line-clamp-5 text-sm leading-7 text-[#1F1F1F]">
            {item.tom_tat || "Khám phá thêm câu chuyện từ Blue Peach."}
          </p>
        </div>
      </Link>
    </article>
  );
}