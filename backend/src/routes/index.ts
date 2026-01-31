import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "blue-peach-api" });
});

export default router;
