import { Router } from "express";
import productsRouter from "./products";
import ordersRouter from "./orders";
import categoriesRouter from "./categories";
import adminRouter from "./admin";
import vnpayRouter from "./vnpay";
import bannersRouter from "./banners";
import couponsRouter from "./coupons";
import reviewsRouter from "./reviews";
import aiRouter from "./ai";
import wishlistRouter from "./wishlist";
import notificationsRouter from "./notifications";
import supportRouter from "./support";
import collectionsRouter from "./collections";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "blue-peach-api" });
});

router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/categories", categoriesRouter);
router.use("/banners", bannersRouter);
router.use("/coupons", couponsRouter);
router.use("/reviews", reviewsRouter);
router.use("/ai", aiRouter);
router.use("/wishlist", wishlistRouter);
router.use("/notifications", notificationsRouter);
router.use("/support", supportRouter);
router.use("/collections", collectionsRouter);
router.use("/admin", adminRouter);
router.use("/payments/vnpay", vnpayRouter);

export default router;