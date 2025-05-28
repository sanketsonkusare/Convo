import express from "express";
import {signup, login, logout, updateProfile, checkAuth} from "../controllers/authcontroller.js";
import { authenticator } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile",authenticator,updateProfile);
router.get("/check",authenticator,checkAuth);

export default router;