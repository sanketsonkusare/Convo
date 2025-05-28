import express from "express";
import { authenticator } from "../middleware/authmiddleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messagecontroller.js";

const router = express.Router();

router.get("/users", authenticator, getUsersForSidebar);
router.get("/:id", authenticator, getMessages);

router.post("/send/:id", authenticator, sendMessage);

export default router;