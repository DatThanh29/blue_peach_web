import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

export default function PageBreadcrumb({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  return (
    <section className="border-b border-[#E5DED4] bg-[#F4F1EB]">
      <div className="bp-container py-4">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#8C8478]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1 || item.active;

            return (
              <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link href={item.href} className="transition hover:text-[#1F1F1F]">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-[#66707A]" : "text-[#C46B3A]"}>
                    {item.label}
                  </span>
                )}

                {index < items.length - 1 ? (
                  <span className="text-[#CFC7BA]">/</span>
                ) : null}
              </span>
            );
          })}
        </nav>
      </div>
    </section>
  );
}