import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";

type AppRole = "customer" | "staff" | "admin";

type AuthUser = {
  userId: string;
  email?: string | null;
  role: AppRole;
  profile: any;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

async function getProfileByUserId(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing bearer token" });
    }

    const token = authHeader.slice(7).trim();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid session" });
    }

    const profile = await getProfileByUserId(user.id);

    if (!profile) {
      return res.status(403).json({ error: "Forbidden: Profile not found" });
    }

    const role = (profile.role || "customer") as AppRole;

    req.authUser = {
      userId: user.id,
      email: user.email,
      role,
      profile,
    };

    next();
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Authentication failed",
    });
  }
}

export async function requireAdminOrStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return requireAuth(req, res, () => {
    const role = req.authUser?.role;

    if (role !== "admin" && role !== "staff") {
      return res.status(403).json({ error: "Forbidden: Admin or staff only" });
    }

    next();
  });
}

export async function requireAdminOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return requireAuth(req, res, () => {
    const role = req.authUser?.role;

    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin only" });
    }

    next();
  });
}