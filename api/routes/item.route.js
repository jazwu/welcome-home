import express from "express";
import {
  getItemWithPieces,
  getAvailableItems,
  createItem,
  addPiece,
  getAllItems,
} from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:itemId/pieces", getItemWithPieces);
router.get("/", getAllItems);
router.get("/available", getAvailableItems);
router.post("/:itemId/pieces", verifyToken, addPiece);
router.post("/", verifyToken, createItem);

export default router;
