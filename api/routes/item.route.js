import express from "express";
import {
  getItemWithPieces,
  getAvailableItems,
  createItem,
  createPiece,
  getAllItems,
} from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:itemId/pieces", getItemWithPieces);
router.get("/", getAllItems);
router.get("/available", getAvailableItems);
router.post("/:ItemID/pieces", verifyToken, createPiece); // add a new piece to an item


router.post("/", verifyToken, createItem); // add a new item

export default router;
