import express from "express";
import {
  getChatMessages,
  markAsSeen,
  markAsSeenForSeller,
  saveChatMessage,
} from "../controllers/chatController.js";
import {
  authenticate,
  authorizeSeller,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:productId", authenticate, getChatMessages);
router.post("/", authenticate, saveChatMessage);
router.put("/:productId/seen", authenticate, markAsSeen);
router.put(
  "/:productId/seen/seller",
  authenticate,
  authorizeSeller,
  markAsSeenForSeller
);

export default router;
