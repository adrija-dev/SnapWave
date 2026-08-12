import express from "express";

import postController from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    upload.single("image"),
    postController.createPost
);

router.get("/", authMiddleware, postController.getAllPosts);

router.put("/like/:id", authMiddleware, postController.likePost);

router.put("/comment/:id", authMiddleware, postController.commentPost);

router.delete("/delete/:id", authMiddleware, postController.deletePost);

router.get("/user/:userId", authMiddleware, postController.getUserPosts);

export default router;