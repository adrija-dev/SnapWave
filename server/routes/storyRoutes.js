import express from "express";

import storyController from "../controllers/storyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    upload.single("image"),
    storyController.createStory
);

router.get("/", authMiddleware, storyController.getStories);

router.delete(
    "/delete/:id",
    authMiddleware,
    storyController.deleteStory
);

export default router;