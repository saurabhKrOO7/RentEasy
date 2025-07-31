import express from "express";
const router = express.Router();
import {
  authenticate,
  authorizeAdmin,
  authorizeSeller,
  authorizeSellerAndAdmin,
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
  .post(authenticate, authorizeSellerAndAdmin, addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router
  .route("/:id")
  .get(fetchProductById)
  .put(
    authenticate,
    authorizeSellerAndAdmin,
    updateProductDetails
  )
  .delete(authenticate, authorizeAdmin, checkId, removeProduct);

router
  .route("/seller/:id")
  .get(authenticate, authorizeSeller, fetchProductByUserId);
export default router;
