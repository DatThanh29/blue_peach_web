import { Router } from "express";
import productsRouter from "./products";
import ordersRouter from "./orders";



const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "blue-peach-api" });
});

// Mount sub-routes
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);


export default router;
