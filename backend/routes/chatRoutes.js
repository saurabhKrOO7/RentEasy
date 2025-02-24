import express from "express";
import {
  getChatMessages,
  markAsSeen,
  saveChatMessage,
} from "../controllers/chatController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:productId", authenticate, getChatMessages);
router.post("/", authenticate, saveChatMessage);
router.put("/:productId/seen", authenticate, markAsSeen);

export default router;
