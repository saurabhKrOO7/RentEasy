import express from "express";
import formidable from "express-formidable";
const router = express.Router();
import {
  authenticate,
  authorizeAdmin,
  authorizeSeller,
} from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

import {
  addProduct,
  fetchAllProducts,
  fetchProductAccordingToPage,
  fetchProductById,
  updateProductDetails,
  removeProduct,
  addProductReview,
  fetchProductByUserId,
} from "../controllers/productController.js";

router
  .route("/")
  .get(fetchProductAccordingToPage)
  .post(authenticate, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, checkId, removeProduct);

router
  .route("/seller/:id")
  .get(authenticate, authorizeSeller, fetchProductByUserId);
export default router;
