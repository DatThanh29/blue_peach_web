import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f7f6f2]" />}>
      <VerifyEmailClient />
    </Suspense>
  );
}