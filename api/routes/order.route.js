import express from "express";
import {
  getOrderWithItems,
  createOrder,
  getOrders,
  addItems,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:orderId/items", getOrderWithItems);
router.get("/", getOrders);
router.post("/", verifyToken, createOrder);
router.post("/:orderID", verifyToken, addItems);

export default router;
