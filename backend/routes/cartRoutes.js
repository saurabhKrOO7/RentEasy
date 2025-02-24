import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
const router = express.Router();

import {
  getCartItem,
  addToCart,
  deleteFromCart,
  updateCart,
} from "../controllers/cartController.js";

router.route("/").get(authenticate, getCartItem).post(authenticate, addToCart);

router
  .route("/:productId")
  .delete(authenticate, deleteFromCart)
  .patch(authenticate, updateCart);
export default router;
