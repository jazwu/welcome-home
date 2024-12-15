import express from "express";
import {
  getOrderWithItems,
  createOrder,
  addOneItem,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:orderId/items", getOrderWithItems);
router.post("/", verifyToken, createOrder);
router.post("/:orderId", verifyToken, addOneItem);

export default router;
