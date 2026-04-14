"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  duration?: number;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

export default function Toast({
  message,
  duration = 2500,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toneClass =
    type === "error"
      ? "border-[#C9A6A6] bg-[#6F2B2B] text-white"
      : type === "info"
      ? "border-[#CFC8BB] bg-[#3E454D] text-white"
      : "border-[#DED8CC] bg-[#1F1F1F] text-white";

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "fixed bottom-6 right-6 z-[120] min-w-[220px] max-w-[340px]",
        "border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
        "text-sm leading-6",
        toneClass,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <span>{message}</span>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="mt-[2px] text-white/75 transition hover:text-white"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}