import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth";
import adminOrdersRouter from "./orders.admin";

const router = Router();

// áp middleware admin cho toàn bộ /api/admin/*
router.use(requireAdmin);

// admin modules
router.use("/orders", adminOrdersRouter);

export default router;
