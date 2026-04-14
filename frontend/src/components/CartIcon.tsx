"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartIcon({
  className = "relative inline-flex h-10 w-10 items-center justify-center transition hover:bg-black/5",
  badgeClassName = "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-black text-white text-[11px] leading-[18px] text-center",
}: {
  className?: string;
  badgeClassName?: string;
}) {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Link
      href="/cart"
      id="cart-icon"
      aria-label="Cart"
      className={className}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-95"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {itemCount > 0 && <span className={badgeClassName}>{itemCount}</span>}
    </Link>
  );
}