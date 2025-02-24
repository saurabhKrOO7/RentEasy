import express from "express";
const router = express.Router();
import { authenticate } from "../middlewares/authMiddleware.js";

import {
  addProductToWishlist,
  removeProductFromWishlist,
  getProductFromWishlist,
} from "../controllers/wishlistController.js";

router.route("/add").post(authenticate, addProductToWishlist);
router.route("/remove").post(authenticate, removeProductFromWishlist);
router.route("/get/:id").get(authenticate, getProductFromWishlist);

export default router;
