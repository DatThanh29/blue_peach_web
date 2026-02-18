import { Request, Response, NextFunction } from "express";

/**
 * Protect admin endpoints
 * Expects: Authorization: Bearer <ADMIN_TOKEN>
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.slice(7).trim();
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) {
    console.error("ADMIN_TOKEN not configured");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  if (token !== adminToken) {
    return res.status(403).json({ error: "Forbidden: Invalid admin token" });
  }

  next();
}
