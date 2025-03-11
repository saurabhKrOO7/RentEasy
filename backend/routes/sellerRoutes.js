import express from "express";
const router = express.Router();
import formidable from "express-formidable";
import {
  authenticate,
  authorizeSeller,
} from "../middlewares/authMiddleware.js";

import {
  getSellerEarnings,
  getSellerEarningsByDate,
  showAllOrdersOfSeller,
  approveOrder,
  rejectOrder,
  getSellerEarningsByMonth,
} from "../controllers/sellerController.js";
import {
  getSellerChats,
  getUnseenMessages,
  saveChatMessageFromSeller,
} from "../controllers/chatController.js";
import { removeProduct } from "../controllers/productController.js";

router.route("/").get(authenticate, authorizeSeller, getSellerEarnings);
router
  .route("/date/:startDate/:endDate")
  .get(authenticate, authorizeSeller, getSellerEarningsByDate);
router
  .route("/month/:year")
  .get(authenticate, authorizeSeller, getSellerEarningsByMonth);
router
  .route("/orders")
  .get(authenticate, authorizeSeller, showAllOrdersOfSeller);
router
  .route("/orders/:_id/approve")
  .put(authenticate, authorizeSeller, approveOrder);

router
  .route("/orders/:_id/reject")
  .put(authenticate, authorizeSeller, rejectOrder);

router
  .route("/chats/:buyerId/:productId")
  .get(authenticate, authorizeSeller, getSellerChats);

router
  .route("/unseen-chats")
  .get(authenticate, authorizeSeller, getUnseenMessages);

router
  .route("/save-chat")
  .post(authenticate, authorizeSeller, saveChatMessageFromSeller);

router.route("/:id").delete(authenticate, authorizeSeller, removeProduct);

export default router;
