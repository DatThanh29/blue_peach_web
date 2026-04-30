"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import {
  VN_ADDRESS_OPTIONS,
  type ProvinceOption,
  type WardOption,
} from "@/data/vn-addresses";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
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

const ADDRESS_LABEL_OPTIONS = ["Nhà riêng", "Công ty", "Khác"];

export default function AccountAddressesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    signOut,
  } = useCustomerAuth();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [label, setLabel] = useState("Nhà riêng");

  const [provinceCode, setProvinceCode] = useState("");
  const [wardCode, setWardCode] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [note, setNote] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isEmailVerified) {
      router.replace(
        `/verify-email${user?.email ? `?email=${encodeURIComponent(user.email)}` : ""}`
      );
    }
  }, [isLoading, isAuthenticated, isEmailVerified, router, user?.email]);

  const displayName = useMemo(() => {
    if (profile?.full_name?.trim()) return profile.full_name.trim();
    if (user?.email) return user.email;
    return "Khách hàng Blue Peach";
  }, [profile?.full_name, user?.email]);

  const avatarText = useMemo(() => {
    if (profile?.full_name?.trim()) {
      const parts = profile.full_name.trim().split(/\s+/);
      const first = parts[0]?.[0] || "";
      const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
      return `${first}${last}`.toUpperCase();
    }

    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }

    return "BP";
  }, [profile?.full_name, user?.email]);

  const selectedProvince = useMemo<ProvinceOption | null>(() => {
    return VN_ADDRESS_OPTIONS.find((item) => item.code === provinceCode) || null;
  }, [provinceCode]);

  const wardOptions = useMemo<WardOption[]>(() => {
    return selectedProvince?.wards || [];
  }, [selectedProvince]);

  const navItems: NavItem[] = [
    { label: "Thông tin chung", href: "/account", icon: <DashboardIcon /> },
    { label: "Hồ sơ cá nhân", href: "/account/profile", icon: <UserIcon /> },
    { label: "Sổ địa chỉ", href: "/account/addresses", icon: <LocationIcon /> },
    { label: "Đơn hàng", href: "/account/orders", icon: <BagIcon /> },
    {
      label: "Thông báo",
      href: "/account/notifications",
      icon: <BellIcon />,
    },
    {
      label: "Yêu thích",
      href: "/account/wishlist",
      icon: <HeartIcon />,
    },
    {
      label: "AI tư vấn",
      href: "/account/ai-assistant",
      icon: <SparklesIcon />,
    },
    {
      label: "Chat với Admin",
      href: "/account/chat-admin",
      icon: <ChatIcon />,
    },
    {
      label: "Bảo mật tài khoản",
      href: "/account/security",
      icon: <ShieldIcon />,
    },
  ];

  useEffect(() => {
    if (!user?.id || !isAuthenticated || !isEmailVerified) return;
    void loadAddresses();
  }, [user?.id, isAuthenticated, isEmailVerified]);

  async function loadAddresses() {
    if (!user?.id) return;

    try {
      setPageLoading(true);

      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) {
        setToast({
          message: error.message || "Không thể tải sổ địa chỉ.",
          type: "error",
        });
        return;
      }

      setAddresses((data || []) as UserAddress[]);
    } catch (error) {
      console.error("[AccountAddressesPage] load addresses failed:", error);
      setToast({
        message: "Không thể tải sổ địa chỉ lúc này.",
        type: "error",
      });
    } finally {
      setPageLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setToast(null);

      const result = await signOut();

      if (result.error) {
        setToast({
          message: result.error,
          type: "error",
        });
        return;
      }

      router.replace("/login");
    } catch (error) {
      console.error("[AccountAddressesPage] signOut failed:", error);
      setToast({
        message: "Không thể đăng xuất lúc này.",
        type: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setRecipientName("");
    setRecipientPhone("");
    setLabel("Nhà riêng");
    setProvinceCode("");
    setWardCode("");
    setAddressLine1("");
    setAddressLine2("");
    setNote("");
    setIsDefault(false);
  }

  function handleEdit(address: UserAddress) {
    setEditingId(address.id);
    setRecipientName(address.recipient_name || "");
    setRecipientPhone(address.recipient_phone || "");
    setLabel(address.label || "Nhà riêng");
    setProvinceCode(address.province_code || "");
    setWardCode(address.ward_code || "");
    setAddressLine1(address.address_line1 || "");
    setAddressLine2(address.address_line2 || "");
    setNote(address.note || "");
    setIsDefault(address.is_default);
  }

  function handleProvinceChange(nextProvinceCode: string) {
    setProvinceCode(nextProvinceCode);
    setWardCode("");
  }

  async function unsetOtherDefaultAddresses() {
    if (!user?.id) return;

    const { error } = await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);

    if (error) {
      throw new Error(error.message || "Không thể cập nhật địa chỉ mặc định.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.id) {
      setToast({
        message: "Không xác định được người dùng hiện tại.",
        type: "error",
      });
      return;
    }

    if (!recipientName.trim()) {
      setToast({
        message: "Vui lòng nhập tên người nhận.",
        type: "error",
      });
      return;
    }

    if (!recipientPhone.trim()) {
      setToast({
        message: "Vui lòng nhập số điện thoại người nhận.",
        type: "error",
      });
      return;
    }

    if (!provinceCode) {
      setToast({
        message: "Vui lòng chọn Tỉnh/Thành phố.",
        type: "error",
      });
      return;
    }

    if (!wardCode) {
      setToast({
        message: "Vui lòng chọn Xã/Phường/Đặc khu.",
        type: "error",
      });
      return;
    }

    if (!addressLine1.trim()) {
      setToast({
        message: "Vui lòng nhập địa chỉ chi tiết.",
        type: "error",
      });
      return;
    }

    const province = VN_ADDRESS_OPTIONS.find((item) => item.code === provinceCode);
    const ward = province?.wards.find((item) => item.code === wardCode);

    if (!province || !ward) {
      setToast({
        message: "Địa chỉ đã chọn không hợp lệ.",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      setToast(null);

      if (isDefault) {
        await unsetOtherDefaultAddresses();
      }

      const payload = {
        user_id: user.id,
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        label: label.trim() || "Nhà riêng",
        province_code: province.code,
        province_name: province.name,
        ward_code: ward.code,
        ward_name: ward.name,
        address_line1: addressLine1.trim(),
        address_line2: addressLine2.trim() || null,
        note: note.trim() || null,
        is_default: isDefault,
      };

      if (editingId) {
        const { error } = await supabase
          .from("user_addresses")
          .update(payload)
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (error) {
          setToast({
            message: error.message || "Không thể cập nhật địa chỉ.",
            type: "error",
          });
          return;
        }

        setToast({
          message: "Cập nhật địa chỉ thành công.",
          type: "success",
        });
      } else {
        const { error } = await supabase.from("user_addresses").insert(payload);

        if (error) {
          setToast({
            message: error.message || "Không thể thêm địa chỉ mới.",
            type: "error",
          });
          return;
        }

        setToast({
          message: "Thêm địa chỉ thành công.",
          type: "success",
        });
      }

      resetForm();
      await loadAddresses();
    } catch (error: any) {
      console.error("[AccountAddressesPage] submit failed:", error);
      setToast({
        message: error?.message || "Không thể lưu địa chỉ lúc này.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(addressId: string) {
    const confirmed = window.confirm("Bạn có chắc muốn xóa địa chỉ này không?");
    if (!confirmed || !user?.id) return;

    try {
      setToast(null);

      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", user.id);

      if (error) {
        setToast({
          message: error.message || "Không thể xóa địa chỉ.",
          type: "error",
        });
        return;
      }

      if (editingId === addressId) {
        resetForm();
      }

      setToast({
        message: "Đã xóa địa chỉ.",
        type: "success",
      });

      await loadAddresses();
    } catch (error) {
      console.error("[AccountAddressesPage] delete failed:", error);
      setToast({
        message: "Không thể xóa địa chỉ lúc này.",
        type: "error",
      });
    }
  }

  async function handleSetDefault(addressId: string) {
    if (!user?.id) return;

    try {
      setToast(null);

      await unsetOtherDefaultAddresses();

      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", addressId)
        .eq("user_id", user.id);

      if (error) {
        setToast({
          message: error.message || "Không thể đặt địa chỉ mặc định.",
          type: "error",
        });
        return;
      }

      setToast({
        message: "Đã cập nhật địa chỉ mặc định.",
        type: "success",
      });

      await loadAddresses();
    } catch (error: any) {
      console.error("[AccountAddressesPage] set default failed:", error);
      setToast({
        message: error?.message || "Không thể cập nhật địa chỉ mặc định.",
        type: "error",
      });
    }
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

  if (isLoading || !isAuthenticated || !isEmailVerified) {
    return (
      <main className="bp-surface bp-surface-plain min-h-screen pt-24 md:pt-28">
        <PageBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tài khoản", href: "/account" },
            { label: "Sổ địa chỉ", active: true },
          ]}
        />
        <section className="bp-container py-16">
          <div className="mx-auto max-w-[520px] text-center">
            <p className="text-sm text-black/60">Đang tải sổ địa chỉ...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bp-surface bp-surface-plain min-h-screen pt-24 md:pt-28">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tài khoản", href: "/account" },
          { label: "Sổ địa chỉ", active: true },
        ]}
      />
      <section className="bp-container py-8 md:py-12">
        <div className="rounded-[34px] border border-black/8 bg-white/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-6">
          <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="rounded-[28px] border border-black/8 bg-[#f8f4ed] p-4 md:p-5">
              <div className="rounded-[24px] border border-black/8 bg-white/70 px-4 py-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#efe6d8] text-lg font-semibold tracking-[0.08em] text-black/78">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    avatarText
                  )}
                </div>

                <p className="mt-4 truncate text-lg font-semibold text-black">
                  {displayName}
                </p>
              </div>

              <nav className="mt-4 space-y-2">
                {navItems.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center justify-between rounded-[18px] px-4 py-3 text-sm transition",
                        active
                          ? "bg-black text-white shadow-sm"
                          : "bg-white/70 text-black/75 hover:bg-white",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-3">
                        <span className={active ? "text-white" : "text-black/65"}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </span>

                      {item.badge ? (
                        <span
                          className={[
                            "rounded-full px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.12em]",
                            active
                              ? "bg-white/16 text-white"
                              : "bg-black/6 text-black/45",
                          ].join(" ")}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,#f7f1e7_0%,#f2eadf_100%)] p-6 md:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/45">
                      Tài khoản Blue Peach
                    </p>

                    <h1 className="font-heading text-4xl leading-tight text-black md:text-5xl">
                      Sổ địa chỉ
                    </h1>

                    <p className="mt-4 max-w-[760px] text-sm leading-7 text-black/65">
                      Chọn địa chỉ theo mô hình mới: Tỉnh/Thành phố và Xã/Phường/Đặc khu,
                      sau đó bổ sung địa chỉ chi tiết để dùng cho checkout.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href="/account" className="bp-btn bp-btn--ghost">
                      Về thông tin chung
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="bp-btn bp-btn--ghost disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                        {editingId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-black">
                        Biểu mẫu địa chỉ
                      </h2>
                    </div>

                    {editingId ? (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bp-btn bp-btn--ghost !px-4 !py-2"
                      >
                        Hủy sửa
                      </button>
                    ) : null}
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Tên người nhận">
                        <input
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                        />
                      </FormField>

                      <FormField label="Số điện thoại">
                        <input
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          placeholder="0123 456 789"
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                        />
                      </FormField>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Nhãn địa chỉ">
                        <select
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                        >
                          {ADDRESS_LABEL_OPTIONS.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="Ghi chú">
                        <input
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Ví dụ: Giao giờ hành chính"
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                        />
                      </FormField>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Tỉnh / Thành phố">
                        <select
                          value={provinceCode}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                        >
                          <option value="">Chọn Tỉnh/Thành phố</option>
                          {VN_ADDRESS_OPTIONS.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="Xã / Phường / Đặc khu">
                        <select
                          value={wardCode}
                          onChange={(e) => setWardCode(e.target.value)}
                          disabled={!provinceCode}
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">
                            {provinceCode
                              ? "Chọn Xã/Phường/Đặc khu"
                              : "Chọn Tỉnh/Thành phố trước"}
                          </option>
                          {wardOptions.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </FormField>
                    </div>

                    <FormField label="Địa chỉ chi tiết">
                      <input
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="Số nhà, tên đường"
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                      />
                    </FormField>

                    <FormField label="Thông tin bổ sung">
                      <input
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Tòa nhà, căn hộ, tầng..."
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black/25"
                      />
                    </FormField>

                    <label className="flex items-center gap-3 rounded-[18px] border border-black/8 bg-[#fbfaf7] px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        className="h-4 w-4 rounded border-black/20"
                      />
                      <span className="text-sm text-black/75">
                        Đặt làm địa chỉ mặc định
                      </span>
                    </label>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={[
                          "bp-btn bp-btn--solid border-black",
                          "disabled:cursor-not-allowed disabled:opacity-60",
                        ].join(" ")}
                      >
                        {submitting
                          ? "Đang lưu..."
                          : editingId
                          ? "Lưu cập nhật"
                          : "Thêm địa chỉ"}
                      </button>

                      <button
                        type="button"
                        onClick={resetForm}
                        className="bp-btn bp-btn--ghost"
                      >
                        Làm mới
                      </button>
                    </div>
                  </form>
                </div>

                <div className="rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] md:p-8">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/45">
                    Địa chỉ đã lưu
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-black">
                    Danh sách địa chỉ
                  </h2>

                  {pageLoading ? (
                    <div className="mt-6 rounded-[22px] border border-black/8 bg-[#fbfaf7] px-4 py-5 text-sm text-black/60">
                      Đang tải sổ địa chỉ...
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="mt-6 rounded-[22px] border border-black/8 bg-[#fbfaf7] px-4 py-5 text-sm text-black/60">
                      Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ đầu tiên để bắt đầu.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="rounded-[22px] border border-black/8 bg-[#fbfaf7] p-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-black">
                                  {address.label || "Địa chỉ giao hàng"}
                                </p>

                                {address.is_default ? (
                                  <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                    Mặc định
                                  </span>
                                ) : null}
                              </div>

                              <p className="mt-3 text-sm font-medium text-black/80">
                                {address.recipient_name || "Chưa có người nhận"}
                              </p>
                              <p className="mt-1 text-sm text-black/62">
                                {address.recipient_phone || "Chưa có số điện thoại"}
                              </p>

                              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-black/72">
                                {renderFullAddress(address)}
                              </p>

                              {address.note ? (
                                <p className="mt-2 text-sm text-black/58">
                                  Ghi chú: {address.note}
                                </p>
                              ) : null}
                            </div>

                            <div className="flex flex-wrap gap-2 sm:justify-end">
                              {!address.is_default ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefault(address.id)}
                                  className="bp-btn bp-btn--ghost !px-4 !py-2"
                                >
                                  Đặt mặc định
                                </button>
                              ) : null}

                              <button
                                type="button"
                                onClick={() => handleEdit(address)}
                                className="bp-btn bp-btn--ghost !px-4 !py-2"
                              >
                                Chỉnh sửa
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(address.id)}
                                className="bp-btn bp-btn--ghost !px-4 !py-2"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}
    </main>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-black/75">{label}</span>
      {children}
    </label>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 1 1 6 0v2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 21-1.45-1.32C5.4 15.04 2 11.95 2 8.15 2 5.05 4.42 3 7.3 3c1.7 0 3.33.8 4.7 2.2C13.37 3.8 15 3 16.7 3 19.58 3 22 5.05 22 8.15c0 3.8-3.4 6.89-8.55 11.53L12 21Z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="M5 18l.9 2.1L8 21l-2.1.9L5 24l-.9-2.1L2 21l2.1-.9L5 18Z" />
      <path d="M19 15l1.1 2.4L22.5 18l-2.4 1.1L19 21.5l-1.1-2.4L15.5 18l2.4-1.1L19 15Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </svg>
  );
}