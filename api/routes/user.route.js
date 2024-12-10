import express from "express";
import { test, logout } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.post("/logout", logout);

export default router;
