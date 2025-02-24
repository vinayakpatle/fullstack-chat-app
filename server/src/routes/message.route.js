import express from "express";
const router =express.Router();

import {getUsersForSidebar,getMessages,sendMessage} from "../controllers/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

router.get("/users",authMiddleware,getUsersForSidebar);

router.get("/:id",authMiddleware,getMessages);

router.post("/send/:id",authMiddleware,sendMessage);

export default router;