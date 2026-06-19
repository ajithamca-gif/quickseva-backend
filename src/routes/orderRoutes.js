import express from "express";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,

}from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

//create order(login venum)
router.post("/", authMiddleware,upload.array('file', 3), createOrder);

//get my orders(login venum)
router.get("/my-orders", authMiddleware, getMyOrders);

//get all orders (admin only)
router.get("/all", authMiddleware, getAllOrders);

// get all orders (admin only)
router.put("/:id/status", authMiddleware, updateOrderStatus);

export default router;
