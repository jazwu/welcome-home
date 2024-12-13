import express from "express";
import { test, logout, getRole } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.post("/logout", logout);
router.get("/:id/roles", getRole);

export default router;
