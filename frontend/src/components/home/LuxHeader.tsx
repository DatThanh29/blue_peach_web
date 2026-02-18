"use client";

import Link from "next/link";

export default function LuxHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="bp-container flex items-center justify-between py-5">
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link className="bp-link" href="/products?category=earrings">Earrings</Link>
          <Link className="bp-link" href="/products?category=rings">Rings</Link>
          <Link className="bp-link" href="/products?category=necklaces">Necklaces</Link>
          <Link className="bp-link" href="/products?category=bracelets">Bracelets</Link>
        </nav>

        <Link
          href="/"
          className="text-center text-sm font-semibold tracking-[0.25em] md:text-base"
        >
          BLUE PEACH
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link className="bp-link hidden md:inline" href="/products">Shop</Link>
          <Link className="bp-link" href="/cart">Cart</Link>
        </div>
      </div>
    </header>
  );
}
