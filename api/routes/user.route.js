import express from "express";
import {
  test,
  logout,
  getUser,
  addRole,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/logout", logout);
router.get("/:id", verifyToken, getUser);
router.post("/:userName/roles/:roleID", verifyToken, addRole);

export default router;
