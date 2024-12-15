import express from "express";
import {
  getItemWithPieces,
  getItems,
  createItem,
  createPiece,
  getAllItems,
} from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:itemId/pieces", getItemWithPieces);
router.get("/", getAllItems);
router.post("/:ItemID/pieces", verifyToken, createPiece); // add a new piece to an item

router.get("/", getItems); // get available items
router.post("/", verifyToken, createItem); // add a new item

export default router;
