import express from "express";
import { getOrder, createOrder } from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:id", getOrder);
router.post("/create", verifyToken, createOrder);

export default router;
