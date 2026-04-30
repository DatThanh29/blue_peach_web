import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f7f6f2]" />}>
      <RegisterClient />
    </Suspense>
  );
}