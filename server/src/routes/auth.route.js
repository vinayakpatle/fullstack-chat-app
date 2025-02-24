import express from "express";
const router=express.Router();
import {signup,login,logout,updateProfile,authCheck} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",authMiddleware, updateProfile);

router.get("/check",authMiddleware,authCheck);


export default router;