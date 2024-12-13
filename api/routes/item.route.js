import express from "express";
import {
  getPieces,
  getItems,
  createItem,
  createPiece,
} from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:id/pieces", getPieces); // get all pieces of an item
router.post("/:ItemID/pieces", verifyToken, createPiece); // add a new piece to an item

router.get("/", getItems); // get available items
router.post("/", verifyToken, createItem); // add a new item

export default router;
