import express from "express";
import {
  getPieces,
  getItems,
  createItem,
} from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:id", getPieces);
router.get("/", getItems);
router.post("/create", verifyToken, createItem);

export default router;
