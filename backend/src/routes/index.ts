import { Router } from "express";
import productsRouter from "./products";
import ordersRouter from "./orders";
import adminRouter from "./admin";



const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "blue-peach-api" });
});

// Mount sub-routes
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);

// Admin routes
router.use("/admin", adminRouter);


export default router;
