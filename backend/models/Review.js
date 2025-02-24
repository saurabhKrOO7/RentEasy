import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    rental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental", required: false },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
