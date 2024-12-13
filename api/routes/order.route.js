import express from "express";
import {
  getOrder,
  createOrder,
  getOrders,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:id", getOrder);
router.get("/", getOrders);
router.post("/", verifyToken, createOrder);

export default router;
