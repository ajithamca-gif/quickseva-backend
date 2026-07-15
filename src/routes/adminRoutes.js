import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/orders", authMiddleware, adminOnly, getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminOnly, updateOrderStatus);

export default router;