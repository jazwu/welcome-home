import express from "express";
import {
  getPieces,
  getItems,
  createItem,
  createPiece,
} from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/:id/pieces", getPieces);
router.post("/:ItemID/pieces", verifyToken, createPiece);

router.get("/", getItems);
router.post("/", verifyToken, createItem);

export default router;
