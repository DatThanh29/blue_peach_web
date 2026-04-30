"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/api";
import { CartItem, clearCart, getCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

type PaymentMethod = "cod" | "vnpay";

type CouponValidateResponse = {
  ok: true;
  coupon: {
    ma_giam_gia: string;
    code: string;
    loai_giam_gia: "percent" | "fixed";
    gia_tri_giam: number;
  };
  discount_amount: number;
  final_total: number;
};

type UserAddress = {
  id: string;
  user_id: string;
  recipient_name: string | null;
  recipient_phone: string | null;
  label: string | null;
  province_code: string | null;
  province_name: string | null;
  ward_code: string | null;
  ward_name: string | null;
  address_line1: string;
  address_line2: string | null;
  note: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));
}

function renderFullAddress(address: UserAddress) {
  return [
    address.address_line1,
    address.address_line2,
    address.ward_name,
    address.province_name,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useCustomerAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<CouponValidateResponse["coupon"] | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const [addressLoading, setAddressLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(getCart());
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;
    void loadAddresses();
  }, [user?.id]);

  async function loadAddresses() {
    if (!user?.id) return;

    try {
      setAddressLoading(true);

      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) {
        setError(error.message || "Không thể tải sổ địa chỉ.");
        return;
      }

      const addressList = (data || []) as UserAddress[];
      setAddresses(addressList);

      const defaultAddress =
        addressList.find((item) => item.is_default) || addressList[0];

      setSelectedAddressId(defaultAddress?.id || "");
    } catch (e: any) {
      setError(e?.message || "Không thể tải sổ địa chỉ.");
    } finally {
      setAddressLoading(false);
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((item) => item.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.gia_ban) * item.qty, 0),
    [items]
  );

  const shippingFee = 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  async function applyCoupon() {
    setError(null);

    if (!couponCode.trim()) {
      setError("Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      setCouponLoading(true);

      const data = await authFetch("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({
          code: couponCode,
          subtotal,
        }),
      });

      if (!data?.ok) {
        throw new Error(data?.error || "Mã giảm giá không hợp lệ.");
      }

      setAppliedCoupon(data.coupon);
      setDiscountAmount(Number(data.discount_amount || 0));
    } catch (e: any) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setError(e?.message || "Không áp dụng được mã giảm giá.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    setError(null);
  }

  async function submit() {
    setError(null);

    if (items.length === 0) {
      setError("Giỏ hàng trống.");
      return;
    }

    if (!selectedAddress) {
      setError("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    const shippingAddressSnapshot = {
      recipient_name: selectedAddress.recipient_name || "",
      recipient_phone: selectedAddress.recipient_phone || "",
      province_code: selectedAddress.province_code,
      province_name: selectedAddress.province_name,
      ward_code: selectedAddress.ward_code,
      ward_name: selectedAddress.ward_name,
      address_line1: selectedAddress.address_line1,
      address_line2: selectedAddress.address_line2,
      note: selectedAddress.note,
      full_address: renderFullAddress(selectedAddress),
    };

    setLoading(true);

    try {
      const payload = {
        customer_name: selectedAddress.recipient_name || "",
        phone: selectedAddress.recipient_phone || "",
        address: renderFullAddress(selectedAddress),
        note: note.trim() || undefined,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon?.code || undefined,
        user_address_id: selectedAddress.id,
        shipping_address_snapshot: shippingAddressSnapshot,
        items: items.map((item) => ({
          ma_san_pham: item.ma_san_pham,
          qty: item.qty,
        })),
      };

      if (paymentMethod === "vnpay") {
        const data = await authFetch("/payments/vnpay/create", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const paymentUrl = data?.paymentUrl || data?.payment_url;

        if (!paymentUrl) {
          throw new Error("Không thể khởi tạo thanh toán VNPay.");
        }

        window.location.href = paymentUrl;
        return;
      }

      const data = await authFetch("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const orderId =
        data?.order_id ||
        data?.order?.ma_don_hang ||
        data?.ma_don_hang ||
        data?.id ||
        data?.data?.ma_don_hang;

      if (!orderId) {
        throw new Error(data?.error || "Không thể tạo đơn hàng");
      }

      clearCart();
      setItems([]);

      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (e: any) {
      setError(e?.message ?? "Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-stone-500">Đang kiểm tra tài khoản...</p>
      </main>
    );
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giỏ hàng", href: "/cart" },
          { label: "Thanh toán", active: true },
        ]}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
            Checkout
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Thanh toán đơn hàng
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Chọn địa chỉ đã lưu trong tài khoản và hoàn tất phương thức thanh toán
            cho đơn hàng Blue Peach của bạn.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-stone-900">
                Địa chỉ nhận hàng
              </h2>

              <div className="flex items-center gap-3">
                <Link
                  href="/cart"
                  className="text-sm text-stone-500 hover:text-stone-800"
                >
                  Quay lại giỏ hàng
                </Link>

                <Link
                  href="/account/addresses"
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  Quản lý địa chỉ
                </Link>
              </div>
            </div>

            {addressLoading ? (
              <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600">
                Đang tải sổ địa chỉ...
              </div>
            ) : addresses.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                Bạn chưa có địa chỉ nào trong tài khoản. Vui lòng thêm địa chỉ
                trước khi thanh toán.{" "}
                <Link
                  href="/account/addresses"
                  className="font-medium underline underline-offset-4"
                >
                  Tới sổ địa chỉ
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {addresses.map((address) => {
                  const checked = selectedAddressId === address.id;

                  return (
                    <label
                      key={address.id}
                      className={[
                        "flex cursor-pointer gap-3 rounded-2xl border p-4 transition",
                        checked
                          ? "border-stone-900 bg-stone-50"
                          : "border-stone-200 hover:border-stone-300",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="selected_address"
                        value={address.id}
                        checked={checked}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-stone-900">
                            {address.label || "Địa chỉ giao hàng"}
                          </p>

                          {address.is_default ? (
                            <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                              Mặc định
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-2 text-sm font-medium text-stone-800">
                          {address.recipient_name || "Chưa có người nhận"}
                        </p>

                        <p className="mt-1 text-sm text-stone-500">
                          {address.recipient_phone || "Chưa có số điện thoại"}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-stone-700">
                          {renderFullAddress(address)}
                        </p>

                        {address.note ? (
                          <p className="mt-2 text-sm text-stone-500">
                            Ghi chú địa chỉ: {address.note}
                          </p>
                        ) : null}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-stone-900">
                Ghi chú đơn hàng
              </h2>

              <div className="mt-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                  rows={3}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-500"
                />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-stone-900">
                Mã giảm giá
              </h2>

              <div className="mt-4 rounded-2xl border border-stone-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-500"
                  />

                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading || subtotal <= 0}
                    className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60"
                  >
                    {couponLoading ? "Đang kiểm tra..." : "Áp dụng"}
                  </button>

                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="rounded-full border border-rose-300 px-5 py-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Bỏ mã
                    </button>
                  ) : null}
                </div>

                {appliedCoupon ? (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    Đã áp dụng mã <strong>{appliedCoupon.code}</strong> — giảm{" "}
                    <strong>{formatCurrency(discountAmount)}</strong>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-stone-900">
                Phương thức thanh toán
              </h2>

              <div className="mt-4 grid gap-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 p-4 transition hover:border-stone-300">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      Thanh toán khi nhận hàng
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      Thanh toán trực tiếp khi nhận được đơn hàng.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 p-4 transition hover:border-stone-300">
                  <input
                    type="radio"
                    name="payment_method"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => setPaymentMethod("vnpay")}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      Thanh toán online qua VNPay
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      Hỗ trợ ngân hàng nội địa, QR Pay và các phương thức thanh toán
                      trực tuyến qua cổng VNPay.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-8">
              <button
                disabled={loading || items.length === 0 || !selectedAddress}
                onClick={submit}
                className="inline-flex items-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? paymentMethod === "vnpay"
                    ? "Đang chuyển đến VNPay..."
                    : "Đang xử lý đơn hàng..."
                  : paymentMethod === "vnpay"
                    ? "Tiếp tục đến VNPay"
                    : "Hoàn tất đặt hàng"}
              </button>
            </div>
          </section>

          <aside className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-stone-900">
              Đơn hàng của bạn
            </h2>

            {selectedAddress ? (
              <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-900">
                  Giao đến
                </p>
                <p className="mt-2 text-sm font-medium text-stone-800">
                  {selectedAddress.recipient_name}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  {selectedAddress.recipient_phone}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  {renderFullAddress(selectedAddress)}
                </p>
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-stone-500">Giỏ hàng hiện đang trống.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.ma_san_pham}
                    className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium text-stone-800">
                        {item.ten_san_pham}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Số lượng: {item.qty}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-stone-900">
                      {formatCurrency(Number(item.gia_ban) * item.qty)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 space-y-3 border-t border-stone-200 pt-5 text-sm">
              <div className="flex items-center justify-between text-stone-600">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Giảm giá</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 text-base font-semibold text-stone-900">
                <span>Tổng thanh toán</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}