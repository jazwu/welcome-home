import express from "express";
import { getMainCategories } from "../controllers/category.controller.js";
import { getSubCategories } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getMainCategories);
router.get("/:mainCat", getSubCategories);

export default router;
