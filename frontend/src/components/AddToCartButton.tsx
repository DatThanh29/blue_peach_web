"use client";

import { useEffect, useRef, useState } from "react";
import { addToCart } from "@/lib/cart";
import Toast from "@/components/Toast";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  ma_san_pham: string;
  ten_san_pham: string;
  gia_ban: number;
  primary_image?: string | null;
};

function flyToCartFromCard(buttonEl: HTMLButtonElement | null, imageSrc?: string | null) {
  const cart = document.getElementById("cart-icon");
  if (!cart || !buttonEl || !imageSrc) return;

  const article = buttonEl.closest("article");
  const imageEl = article?.querySelector("img");

  if (!imageEl) return;

  const sourceRect = imageEl.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  const flyer = document.createElement("img");
  flyer.src = imageSrc;
  flyer.alt = "Flying product image";
  flyer.style.position = "fixed";
  flyer.style.left = `${sourceRect.left}px`;
  flyer.style.top = `${sourceRect.top}px`;
  flyer.style.width = `${sourceRect.width}px`;
  flyer.style.height = `${sourceRect.height}px`;
  flyer.style.objectFit = "contain";
  flyer.style.pointerEvents = "none";
  flyer.style.zIndex = "9999";
  flyer.style.transition =
    "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease";
  flyer.style.borderRadius = "12px";
  flyer.style.boxShadow = "0 12px 30px rgba(0,0,0,0.16)";
  flyer.style.border = "1px solid rgba(0,0,0,0.08)";
  flyer.style.background = "#fff";

  document.body.appendChild(flyer);

  requestAnimationFrame(() => {
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const cartCenterX = cartRect.left + cartRect.width / 2;
    const cartCenterY = cartRect.top + cartRect.height / 2;

    const translateX = cartCenterX - sourceCenterX;
    const translateY = cartCenterY - sourceCenterY;

    flyer.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.22)`;
    flyer.style.opacity = "0.15";
  });

  setTimeout(() => {
    flyer.remove();
  }, 1250);
}

export default function AddToCartButton(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useCustomerAuth();

  const [added, setAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(pathname || "/products")}`);
            return;
          }

          flyToCartFromCard(buttonRef.current, props.primary_image);

          addToCart(
            {
              ma_san_pham: props.ma_san_pham,
              ten_san_pham: props.ten_san_pham,
              gia_ban: props.gia_ban,
              primary_image: props.primary_image ?? null,
            },
            1
          );

          setAdded(true);
          setToastMessage("Đã thêm vào giỏ hàng");
        }}
        className={[
          "inline-flex h-11 w-full items-center justify-center border text-sm font-medium transition",
          added
            ? "border-[#1F1F1F] bg-[#1F1F1F] text-white"
            : "border-[#DED8CC] bg-transparent text-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white",
        ].join(" ")}
        aria-live="polite"
      >
        {added ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
      </button>

      {toastMessage && (
        <Toast
          message={toastMessage}
          duration={2500}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
}