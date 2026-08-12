import express from "express";

import userController from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, userController.getProfile);

router.put("/update", authMiddleware, userController.updateProfile);

router.post(
    "/profile-picture",
    authMiddleware,
    upload.single("image"),
    userController.uploadProfilePicture
);

router.get("/search/:keyword", authMiddleware, userController.searchUsers);
router.get("/:id", authMiddleware, userController.getUserById);


export default router;