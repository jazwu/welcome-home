import express from "express";
import { getRooms, getShelves } from "../controllers/location.controller.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:roomNum/shelves", getShelves);

export default router;
