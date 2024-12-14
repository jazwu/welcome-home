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

router.get("/:itemId/pieces", getItemWithPieces); // get all pieces of an item
router.post("/:ItemID/pieces", verifyToken, createPiece); // add a new piece to an item

router.get("/", getItems); // get available items
router.get("/pieces", getAllItems); // get all items with pieces
router.post("/", verifyToken, createItem); // add a new item

export default router;
