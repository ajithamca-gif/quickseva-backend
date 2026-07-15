import express from "express";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// create order (login வேணும்)
router.post("/", authMiddleware, upload.array('file', 3), createOrder);

// get my orders (login வேணும்)
router.get("/my-orders", authMiddleware, getMyOrders);

// get all orders (admin only)
router.get("/all", authMiddleware, adminOnly, getAllOrders);

// update order status (admin only)
router.put("/:id/status", authMiddleware, adminOnly, updateOrderStatus);

export default router;