import express from "express";

import messageController from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/send",
    authMiddleware,
    messageController.sendMessage
);

router.get(
    "/conversations",
    authMiddleware,
    messageController.getConversations
);

router.get(
    "/:conversationId",
    authMiddleware,
    messageController.getMessages
);

export default router;