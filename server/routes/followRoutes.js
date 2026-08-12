import express from "express";

import followController from "../controllers/followController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.put(
    "/:id",
    authMiddleware,
    followController.followUser
);

router.get(
    "/followers/:id",
    authMiddleware,
    followController.getFollowers
);

router.get(
    "/following/:id",
    authMiddleware,
    followController.getFollowing
);

router.get(
    "/suggested",
    authMiddleware,
    followController.suggestedUsers
);

export default router;