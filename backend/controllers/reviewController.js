import Review from "../models/Review.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const getReviews = asyncHandler(async (req, res) => {
  try {
    // const reviews = await Review.find({});
    const productId = req.params.id;
    const reviews = await Review.find({ equipment: productId })
      .sort({ createdAt: -1 })
      .populate("equipment", "name")
      .populate("user", "name");
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch reviews!" });
  }
});

export { getReviews };
