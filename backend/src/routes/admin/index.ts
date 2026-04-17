import { Router } from "express";
import {
  requireAdminOnly,
  requireAdminOrStaff,
} from "../../middlewares/auth";

import adminOrdersRouter from "./orders.admin";
import adminDashboardRouter from "./dashboard.admin";
import adminProductsRouter from "./products.admin";
import adminCategoriesRouter from "./categories.admin";
import adminReportsRouter from "./reports.admin";
import adminBannersRouter from "./banners.admin";
import adminCouponsRouter from "./coupons.admin";
import adminInventoryRouter from "./inventory.admin";
import adminUsersRouter from "./users.admin";
import adminReviewsRouter from "./reviews.admin";
import adminNotificationsRouter from "./notifications.admin";
import adminChatRouter from "./chat.admin";
import uploadRouter from "./upload";
import productImagesRouter from "./product-images";

const router = Router();

router.get("/me", requireAdminOrStaff, (req, res) => {
  return res.json({
    user: req.authUser,
  });
});

router.use("/dashboard", requireAdminOrStaff, adminDashboardRouter);
router.use("/orders", requireAdminOrStaff, adminOrdersRouter);
router.use("/products", requireAdminOrStaff, adminProductsRouter);
router.use("/categories", requireAdminOrStaff, adminCategoriesRouter);
router.use("/reports", requireAdminOrStaff, adminReportsRouter);
router.use("/banners", requireAdminOrStaff, adminBannersRouter);
router.use("/coupons", requireAdminOrStaff, adminCouponsRouter);
router.use("/inventory", requireAdminOrStaff, adminInventoryRouter);
router.use("/reviews", requireAdminOrStaff, adminReviewsRouter);
router.use("/notifications", requireAdminOrStaff, adminNotificationsRouter);
router.use("/chat", requireAdminOrStaff, adminChatRouter);
router.use("/upload", requireAdminOrStaff, uploadRouter);
router.use("/product-images", requireAdminOrStaff, productImagesRouter);

router.use("/users", requireAdminOnly, adminUsersRouter);

router.get("/admin-only-check", requireAdminOnly, (_req, res) => {
  return res.json({ ok: true, scope: "admin-only" });
});

export default router;