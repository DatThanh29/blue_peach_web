"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/contexts/CartContext";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";

const AUTH_HIDDEN_HEADER_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const hideHeaderForAuthRoute = AUTH_HIDDEN_HEADER_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  const shouldShowHeader = !isAdminRoute && !hideHeaderForAuthRoute;

  return (
    <CustomerAuthProvider>
      <CartProvider>
        {shouldShowHeader ? <Header /> : null}
        {children}
      </CartProvider>
    </CustomerAuthProvider>
  );
}