import { Suspense } from "react";
import ProductListClient from "@/components/ProductListClient";
import CouponStrip from "@/components/home/CouponStrip";

export default function ProductsPage() {
  return (
    <>
      <CouponStrip />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ProductListClient />
      </Suspense>
    </>
  );
}