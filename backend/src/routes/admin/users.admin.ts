import { Router } from "express";
import { supabase } from "../../lib/supabase";

const router = Router();

type AppRole = "customer" | "staff" | "admin";

type ListUsersQuery = {
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
  limit?: string;
  offset?: string;
};

type UpdateUserProfilePayload = {
  full_name?: string | null;
  phone?: string | null;
  ngay_sinh?: string | null;
  gioi_tinh?: string | null;
  avatar?: string | null;
};

function toPostgrestQuoted(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function isValidRole(role: unknown): role is AppRole {
  return role === "customer" || role === "staff" || role === "admin";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function normalizeOptionalText(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

async function createUserAdminLog(payload: {
  user_id: string;
  action: string;
  field_name?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  note?: string | null;
  performed_by?: string | null;
  performed_by_role?: string | null;
}) {
  const { error } = await supabase.from("user_admin_logs").insert({
    user_id: payload.user_id,
    action: payload.action,
    field_name: payload.field_name ?? null,
    old_value: payload.old_value ?? null,
    new_value: payload.new_value ?? null,
    note: payload.note ?? null,
    performed_by: payload.performed_by ?? null,
    performed_by_role: payload.performed_by_role ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }
}

router.get("/", async (req, res) => {
  const {
    search = "",
    role = "",
    status = "",
    sort = "created_desc",
    limit = "10",
    offset = "0",
  } = req.query as ListUsersQuery;

  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const safeOffset = Math.max(0, Number(offset) || 0);
  const searchText = String(search).trim();
  const roleFilter = String(role).trim();
  const statusFilter = String(status).trim();
  const sortValue = String(sort).trim();

  let query = supabase
    .from("profiles")
    .select(
      `
    user_id,
    full_name,
    email,
    phone,
    role,
    ma_role,
    is_active,
    is_blocked,
    ngay_sinh,
    gioi_tinh,
    avatar,
    created_at,
    updated_at
    `,
      { count: "exact" }
    );

  if (sortValue === "updated_desc") {
    query = query.order("updated_at", { ascending: false });
  } else if (sortValue === "name_asc") {
    query = query.order("full_name", { ascending: true, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (roleFilter && isValidRole(roleFilter)) {
    query = query.eq("role", roleFilter);
  }

  if (statusFilter === "active") {
    query = query.eq("is_active", true).eq("is_blocked", false);
  } else if (statusFilter === "inactive") {
    query = query.eq("is_active", false);
  } else if (statusFilter === "blocked") {
    query = query.eq("is_blocked", true);
  }

  if (searchText) {
    if (isUuid(searchText)) {
      query = query.eq("user_id", searchText);
    } else {
      const pattern = toPostgrestQuoted(`%${searchText}%`);
      query = query.or(
        [
          `full_name.ilike.${pattern}`,
          `email.ilike.${pattern}`,
          `phone.ilike.${pattern}`,
          `role.ilike.${pattern}`,
        ].join(",")
      );
    }
  }

  query = query.range(safeOffset, safeOffset + safeLimit - 1);

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalAdmins } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");

  const { count: totalStaff } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "staff");

  const { count: totalCustomers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  const { count: totalBlocked } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_blocked", true);

  const { count: totalInactive } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_active", false);

  return res.json({
    items: data ?? [],
    total: count ?? 0,
    limit: safeLimit,
    offset: safeOffset,
    search: searchText,
    roleFilter: isValidRole(roleFilter) ? roleFilter : "",
    statusFilter,
    sort: sortValue,
    stats: {
      totalUsers: totalUsers ?? 0,
      totalAdmins: totalAdmins ?? 0,
      totalStaff: totalStaff ?? 0,
      totalCustomers: totalCustomers ?? 0,
      totalBlocked: totalBlocked ?? 0,
      totalInactive: totalInactive ?? 0,
    },
  });
});

router.get("/:id", async (req, res) => {
  const userId = String(req.params.id || "").trim();

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      full_name,
      email,
      phone,
      role,
      ma_role,
      is_active,
      is_blocked,
      ngay_sinh,
      gioi_tinh,
      avatar,
      created_at,
      updated_at
      `
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({
    user: data,
  });
});

router.get("/:id/addresses", async (req, res) => {
  const userId = String(req.params.id || "").trim();

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .select(
      `
      id,
      user_id,
      full_name,
      phone,
      address_line1,
      address_line2,
      ward,
      district,
      city,
      postal_code,
      is_default,
      address_type,
      created_at,
      updated_at
      `
    )
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

router.get("/:id/logs", async (req, res) => {
  const userId = String(req.params.id || "").trim();
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20) || 20));

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const { data, error } = await supabase
    .from("user_admin_logs")
    .select(
      `
      id,
      user_id,
      action,
      field_name,
      old_value,
      new_value,
      note,
      performed_by,
      performed_by_role,
      created_at
      `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
  });
});

router.patch("/:userId/profile", async (req, res) => {
  const userId = String(req.params.userId || "").trim();
  const currentAdminUserId = req.authUser?.userId;
  const currentAdminRole = req.authUser?.role ?? null;
  const body = (req.body ?? {}) as UpdateUserProfilePayload;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const { data: existingProfile, error: existingError } = await supabase
    .from("profiles")
    .select(
      `
      user_id,
      full_name,
      email,
      phone,
      ngay_sinh,
      gioi_tinh,
      avatar,
      role,
      ma_role,
      is_active,
      is_blocked,
      created_at,
      updated_at
      `
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    return res.status(500).json({ error: existingError.message });
  }

  if (!existingProfile) {
    return res.status(404).json({ error: "User profile not found" });
  }

  const nextFullName = normalizeOptionalText(body.full_name);
  const nextPhone = normalizeOptionalText(body.phone);
  const nextNgaySinh = normalizeOptionalText(body.ngay_sinh);
  const nextGioiTinh = normalizeOptionalText(body.gioi_tinh);
  const nextAvatar = normalizeOptionalText(body.avatar);

  if (nextPhone && nextPhone.length > 20) {
    return res.status(400).json({ error: "Số điện thoại không hợp lệ" });
  }

  if (nextNgaySinh) {
    const date = new Date(nextNgaySinh);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ error: "ngay_sinh không hợp lệ" });
    }
  }

  const patch = {
    full_name: nextFullName,
    phone: nextPhone,
    ngay_sinh: nextNgaySinh,
    gioi_tinh: nextGioiTinh,
    avatar: nextAvatar,
    updated_at: new Date().toISOString(),
  };

  const nothingChanged =
    (existingProfile.full_name ?? null) === patch.full_name &&
    (existingProfile.phone ?? null) === patch.phone &&
    (existingProfile.ngay_sinh ?? null) === patch.ngay_sinh &&
    (existingProfile.gioi_tinh ?? null) === patch.gioi_tinh &&
    (existingProfile.avatar ?? null) === patch.avatar;

  if (nothingChanged) {
    return res.json({
      ok: true,
      user: existingProfile,
      message: "Không có thay đổi hồ sơ",
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("user_id", userId)
    .select(
      `
      user_id,
      full_name,
      email,
      phone,
      role,
      ma_role,
      is_active,
      is_blocked,
      ngay_sinh,
      gioi_tinh,
      avatar,
      created_at,
      updated_at
      `
    )
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    const logTasks: Promise<void>[] = [];

    const fieldChanges: Array<{
      field_name: string;
      old_value: string | null;
      new_value: string | null;
      note: string;
    }> = [
        {
          field_name: "full_name",
          old_value: existingProfile.full_name ?? null,
          new_value: patch.full_name,
          note: "Cập nhật full_name từ trang chi tiết người dùng",
        },
        {
          field_name: "phone",
          old_value: existingProfile.phone ?? null,
          new_value: patch.phone,
          note: "Cập nhật phone từ trang chi tiết người dùng",
        },
        {
          field_name: "ngay_sinh",
          old_value: existingProfile.ngay_sinh ?? null,
          new_value: patch.ngay_sinh,
          note: "Cập nhật ngày sinh từ trang chi tiết người dùng",
        },
        {
          field_name: "gioi_tinh",
          old_value: existingProfile.gioi_tinh ?? null,
          new_value: patch.gioi_tinh,
          note: "Cập nhật giới tính từ trang chi tiết người dùng",
        },
        {
          field_name: "avatar",
          old_value: existingProfile.avatar ?? null,
          new_value: patch.avatar,
          note: "Cập nhật avatar từ trang chi tiết người dùng",
        },
      ];

    for (const change of fieldChanges) {
      if (change.old_value !== change.new_value) {
        logTasks.push(
          createUserAdminLog({
            user_id: userId,
            action: "update_profile",
            field_name: change.field_name,
            old_value: change.old_value,
            new_value: change.new_value,
            note: change.note,
            performed_by: currentAdminUserId ?? null,
            performed_by_role: currentAdminRole,
          })
        );
      }
    }

    await Promise.all(logTasks);
  } catch (logError: any) {
    return res.status(500).json({
      error: `Cập nhật hồ sơ thành công nhưng ghi log thất bại: ${logError.message}`,
    });
  }

  return res.json({
    ok: true,
    user: data,
    message: "Cập nhật hồ sơ người dùng thành công",
  });
});

router.patch("/:userId/role", async (req, res) => {
  const userId = String(req.params.userId || "").trim();
  const nextRole = String(req.body?.role || "").trim() as AppRole;
  const currentAdminUserId = req.authUser?.userId;
  const currentAdminRole = req.authUser?.role ?? null;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  if (!isValidRole(nextRole)) {
    return res.status(400).json({
      error: "Invalid role. Allowed roles: customer, staff, admin",
    });
  }

  if (userId === currentAdminUserId) {
    return res.status(400).json({
      error: "Bạn không thể tự đổi role của chính mình.",
    });
  }

  const { data: existingProfile, error: existingError } = await supabase
    .from("profiles")
    .select("user_id, full_name, email, role, ma_role")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    return res.status(500).json({ error: existingError.message });
  }

  if (!existingProfile) {
    return res.status(404).json({ error: "User profile not found" });
  }

  if (existingProfile.role === nextRole) {
    return res.json({
      ok: true,
      user: existingProfile,
      message: "Role không thay đổi",
    });
  }

  const oldRole = existingProfile.role ?? null;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      role: nextRole,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select(
      `
      user_id,
      full_name,
      email,
      phone,
      role,
      ma_role,
      is_active,
      is_blocked,
      ngay_sinh,
      gioi_tinh,
      avatar,
      created_at,
      updated_at
      `
    )
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    await createUserAdminLog({
      user_id: userId,
      action: "change_role",
      field_name: "role",
      old_value: oldRole,
      new_value: nextRole,
      note: "Thay đổi role từ trang quản lý người dùng",
      performed_by: currentAdminUserId ?? null,
      performed_by_role: currentAdminRole,
    });
  } catch (logError: any) {
    return res.status(500).json({
      error: `Cập nhật role thành công nhưng ghi log thất bại: ${logError.message}`,
    });
  }

  return res.json({
    ok: true,
    user: data,
    message: "Cập nhật role thành công",
  });
});

router.patch("/:userId/status", async (req, res) => {
  const userId = String(req.params.userId || "").trim();
  const currentAdminUserId = req.authUser?.userId;
  const currentAdminRole = req.authUser?.role ?? null;

  const isActive =
    typeof req.body?.is_active === "boolean" ? req.body.is_active : undefined;
  const isBlocked =
    typeof req.body?.is_blocked === "boolean" ? req.body.is_blocked : undefined;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  if (userId === currentAdminUserId) {
    return res.status(400).json({
      error: "Bạn không thể tự thay đổi trạng thái của chính mình.",
    });
  }

  if (isActive === undefined && isBlocked === undefined) {
    return res.status(400).json({
      error: "Cần truyền is_active hoặc is_blocked",
    });
  }

  const { data: existingProfile, error: existingError } = await supabase
    .from("profiles")
    .select("user_id, full_name, is_active, is_blocked")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    return res.status(500).json({ error: existingError.message });
  }

  if (!existingProfile) {
    return res.status(404).json({ error: "User profile not found" });
  }

  const patch: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (isActive !== undefined) patch.is_active = isActive;
  if (isBlocked !== undefined) patch.is_blocked = isBlocked;

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("user_id", userId)
    .select(
      `
      user_id,
      full_name,
      email,
      phone,
      role,
      ma_role,
      is_active,
      is_blocked,
      ngay_sinh,
      gioi_tinh,
      avatar,
      created_at,
      updated_at
      `
    )
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  try {
    if (isActive !== undefined && existingProfile.is_active !== isActive) {
      await createUserAdminLog({
        user_id: userId,
        action: "update_status",
        field_name: "is_active",
        old_value: String(existingProfile.is_active),
        new_value: String(isActive),
        note: "Cập nhật trạng thái active từ trang quản lý người dùng",
        performed_by: currentAdminUserId ?? null,
        performed_by_role: currentAdminRole,
      });
    }

    if (isBlocked !== undefined && existingProfile.is_blocked !== isBlocked) {
      await createUserAdminLog({
        user_id: userId,
        action: "update_status",
        field_name: "is_blocked",
        old_value: String(existingProfile.is_blocked),
        new_value: String(isBlocked),
        note: "Cập nhật trạng thái block từ trang quản lý người dùng",
        performed_by: currentAdminUserId ?? null,
        performed_by_role: currentAdminRole,
      });
    }
  } catch (logError: any) {
    return res.status(500).json({
      error: `Cập nhật trạng thái thành công nhưng ghi log thất bại: ${logError.message}`,
    });
  }

  return res.json({
    ok: true,
    user: data,
    message: "Cập nhật trạng thái người dùng thành công",
  });
});

export default router;