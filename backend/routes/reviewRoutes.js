import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/authMiddleware.js";
import { getReviews } from "../controllers/reviewController.js";

router.route("/:id").get(authenticate, getReviews);

export default router;
