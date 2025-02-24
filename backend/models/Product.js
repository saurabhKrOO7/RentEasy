import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Other table
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    rentalRate: {
      daily: { type: Number, required: true }, // Daily rental rate
      weekly: { type: Number, default: 0 }, // Weekly rental rate (optional)
      monthly: { type: Number, default: 0 }, // Monthly rental rate (optional)
    },
    availability: { type: Boolean, default: true },
    location: { type: String, required: true },
    condition: {
      type: String,
      enum: ["New", "Used"],
      required: true,
    },
    insuranceStatus: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    quantity: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
